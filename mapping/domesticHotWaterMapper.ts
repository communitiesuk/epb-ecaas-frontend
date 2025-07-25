import { ColdWaterSourceType } from "~/schema/api-schema.types";
import type { SchemaBathDetails, SchemaHotWaterSourceDetails, SchemaOtherWaterUseDetails, SchemaShower, SchemaStorageTank, SchemaWaterPipework, SchemaWaterPipeworkSimple } from "~/schema/api-schema.types";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import { defaultElectricityEnergySupplyName } from "./common";

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
			Distribution: distribution
		},
		HotWaterSource: {
			"hw cylinder": hotWaterSources[0]!, // FHS input schema currently only allows for one hot water cylinder while the frontend allows users to add multiple
		}
	};
}

function mapShowersData(state: ResolvedState) {
	const mixedShowerEntries = state.domesticHotWater.hotWaterOutlets.mixedShower.map((x):[string, SchemaShower] => {
		const key = x.name;
		const val: SchemaShower = {
			type: "MixerShower",
			ColdWaterSource: ColdWaterSourceType.mains_water,
			flowrate: x.flowRate,
		};

		return [key, val];
	});

	const electricShowerEntries = state.domesticHotWater.hotWaterOutlets.electricShower.map((x):[string, SchemaShower] => {
		const key = x.name;
		const val: SchemaShower = {
			type: "InstantElecShower",
			ColdWaterSource: ColdWaterSourceType.mains_water,
			rated_power: x.ratedPower,
			EnergySupply: defaultElectricityEnergySupplyName
		};

		return [key, val];
	});

	return Object.fromEntries([...mixedShowerEntries, ...electricShowerEntries]);
}

function mapBathsData(state: ResolvedState) {
	const bathEntries = state.domesticHotWater.hotWaterOutlets.bath.map((x):[string, SchemaBathDetails] => {
		const key = x.name;
		const val: SchemaBathDetails = {
			ColdWaterSource: ColdWaterSourceType.mains_water,
			flowrate: x.flowRate,
			size: x.size
		};

		return [key, val];
	});

	return Object.fromEntries(bathEntries);
}

function mapOthersData(state: ResolvedState) {
	const otherEntries = state.domesticHotWater.hotWaterOutlets.otherOutlets.map((x):[string, SchemaOtherWaterUseDetails] => {
		const key = x.name;
		const val: SchemaOtherWaterUseDetails = {
			ColdWaterSource: ColdWaterSourceType.mains_water,
			flowrate: x.flowRate,
		};

		return [key, val];
	});

	return Object.fromEntries(otherEntries);
}

export function mapDistributionData(state: ResolvedState) {
	return state.domesticHotWater.pipework.secondaryPipework.map((x): SchemaWaterPipeworkSimple => {
		return {
			length: x.length,
			location: x.location,
			internal_diameter_mm: x.internalDiameter
		};
	});
}

export function mapHotWaterSourcesData(state: ResolvedState) {
	return state.domesticHotWater.waterHeating.hotWaterCylinder.map((x): SchemaHotWaterSourceDetails => {
		const referencedHeatPump = state.heatingSystems.heatGeneration.heatPump.find(heat_pump => heat_pump.id === x.heatSource);
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
				pipe_contents: x.pipeContents
			};
		});

		const val: SchemaStorageTank = {
			ColdWaterSource: ColdWaterSourceType.mains_water,
			daily_losses: x.dailyEnergyLoss,
			type: "StorageTank",
			volume: x.tankVolume,
			HeatSource: {
				// Adding these values as default until heat pump is set up to come from PCDB
				[heatPumpName]: {
					name: heatPumpName,
					EnergySupply: defaultElectricityEnergySupplyName, 
					heater_position: 0.1,
					type: "HeatSourceWet",
					temp_flow_limit_upper: 65,
					thermostat_position: 0.33
				}
			},
			...(primaryPipeworkEntries.length !== 0 ? { primary_pipework: primaryPipeworkEntries } : {}),
		};

		return val;		
	});
}