import type { SchemaBathDetails, SchemaColdWaterSourceType, SchemaHotWaterSourceDetails, SchemaOtherWaterUseDetails, SchemaWaterPipework } from "~/schema/aliases";
import type { SchemaInstantElecShower, SchemaMixerShower, SchemaSmartHotWaterTank, SchemaStorageTank } from "~/schema/api-schema.types";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import { defaultElectricityEnergySupplyName } from "./common";
import { asLitres } from "~/utils/units/volume";


export function mapDomesticHotWaterData(state: ResolvedState): Partial<FhsInputSchema> {
	const showers = mapShowersData(state);
	const baths = mapBathsData(state);
	const others = mapOthersData(state);
	const hotWaterSources = mapHotWaterSourcesData(state);

	return {
		HotWaterDemand: {
			Shower: showers,
			Bath: baths,
			Other: others,
		},
		HotWaterSource: {
			"hw cylinder": hotWaterSources[0]!, // FHS input schema currently only allows for one hot water cylinder while the frontend allows users to add multiple
		},
	};
}

function mapShowersData(state: ResolvedState) {
	const mixedShowerEntries = state.domesticHotWaterNew.hotWaterOutlets.filter(x => x.typeOfHotWaterOutlet === "mixedShower").map((x): [string, SchemaMixerShower] => {
		const key = x.name;
		const WWHRS_configuration = {
			instantaneousSystemA: "A",
			instantaneousSystemB: "B",
			instantaneousSystemC: "C",
		} as const;
		const val: SchemaMixerShower = {
			type: "MixerShower",
			ColdWaterSource: "mains water",
			flowrate: x.flowRate,
			HotWaterSource: x.heatSource,
		};
		if (x.wwhrs) {
			val.WWHRS = x.wwhrsProductReference;
			val.WWHRS_configuration = WWHRS_configuration[x.wwhrsType];
		}



		return [key, val];
	});

	const electricShowerEntries = state.domesticHotWaterNew.hotWaterOutlets.filter(x => x.typeOfHotWaterOutlet === "electricShower").map((x): [string, SchemaInstantElecShower] => {
		const key = x.name;
		const val: SchemaInstantElecShower = {
			type: "InstantElecShower",
			ColdWaterSource: "mains water",
			rated_power: x.ratedPower,
			EnergySupply: defaultElectricityEnergySupplyName,
		};


		return [key, val];
	});

	return Object.fromEntries([...mixedShowerEntries, ...electricShowerEntries]);
}

function mapBathsData(state: ResolvedState) {
	const bathEntries = state.domesticHotWaterNew.hotWaterOutlets.filter(x => x.typeOfHotWaterOutlet === "bath").map((x): [string, SchemaBathDetails] => {
		const key = x.name;
		const val: SchemaBathDetails = {
			ColdWaterSource: "mains water",
			size: x.size,
		};

		return [key, val];
	});

	return Object.fromEntries(bathEntries);
}

function mapOthersData(state: ResolvedState) {
	const otherEntries = state.domesticHotWaterNew.hotWaterOutlets.filter(x => x.typeOfHotWaterOutlet === "otherHotWaterOutlet").map((x): [string, SchemaOtherWaterUseDetails] => {
		const key = x.name;
		const val: SchemaOtherWaterUseDetails = {
			ColdWaterSource: "mains water",
			flowrate: x.flowRate,
		};

		return [key, val];
	});

	return Object.fromEntries(otherEntries);
}

export function mapHotWaterSourcesData(state: ResolvedState) {
	return state.domesticHotWaterNew.waterStorage.map((ws): SchemaHotWaterSourceDetails => {

		const referencedHeatSource = state.domesticHotWaterNew.heatSources
			.find(heatSource => heatSource.id === ws.heatSourceId);

		if (!referencedHeatSource) {
			throw new Error("referenced heat source for water storage not found");
		}

		const heatSourceName = referencedHeatSource
			? referencedHeatSource.isExistingHeatSource
				? state.spaceHeating.heatSource
					.find(hs => hs.id === referencedHeatSource.id)?.name ?? "Heat source"
				: referencedHeatSource.name
			: "Heat source";

		const coldWaterSource: SchemaColdWaterSourceType = ({
			mainsWater: "mains water",
			headerTank: "header tank",
		} as const)[referencedHeatSource.coldWaterSource];

		const pipeworkEntries = state.domesticHotWaterNew.pipework.map((x): SchemaWaterPipework => {
			if (x.location !== "heatedSpace" && x.location !== "unheatedSpace") {
				throw new Error("invalid location property on pipework");
			}
			return {
				location: x.location === "heatedSpace" ? "internal" : "external",
				internal_diameter_mm: x.internalDiameter,
				external_diameter_mm: x.externalDiameter,
				length: x.length,
				insulation_thermal_conductivity: x.thermalConductivity,
				insulation_thickness_mm: x.insulationThickness,
				surface_reflectivity: x.surfaceReflectivity,
				pipe_contents: x.pipeContents,
			};
		});

		if (ws.typeOfWaterStorage === "hotWaterCylinder") {
			let storageCylinderVolumeInLitres: number;

			if (typeof ws.storageCylinderVolume === "number") {
				storageCylinderVolumeInLitres = ws.storageCylinderVolume;
			} else {
				storageCylinderVolumeInLitres = asLitres(ws.storageCylinderVolume);
			}
			
			const val: SchemaStorageTank & { ColdWaterSource: SchemaColdWaterSourceType } = {
				daily_losses: ws.dailyEnergyLoss,
				type: "StorageTank",
				volume: storageCylinderVolumeInLitres,
				ColdWaterSource: coldWaterSource,
				HeatSource: {
					[heatSourceName]: {
						name: heatSourceName,
						EnergySupply: defaultElectricityEnergySupplyName,
						heater_position: ws.heaterPosition,
						type: "HeatSourceWet",
						thermostat_position: ws.thermostatPosition,
						temp_flow_limit_upper: 65,
					},
				},
				...(pipeworkEntries.length !== 0 ? { primary_pipework: pipeworkEntries } : {}),
				init_temp: ws.initialTemperature,
			};
			return val;
		} else if (ws.typeOfWaterStorage === "smartHotWaterTank") {
			//error here is because the FHS schema json file needs to be updated to support product reference types on smart hot water tanks
			const val: SchemaSmartHotWaterTank & { ColdWaterSource: SchemaColdWaterSourceType } = {
				type: "SmartHotWaterTank",
				product_reference: ws.productReference,
				EnergySupply_pump: defaultElectricityEnergySupplyName,
				ColdWaterSource: "mains water", // Needs changing to reference `referencedHeatSource` once hot water source branch is merged
				volume: 0, // temporarily added until schema corrected to exclude as coming from PCDB
				daily_losses: 0, // temporarily added until schema corrected to exclude as coming from PCDB
				HeatSource: {
					[heatSourceName]: {
						name: heatSourceName,
						EnergySupply: defaultElectricityEnergySupplyName,
						heater_position: ws.heaterPosition,
						type: "HeatSourceWet",
					},
				},
				...(pipeworkEntries.length !== 0 ? { primary_pipework: pipeworkEntries } : {}),
			};
			return val;
		} else throw new Error("invalid water storage type");

	});
}
