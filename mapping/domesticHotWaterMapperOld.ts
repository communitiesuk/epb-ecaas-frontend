import type { SchemaBathDetails, SchemaHotWaterSourceDetails, SchemaOtherWaterUseDetails, SchemaShower, SchemaWaterPipework, SchemaColdWaterSourceType } from "~/schema/aliases";
import type { SchemaStorageTank } from "~/schema/api-schema.types";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import { defaultElectricityEnergySupplyName } from "./common";
import { asLitres } from "../utils/units/volume";

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
	const mixedShowerEntries = state.domesticHotWater.hotWaterOutlets.mixedShower.map((x): [string, SchemaShower] => {
		const key = x.name;
		const val: SchemaShower = {
			type: "MixerShower",
			ColdWaterSource: "mains water",
			flowrate: x.flowRate,
		};

		return [key, val];
	});

	const electricShowerEntries = state.domesticHotWater.hotWaterOutlets.electricShower.map((x): [string, SchemaShower] => {
		const key = x.name;
		const val: SchemaShower = {
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
	const bathEntries = state.domesticHotWater.hotWaterOutlets.bath.map((x): [string, SchemaBathDetails] => {
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
	const otherEntries = state.domesticHotWater.hotWaterOutlets.otherOutlets.map((x): [string, SchemaOtherWaterUseDetails] => {
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
	return state.domesticHotWater.waterHeating.hotWaterCylinder.map((x): SchemaHotWaterSourceDetails => {
		const referencedHeatPump = state.spaceHeating.heatSource.find(heat_source => heat_source.id === x.heatSource);
		const heatPumpName = referencedHeatPump ? referencedHeatPump.name : "Heat pump";
		const primaryPipeworkEntries = state.domesticHotWater.pipework.primaryPipework.filter(pipework => pipework.hotWaterCylinder === x.id).map((x): SchemaWaterPipework => {
			return {
				location: x.location,
				internal_diameter_mm: x.internalDiameter,
				external_diameter_mm: x.externalDiameter,
				length: x.length,
				insulation_thermal_conductivity: x.thermalConductivity,
				insulation_thickness_mm: x.insulationThickness,
				surface_reflectivity: x.surfaceReflectivity,
				pipe_contents: x.pipeContents,
			};
		});

		let storageCylinderVolumeInLitres: number;

		if (typeof x.storageCylinderVolume === "number") {
			storageCylinderVolumeInLitres = x.storageCylinderVolume;
		} else {
			storageCylinderVolumeInLitres = asLitres(x.storageCylinderVolume);
		}

		const val: SchemaStorageTank & { ColdWaterSource: SchemaColdWaterSourceType } = {
			daily_losses: x.dailyEnergyLoss,
			type: "StorageTank",
			volume: storageCylinderVolumeInLitres,
			ColdWaterSource: "mains water" as SchemaColdWaterSourceType, // a cold water source is de facto required here
			HeatSource: {
				// Adding these values as default until heat pump is set up to come from PCDB
				[heatPumpName]: {
					name: heatPumpName,
					EnergySupply: defaultElectricityEnergySupplyName,
					heater_position: 0.1,
					type: "HeatSourceWet",
					thermostat_position: 0.33,
					temp_flow_limit_upper: 65,
				},
			},
			...(primaryPipeworkEntries.length !== 0 ? { primary_pipework: primaryPipeworkEntries } : {}),
			init_temp: 20.0, // TODO this is an initial guess; decide on number, if one needs to be passed
		};

		return val;
	});
}