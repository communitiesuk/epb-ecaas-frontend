import type { SchemaBathDetails, SchemaHotWaterSourceDetails, SchemaOtherWaterUseDetails, SchemaShower } from "~/schema/aliases";
import type { SchemaStorageTank, SchemaWaterPipework, SchemaWaterPipeworkSimple } from "~/schema/api-schema.types";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import { defaultControlMaxName, defaultControlMinName, defaultElectricityEnergySupplyName } from "./common";
import { asLitres } from "../utils/units/volume";

export function mapDomesticHotWaterData(state: ResolvedState): Partial<FhsInputSchema> {
	const showers = mapShowersData(state);
	const baths = mapBathsData(state);
	const others = mapOthersData(state);
	const distribution = mapDistributionData(state);
	const hotWaterSources = mapHotWaterSourcesData(state);

	return {
		HotWaterDemand: {
			Shower: showers,
			Bath: baths,
			Other: others,
			Distribution: distribution,
		},
		HotWaterSource: {
			"hw cylinder": hotWaterSources[0]!, // FHS input schema currently only allows for one hot water cylinder while the frontend allows users to add multiple
		},
	};
}

function mapShowersData(state: ResolvedState) {
	const mixedShowerEntries = state.domesticHotWater.hotWaterOutlets.mixedShower.map((x):[string, SchemaShower] => {
		const key = x.data.name;
		const val: SchemaShower = {
			type: "MixerShower",
			ColdWaterSource: "mains water",
			flowrate: x.data.flowRate,
		};

		return [key, val];
	});

	const electricShowerEntries = state.domesticHotWater.hotWaterOutlets.electricShower.map((x):[string, SchemaShower] => {
		const key = x.data.name;
		const val: SchemaShower = {
			type: "InstantElecShower",
			ColdWaterSource: "mains water",
			rated_power: x.data.ratedPower,
			EnergySupply: defaultElectricityEnergySupplyName,
		};

		return [key, val];
	});

	return Object.fromEntries([...mixedShowerEntries, ...electricShowerEntries]);
}

function mapBathsData(state: ResolvedState) {
	const bathEntries = state.domesticHotWater.hotWaterOutlets.bath.map((x):[string, SchemaBathDetails] => {
		const key = x.data.name;
		const val: SchemaBathDetails = {
			ColdWaterSource: "mains water",
			flowrate: x.data.flowRate,
			size: x.data.size,
		};

		return [key, val];
	});

	return Object.fromEntries(bathEntries);
}

function mapOthersData(state: ResolvedState) {
	const otherEntries = state.domesticHotWater.hotWaterOutlets.otherOutlets.map((x):[string, SchemaOtherWaterUseDetails] => {
		const key = x.data.name;
		const val: SchemaOtherWaterUseDetails = {
			ColdWaterSource: "mains water",
			flowrate: x.data.flowRate,
		};

		return [key, val];
	});

	return Object.fromEntries(otherEntries);
}

export function mapDistributionData(state: ResolvedState) {
	return state.domesticHotWater.pipework.secondaryPipework.map((x): SchemaWaterPipeworkSimple => {
		return {
			length: x.data.length,
			location: x.data.location,
			internal_diameter_mm: x.data.internalDiameter,
		};
	});
}

export function mapHotWaterSourcesData(state: ResolvedState) {
	return state.domesticHotWater.waterHeating.hotWaterCylinder.map((x): SchemaHotWaterSourceDetails => {
		const referencedHeatPump = state.heatingSystems.heatGeneration.heatPump.find(heat_pump => heat_pump.data.id === x.heatSource);
		const heatPumpName = referencedHeatPump ? referencedHeatPump.data.name : "Heat pump";
		const primaryPipeworkEntries = state.domesticHotWater.pipework.primaryPipework.filter(pipework => pipework.data.hotWaterCylinder === x.id).map((x): SchemaWaterPipework => {
			return {
				location: x.data.location,
				internal_diameter_mm: x.data.internalDiameter,
				external_diameter_mm: x.data.externalDiameter,
				length: x.data.length,
				insulation_thermal_conductivity: x.data.thermalConductivity,
				insulation_thickness_mm: x.data.insulationThickness,
				surface_reflectivity: x.data.surfaceReflectivity,
				pipe_contents: x.data.pipeContents,
			};
		});

		let storageCylinderVolumeInLitres: number;

		if (typeof x.storageCylinderVolume === "number") {
			storageCylinderVolumeInLitres = x.storageCylinderVolume;
		} else  {
			storageCylinderVolumeInLitres = asLitres(x.storageCylinderVolume);
		} 

		const val: SchemaStorageTank = {
			ColdWaterSource: "mains water",
			daily_losses: x.dailyEnergyLoss,
			type: "StorageTank",
			volume: storageCylinderVolumeInLitres,
			HeatSource: {
				// Adding these values as default until heat pump is set up to come from PCDB
				[heatPumpName]: {
					name: heatPumpName,
					EnergySupply: defaultElectricityEnergySupplyName, 
					heater_position: 0.1,
					type: "HeatSourceWet",
					temp_flow_limit_upper: 65,
					thermostat_position: 0.33,
					Controlmax: defaultControlMaxName,
					Controlmin: defaultControlMinName,
				},
			},
			...(primaryPipeworkEntries.length !== 0 ? { primary_pipework: primaryPipeworkEntries } : {}),
			init_temp: 20.0, // TODO this is an initial guess; decide on number, if one needs to be passed
		};

		return val;		
	});
}