import type { ResolvedState } from "./fhsInputMapper";
import type { HeatEmittingData, WetDistributionEmitterData } from "../stores/ecaasStore.schema";
import type {
	SchemaElecStorageHeaterWithProductReference,
	SchemaFancoilWithProductReference,
	SchemaHeatSourceWetHeatBattery,
	SchemaHeatSourceWetHeatPump,
	SchemaInstantElecHeater,
	SchemaRadiatorWithProductReference,
	SchemaUfhWithProductReference,
	SchemaWarmAir,
	SchemaWetDistribution,
	SchemaEcoDesignControllerNoWeatherCompensator,
	SchemaEcoDesignControllerWeatherCompensator,
	SchemaSolarThermalSystem,
} from "../schema/api-schema.types";
import type { SchemaBoilerWithProductReference, SchemaHeatSourceWetDetails, SchemaSpaceHeatSystem } from "~/schema/aliases";
import { defaultElectricityEnergySupplyName, defaultZoneName } from "./common";
import { objectFromEntries } from "ts-extras";

export function mapHeatPumps(state: ResolvedState): Record<string, SchemaHeatSourceWetHeatPump> {
	const heatSources = state.spaceHeating.heatSource;
	const heatPumps = heatSources.filter(
		(heatSource) => heatSource.typeOfHeatSource === "heatPump",
	);

	return objectFromEntries(
		heatPumps.map((heatPump) => {
			const mappedHeatPump: SchemaHeatSourceWetHeatPump = {
				type: "HeatPump",
				product_reference: heatPump.productReference,
				EnergySupply: "",
			};

			return [
				heatPump.name,
				mappedHeatPump,
			];
		}),
	);
}

export function mapBoilers(state: ResolvedState): Record<string, SchemaBoilerWithProductReference> {
	const heatSources = state.spaceHeating.heatSource;
	const boilers = heatSources.filter(
		(heatSource) => heatSource.typeOfHeatSource === "boiler",
	);
	return objectFromEntries(
		boilers.map((boiler): [string, SchemaBoilerWithProductReference] => {
			return [
				boiler.name,
				{
					type: "Boiler",
					product_reference: boiler.productReference,
					...("specifiedLocation" in boiler
						? { specified_location: boiler.specifiedLocation }
						: {}),
				} as const satisfies SchemaBoilerWithProductReference,
			];
		}),
	);
}

export function mapHeatBatteries(state: ResolvedState): Record<string, SchemaHeatSourceWetHeatBattery> {
	const heatSources = state.spaceHeating.heatSource;
	const heatBatteries = heatSources.filter(
		(heatSource) => heatSource.typeOfHeatSource === "heatBattery",
	);
	const heatBatteryTypeMap = {
		"heatBatteryPcm": "pcm",
		"heatBatteryDryCore": "dry_core", 
	} as const;

	return objectFromEntries(
		heatBatteries.map((heatBattery) => {
			return [
				heatBattery.name,
				{
					type: "HeatBattery" as const,
					battery_type: heatBatteryTypeMap[heatBattery.typeOfHeatBattery],
					number_of_units: heatBattery.numberOfUnits,
					product_reference: heatBattery.productReference,
					EnergySupply: heatBattery.energySupply,
				},
			];
		}),
	);
}

//this is likely to be removed, is_heat_network is a property of other heat sources
export function mapHeatNetworks(state: ResolvedState): Record<string, SchemaHeatSourceWetHeatBattery> {
	const heatSources = state.spaceHeating.heatSource;
	const _heatNetworks = heatSources.filter(
		(heatSource) => heatSource.typeOfHeatSource === "heatNetwork",
	);

	return {};
}

export function mapSolarThermalSystems(state: ResolvedState): Record<string, SchemaSolarThermalSystem> {
	const heatSources = state.spaceHeating.heatSource;
	const solarThermals = heatSources.filter(
		(heatSource) => heatSource.typeOfHeatSource === "solarThermalSystem",
	);
	const locationOfCollectorLoopPipingMap = {
		"outside": "OUT",
		"heatedSpace": "HS",
		"unheatedSpace": "NHS",
	} as const;

	return objectFromEntries(solarThermals.map(sTS => {
		return [
			sTS.name,
			{
				type: "SolarThermalSystem" as const,
				heater_position: 1, /////////////// TODO add to form?
				sol_loc: locationOfCollectorLoopPipingMap[
					sTS.locationOfCollectorLoopPiping
				],
				area_module: sTS.collectorModuleArea,
				modules: sTS.numberOfCollectorModules,
				peak_collector_efficiency: sTS.peakCollectorEfficiency,
				incidence_angle_modifier: sTS.incidenceAngleModifier,
				first_order_hlc: sTS.firstOrderHeatLossCoefficient,
				second_order_hlc: sTS.secondOrderHeatLossCoefficient,
				collector_mass_flow_rate: sTS.collectorMassFlowRate,
				power_pump: sTS.powerOfCollectorPump.amount, // TODO confirm units
				power_pump_control: sTS.powerOfCollectorPumpController.amount, // TODO confirm units
				EnergySupply: "", /////////////// TODO add to form?
				tilt: sTS.pitch,
				orientation360: sTS.orientation,
				solar_loop_piping_hlc: sTS.heatLossCoefficientOfSolarLoopPipe,
			},
		];
	}));
}

function mapEcoDesignController<T extends { ecoDesignControllerClass: string, minOutdoorTemp?: number, maxOutdoorTemp?: number, minFlowTemp?: number }>(emitter: T) {
	let ecoDesignController: SchemaEcoDesignControllerNoWeatherCompensator | SchemaEcoDesignControllerWeatherCompensator;
	const ecoDesignControllerClass = parseInt(emitter.ecoDesignControllerClass);
	if ([2, 3, 6, 7].includes(ecoDesignControllerClass)) {
		ecoDesignController = {
			ecodesign_control_class: ecoDesignControllerClass,
			min_outdoor_temp: "maxOutdoorTemp" in emitter ? emitter.minOutdoorTemp : undefined,
			max_outdoor_temp: "minOutdoorTemp" in emitter ? emitter.maxOutdoorTemp : undefined,
			min_flow_temp: "minFlowTemp" in emitter ? emitter.minFlowTemp : undefined,
		} as SchemaEcoDesignControllerWeatherCompensator;
	} else if ([1, 4, 5, 8].includes(ecoDesignControllerClass)) {
		ecoDesignController = {
			ecodesign_control_class: ecoDesignControllerClass,
		} as SchemaEcoDesignControllerNoWeatherCompensator;
	} else {
		throw Error(`Invalid eco design controller class for radiator: ${emitter.ecoDesignControllerClass}`);
	}
	return ecoDesignController;
}





export function mapElectricStorageHeaters(state: ResolvedState): Record<string, SchemaElecStorageHeaterWithProductReference> {
	const { heatEmitters } = state.spaceHeating as {
		heatEmitters?: HeatEmittingData[];
	};

	if (!heatEmitters) {

		return {};
	}
	const electricStorageHeaters = heatEmitters?.filter(
		(emitter): emitter is Extract<HeatEmittingData, { typeOfHeatEmitter: "electricStorageHeater" }> => emitter.typeOfHeatEmitter === "electricStorageHeater",
	);
	return objectFromEntries(
		electricStorageHeaters.map((emitter): [string, SchemaElecStorageHeaterWithProductReference] => {
			return [
				emitter.name,
				{
					type: "ElecStorageHeater",
					product_reference: emitter.productReference,
					n_units: emitter.numOfStorageHeaters,
				},
			];
		}),
	);
}
export function mapWarmAirHeater(state: ResolvedState): Record<string, SchemaWarmAir> {
	const { heatEmitters } = state.spaceHeating as {
		heatEmitters?: HeatEmittingData[];
	};

	if (!heatEmitters) {
		return {};
	}
	const warmAirHeaters = heatEmitters?.filter(
		(emitter): emitter is Extract<HeatEmittingData, { typeOfHeatEmitter: "warmAirHeater" }> => emitter.typeOfHeatEmitter === "warmAirHeater",
	);


	return objectFromEntries(
		warmAirHeaters.map((emitter): [string, SchemaWarmAir] => {
			return [
				emitter.name,
				{
					type: "WarmAir",
					temp_diff_emit_dsgn: emitter.designTempDiffAcrossEmitters,
					frac_convective: emitter.convectionFraction,
					HeatSource: getHeatSourceData(state, emitter),
				},
			];
		}),
	);
}

export function getHeatSourceData(state: ResolvedState, emitter: HeatEmittingData) {
	const temp_flow_limit_upper = getHeatSourceTempFlowLimitUpper(state, emitter);

	return {
		name: getHeatSourceNameForEmitter(state, emitter),
		...(temp_flow_limit_upper ? { temp_flow_limit_upper } : {}),

	};
}

export function getHeatSourceNameForEmitter(state: ResolvedState, emitter: HeatEmittingData): string {
	const heatSources = state.spaceHeating.heatSource;
	const heatSourceName = heatSources.find(
		(heatSource) => {
			if ("heatSource" in emitter) {
				return heatSource.id === emitter.heatSource;
			}
			return false;
		},
	)?.name ?? "";
	return heatSourceName;
}

export function getHeatSourceTempFlowLimitUpper(state: ResolvedState, emitter: HeatEmittingData): number | undefined {
	const heatSources = state.spaceHeating.heatSource;
	const heatSource = heatSources.find(
		(heatSource) => {
			if ("heatSource" in emitter) {
				return heatSource.id === emitter.heatSource;
			}
			return false;
		},
	);
	const maxFlowTemp = heatSource && "maxFlowTemp" in heatSource ? heatSource.maxFlowTemp?.amount : undefined;
	return maxFlowTemp;
}




export function mapInstantElectricHeaters(state: ResolvedState): Record<string, SchemaInstantElecHeater> {
	const { heatEmitters } = state.spaceHeating as {
		heatEmitters?: HeatEmittingData[];
	};

	if (!heatEmitters) {
		return {};
	}
	const instantElecHeaters = heatEmitters?.filter(
		(emitter): emitter is Extract<HeatEmittingData, { typeOfHeatEmitter: "instantElectricHeater" }> => emitter.typeOfHeatEmitter === "instantElectricHeater",
	);

	return objectFromEntries(
		instantElecHeaters.map((emitter): [string, SchemaInstantElecHeater][] => {
			const emitterName = (i: number): string => {
				if (emitter.numOfHeaters === 1) {
					return emitter.name;
				}

				return `${emitter.name} ${i + 1}`;
			};

			// output however many instant electric heaters were indicated in numOfHeaters field
			return [...Array(emitter.numOfHeaters).keys()].map(i => [
				emitterName(i),
				{
					type: "InstantElecHeater",
					rated_power: emitter.ratedPower,
					convective_type: emitter.convectiveType,
					EnergySupply: defaultElectricityEnergySupplyName,
				} as const satisfies SchemaInstantElecHeater,
			]);
		}).flat(),
	);
}

export function mapSpaceHeating(state: ResolvedState): Record<string, SchemaHeatSourceWetDetails> {
	return {
		...mapHeatPumps(state),
		...mapBoilers(state),
		...mapHeatNetworks(state),
		...mapHeatBatteries(state),
		// ...mapSolarThermalSystems(state),
	};
}

function mapEmittersForWetDistribution(emitters: WetDistributionEmitterData[]): (SchemaRadiatorWithProductReference | SchemaUfhWithProductReference | SchemaFancoilWithProductReference)[] {
	if (!emitters) {
		return [];
	}
	return emitters.flatMap((emitter): (SchemaRadiatorWithProductReference | SchemaUfhWithProductReference | SchemaFancoilWithProductReference)[] => {
		if (emitter.typeOfHeatEmitter === "radiator") {
			const radiator = {
				wet_emitter_type: "radiator",
				product_reference: emitter.productReference,
				radiator_type: "standard",
				length: emitter.length,
			} as const satisfies SchemaRadiatorWithProductReference;

			return Array.from({ length: emitter.numOfRadiators }, () => radiator);
		} else if (emitter.typeOfHeatEmitter === "underfloorHeating") {
			return [{
				wet_emitter_type: "ufh",
				product_reference: emitter.productReference,
				emitter_floor_area: emitter.areaOfUnderfloorHeating,
			} as const satisfies SchemaUfhWithProductReference];
		} else if (emitter.typeOfHeatEmitter === "fanCoil") {
			return [{
				wet_emitter_type: "fancoil",
				product_reference: emitter.productReference,
				n_units: emitter.numOfFanCoils,
			} as const satisfies SchemaFancoilWithProductReference];
		} else {
			const emitterType = (emitter as HeatEmittingData).typeOfHeatEmitter as never;
			throw Error(`Invalid heat emitter type for wet distribution system: ${emitterType}`);
		}
	});
}
export function mapWetDistributions(state: ResolvedState): Record<string, SchemaWetDistribution> {

	const { heatEmitters } = state.spaceHeating as {
		heatEmitters?: HeatEmittingData[];
	};
	if (!heatEmitters) {
		return {};
	}
	const wetDistributions = heatEmitters.filter(
		(emitter): emitter is Extract<HeatEmittingData, { typeOfHeatEmitter: "wetDistributionSystem" }> => emitter.typeOfHeatEmitter === "wetDistributionSystem",
	);

	return objectFromEntries(
		wetDistributions.map((wds) => {
			const emitters = wds.emitters ?? [];
			const ecoDesignController = mapEcoDesignController(wds);
			const common = {
				emitters: mapEmittersForWetDistribution(emitters as WetDistributionEmitterData[]),
				EnergySupply: defaultElectricityEnergySupplyName,
				temp_diff_emit_dsgn: wds.designTempDiffAcrossEmitters,
				Zone: defaultZoneName,
				type: "WetDistribution" as const,
				design_flow_temp: wds.designFlowTemp,
				HeatSource: getHeatSourceData(state, wds),
				ecodesign_controller: ecoDesignController,
				bypass_fraction_recirculated: wds.percentageRecirculated / 100,
			};

			const data: SchemaWetDistribution = wds.hasVariableFlowRate
				? { ...common, variable_flow: true, min_flow_rate: wds.minFlowRate, max_flow_rate: wds.maxFlowRate }
				: { ...common, variable_flow: false, design_flow_rate: wds.designFlowRate };
			return [
				wds.name,
				data,
			];
		}),
	);

}

export function mapSpaceHeatSystem(state: ResolvedState): { SpaceHeatSystem: SchemaSpaceHeatSystem } {
	return {
		SpaceHeatSystem: {
			...mapWetDistributions(state),
			...mapElectricStorageHeaters(state),
			...mapWarmAirHeater(state),
			...mapInstantElectricHeaters(state),
		},
	};
}

