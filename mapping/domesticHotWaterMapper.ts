import type { SchemaBathDetails, SchemaColdWaterSourceType, SchemaOtherWaterUseDetails, SchemaWaterPipework, SchemaStorageTank, SchemaHeatSourceWetDetails, SchemaWWHRS } from "~/schema/aliases";
import type { SchemaHeaderTankOrMainsWater, SchemaInstantElecShower, SchemaMixerShower, SchemaSmartHotWaterTank } from "~/schema/api-schema.types";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import { defaultElectricityEnergySupplyName } from "./common";
import { objectFromEntries } from "ts-extras";

export const defaultColdWaterSourceData: SchemaHeaderTankOrMainsWater = {
	start_day: 0,
	temperatures: [3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7],
	time_series_step: 1,
};

export function makeWWHRSName(name:string) {
	return `WWHRS - ${name}`;
} 

export function mapDomesticHotWaterData(state: ResolvedState): Partial<FhsInputSchema> {
	const { showers, WWHRS } = mapShowersData(state);
	const baths = mapBathsData(state);
	const others = mapOthersData(state);
	const hotWaterSources = mapHotWaterSourcesData(state);

	const data: Partial<FhsInputSchema> = { 
		HotWaterDemand: {
			Shower: showers,
			Bath: baths,
			Other: others,
		} ,
		...hotWaterSources,
	};
	if (WWHRS) {
		data["WWHRS"] = WWHRS;
	}
	return data;
}

const coldWaterSourceMap = {
	mainsWater: "mains water",
	headerTank: "header tank",
} as const satisfies Record<
	DomesticHotWaterHeatSourceData["coldWaterSource"],
	SchemaColdWaterSourceType
>;

function mapShowersData(state: ResolvedState) {
	const dhwHeatSource = getDomesticHotWaterHeatSource(state);
	const coldWaterSource = coldWaterSourceMap[dhwHeatSource.coldWaterSource];

	let WWHRS: SchemaWWHRS | undefined = undefined;

	const mixedShowerEntries = state.domesticHotWater.hotWaterOutlets.filter(x => x.typeOfHotWaterOutlet === "mixedShower").map((x): [string, SchemaMixerShower] => {
		const key = x.name;
		const WWHRS_configuration = {
			instantaneousSystemA: "A",
			instantaneousSystemB: "B",
			instantaneousSystemC: "C",
		} as const;
		if (x.wwhrs && x.wwhrsProductReference) {
			WWHRS ??= {};
			WWHRS[makeWWHRSName(x.name)] = {
				product_reference: x.wwhrsProductReference,
				ColdWaterSource: coldWaterSource,
			};
		}
		const mixedShower: SchemaMixerShower = {
			type: "MixerShower",
			ColdWaterSource: coldWaterSource,
			HotWaterSource: "hw cylinder",
			...(x.wwhrs ? {
				WWHRS: makeWWHRSName(x.name),
				WWHRS_configuration: WWHRS_configuration[x.wwhrsType],
			} : {}),
			...(x.isAirPressureShower ? {
				allow_low_flowrate: true as const,
				product_reference: x.airPressureShowerProductReference,
			} : {
				allow_low_flowrate: false as const,
				flowrate: x.flowRate,
			}),
		};

		return [key, mixedShower];
	});

	const electricShowerEntries = state.domesticHotWater.hotWaterOutlets.filter(x => x.typeOfHotWaterOutlet === "electricShower").map((x): [string, SchemaInstantElecShower] => {
		const key = x.name;
		const val: SchemaInstantElecShower = {
			type: "InstantElecShower",
			ColdWaterSource: coldWaterSource,
			rated_power: x.ratedPower,
			EnergySupply: defaultElectricityEnergySupplyName,
		};


		return [key, val];
	});
	
	return { showers: objectFromEntries([...mixedShowerEntries, ...electricShowerEntries]), WWHRS };
}

function mapBathsData(state: ResolvedState) {
	const dhwHeatSource = getDomesticHotWaterHeatSource(state);
	const coldWaterSource = coldWaterSourceMap[dhwHeatSource.coldWaterSource];

	const bathEntries = state.domesticHotWater.hotWaterOutlets.filter(x => x.typeOfHotWaterOutlet === "bath").map((x): [string, SchemaBathDetails] => {
		const key = x.name;
		const val: SchemaBathDetails = {
			ColdWaterSource: coldWaterSource,
			size: x.size,
		};

		return [key, val];
	});

	return objectFromEntries(bathEntries);
}

function mapOthersData(state: ResolvedState) {
	const dhwHeatSource = getDomesticHotWaterHeatSource(state);
	const coldWaterSource = coldWaterSourceMap[dhwHeatSource.coldWaterSource];

	const otherEntries = state.domesticHotWater.hotWaterOutlets.filter(x => x.typeOfHotWaterOutlet === "otherHotWaterOutlet").map((x): [string, SchemaOtherWaterUseDetails] => {
		const key = x.name;
		const val: SchemaOtherWaterUseDetails = {
			ColdWaterSource: coldWaterSource,
			flowrate: x.flowRate,
		};

		return [key, val];
	});

	return objectFromEntries(otherEntries);
}

/**
 * Gets the DHW heat source reference used for DHW-specific metadata, primarily
 * to read `coldWaterSource` when building hot water source payloads.
 *
 * Assumes the selected non-heat-network DHW entry carries the relevant DHW
 * information needed later in mapping.
 */
function getDomesticHotWaterHeatSource(state: ResolvedState) {
	// NOTE: this logic will change upon the redesign of the heat networks section.
	const heatSources = state.domesticHotWater.heatSources.filter(x => x.isExistingHeatSource === true || x.typeOfHeatSource !== "heatNetwork");
	const spaceHeatingHeatSources = (state.spaceHeating.heatSource ?? [])
		.filter(x => x.typeOfHeatSource !== "heatNetwork").map(x => x.id);
	const noneHeatNetworkHeatSources = heatSources.filter(x => {
		if (x.isExistingHeatSource) {
			return !spaceHeatingHeatSources.includes(x.id);
		}
		return true;
	});

	if (noneHeatNetworkHeatSources.length !== 1) {
		throw new Error("Expected exactly one non-heat-network heat source, found " + noneHeatNetworkHeatSources.length);
	}
		
	return noneHeatNetworkHeatSources[0]!;
}

/**
 * Resolves the actual heat source details from either space heating or DHW,
 * depending on where the source was originally created.
 */
function getActualHeatSourceFromDHWHeatSource(state: ResolvedState) {
	const { domesticHotWater, spaceHeating } = state;
	const dhwHeatSources = domesticHotWater.heatSources.filter(x => x.isExistingHeatSource === false);
	const allHeatSources = [...dhwHeatSources, ...(spaceHeating.heatSource ?? [])];
	const noneHeatNetworkHeatSources = allHeatSources.filter(x => x.typeOfHeatSource !== "heatNetwork");
	if (noneHeatNetworkHeatSources.length !== 1) {
		throw new Error("Expected exactly one non-heat-network heat source, found " + noneHeatNetworkHeatSources.length);
	}
	return noneHeatNetworkHeatSources[0]!;
}

function getAssociatedHeatNetwork(state: ResolvedState, associatedHeatNetworkId: string) {
	const associatedHeatNetwork = state.spaceHeating.heatSource?.find(hs => hs.id === associatedHeatNetworkId);

	if (!associatedHeatNetwork) {
		return state.domesticHotWater.heatSources.find(hs => hs.id === associatedHeatNetworkId);
	}
	return associatedHeatNetwork;
}

function mapHeatSourceWet(
	heatSource: Exclude<
		ReturnType<typeof getActualHeatSourceFromDHWHeatSource>,
		| { typeOfHeatSource: "solarThermalSystem" }
		| { typeOfHeatSource: "immersionHeater" }
	>,
	state: ResolvedState,
) {

	const batteryTypeMap = {
		"heatBatteryPcm": "pcm",
		"heatBatteryDryCore": "dry_core",
	} as const;

	const heatNetworkFields = "isConnectedToHeatNetwork" in heatSource && heatSource.isConnectedToHeatNetwork ? {
		is_heat_network: true as const,
		heat_network_type: "communal" as const, // temp
	} : { is_heat_network: false as const, EnergySupply: defaultElectricityEnergySupplyName };
	switch (heatSource.typeOfHeatSource) {
		case "heatInterfaceUnit":
			{
				const associatedHeatNetwork = heatSource.associatedHeatNetworkId ? getAssociatedHeatNetwork(state, heatSource.associatedHeatNetworkId) : undefined;
				const subHeatNetworkName = associatedHeatNetwork && "subHeatNetworkName" in associatedHeatNetwork ? associatedHeatNetwork.subHeatNetworkName : undefined;
				const associatedHeatNetworkName = associatedHeatNetwork && "name" in associatedHeatNetwork ? associatedHeatNetwork.name : undefined;
				if (!subHeatNetworkName || !associatedHeatNetworkName) {
					throw new Error("Expected a sub heat network name, and associated heat network name for a heat interface unit heat source associated with a heat network");
				}
				return {
					HeatSourceWet: {
						[heatSource.name]: {
							type: "HIU" as const,
							product_reference: heatSource.productReference,
							EnergySupply: defaultElectricityEnergySupplyName,
							heat_network_type: "communal" as const, // temp
							heat_network_reference: associatedHeatNetworkName,
							building_level_distribution_losses: heatSource.buildingLevelLosses.amount,
							is_heat_network: true as const,
							sub_heat_network_name: subHeatNetworkName,
						} as const satisfies SchemaHeatSourceWetDetails,
					} satisfies FhsInputSchema["HeatSourceWet"],
				};
			};
		case "heatPump":
			return {
				HeatSourceWet: {
					[heatSource.name]: {
						type: "HeatPump" as const,
						product_reference: heatSource.productReference,
						EnergySupply: defaultElectricityEnergySupplyName,
						...heatNetworkFields,
					} as const satisfies SchemaHeatSourceWetDetails,
				} satisfies FhsInputSchema["HeatSourceWet"],
			};
		case "boiler":
			return {
				HeatSourceWet: {
					[heatSource.name]: {
						type: "Boiler" as const,
						product_reference: heatSource.productReference,
						...("specifiedLocation" in heatSource
							? { specified_location: heatSource.specifiedLocation }
							: {}),
						EnergySupply: defaultElectricityEnergySupplyName,
						is_heat_network: false,
					} as const satisfies SchemaHeatSourceWetDetails,
				} satisfies FhsInputSchema["HeatSourceWet"],
			};
		case "heatBattery":
			return {
				HeatSourceWet: {
					[heatSource.name]: {
						type: "HeatBattery" as const,
						product_reference: heatSource.productReference,
						EnergySupply: defaultElectricityEnergySupplyName,
						battery_type: batteryTypeMap[heatSource.typeOfHeatBattery],
						number_of_units: heatSource.numberOfUnits,
						is_heat_network: false, // TODO implement correct logic when HNs implemented
					} as const satisfies SchemaHeatSourceWetDetails,
				} satisfies FhsInputSchema["HeatSourceWet"],
			};
	}
}

function mapWaterStorageHeatSource(
	waterStorage: WaterStorageData,
	dhwHeatSource: DomesticHotWaterHeatSourceData,
	actualHeatSource: Exclude<
		ReturnType<typeof getActualHeatSourceFromDHWHeatSource>,
		| { typeOfHeatSource: "pointOfUse" }
	>,
	state: ResolvedState,
) {
	type WaterStorageHeatSource<T extends SchemaSmartHotWaterTank["HeatSource"][string]["type"]>
		= Extract<
			SchemaSmartHotWaterTank["HeatSource"][string],
			{ type: T }
		> | Extract<
			SchemaStorageTank["HeatSource"][string],
			{ type: T }
		>;

	const temp_flow_limit_upper = getTempFlowLimitUpper(dhwHeatSource, actualHeatSource);

	let mappedWSHeatSource, mappedHeatSourceWet;

	const commonWSHeatSourceProps = {
		heater_position: waterStorage.heaterPosition,
		...(waterStorage.typeOfWaterStorage === "hotWaterCylinder"
			? { thermostat_position: waterStorage.thermostatPosition }
			: {}),
	};

	switch (actualHeatSource.typeOfHeatSource) {
		case "heatPump":
			if (actualHeatSource.typeOfHeatPump === "hotWaterOnly") {
				// HeatPump_HWOnly
				mappedWSHeatSource = {
					[actualHeatSource.name]: {
						type: "HeatPump_HWOnly",
						product_reference: actualHeatSource.productReference,
						...commonWSHeatSourceProps,
					} as const satisfies WaterStorageHeatSource<"HeatPump_HWOnly">,
				};
				break;
			}
		// falls through to "HeatSourceWet" if not a HWOnly heat pump
		case "boiler":
		// always falls through to "HeatSourceWet"
		case "heatInterfaceUnit":
		case "heatBattery":
			// HeatSourceWet
			mappedWSHeatSource = {
				[actualHeatSource.name]: {
					type: "HeatSourceWet",
					name: actualHeatSource.name,
					temp_flow_limit_upper,
					...commonWSHeatSourceProps,
				} as const satisfies WaterStorageHeatSource<"HeatSourceWet">,
			};
			mappedHeatSourceWet = mapHeatSourceWet(actualHeatSource, state);
			break;
		case "solarThermalSystem":
			// SolarThermalSystem
			mappedWSHeatSource = {
				[actualHeatSource.name]: {
					type: "SolarThermalSystem",
					sol_loc: "HS",
					area_module: actualHeatSource.collectorModuleArea,
					modules: actualHeatSource.numberOfCollectorModules,
					peak_collector_efficiency: actualHeatSource.peakCollectorEfficiency,
					incidence_angle_modifier: actualHeatSource.incidenceAngleModifier,
					first_order_hlc: actualHeatSource.firstOrderHeatLossCoefficient,
					second_order_hlc: actualHeatSource.secondOrderHeatLossCoefficient,
					collector_mass_flow_rate: actualHeatSource.collectorMassFlowRate,
					power_pump: actualHeatSource.powerOfCollectorPump.amount,
					power_pump_control: actualHeatSource.powerOfCollectorPumpController.amount,
					EnergySupply: defaultElectricityEnergySupplyName,
					tilt: actualHeatSource.pitch,
					orientation360: actualHeatSource.orientation,
					solar_loop_piping_hlc: actualHeatSource.heatLossCoefficientOfSolarLoopPipe,
					...commonWSHeatSourceProps,
				} as const satisfies WaterStorageHeatSource<"SolarThermalSystem">,
			};
			break;
		case "immersionHeater":
			// ImmersionHeater
			mappedWSHeatSource = {
				[actualHeatSource.name]: {
					type: "ImmersionHeater",
					power: actualHeatSource.power,
					EnergySupply: defaultElectricityEnergySupplyName,
					...commonWSHeatSourceProps,
				} as const satisfies WaterStorageHeatSource<"ImmersionHeater">,
			};
			break;
		default:
			throw new Error("Unexpected type of Water Storage heat source");
	}

	return { mappedWSHeatSource, mappedHeatSourceWet };
}

function mapHotWaterSourcesWithWaterStorage(state: ResolvedState, waterStorage: WaterStorageData) {
	const dhwHeatSource = getDomesticHotWaterHeatSource(state);
	const actualHeatSource = getActualHeatSourceFromDHWHeatSource(state);

	if (actualHeatSource.typeOfHeatSource === "pointOfUse") {
		throw new Error("Cannot have a point of use heat source heating a hot water cylinder or smart hot water tank");
	}

	const needsHeatExSurfaceArea = actualHeatSource.typeOfHeatSource === "heatPump"
		&& actualHeatSource.typeOfHeatPump === "hotWaterOnly"
		&& waterStorage.typeOfWaterStorage === "hotWaterCylinder";


	if (needsHeatExSurfaceArea && !("areaOfHeatExchanger" in waterStorage)) {
		throw new Error("Area of heat exchanger must be provided when using a hot water only heat pump");
	}

	const heatExchangerParam = needsHeatExSurfaceArea
		? { heat_exchanger_surface_area: waterStorage.areaOfHeatExchanger }
		: {};

	const mappedWaterStorage = waterStorage.typeOfWaterStorage === "hotWaterCylinder"
		? {
			type: "StorageTank",
			ColdWaterSource: coldWaterSourceMap[dhwHeatSource.coldWaterSource],
			volume: waterStorage.storageCylinderVolume.amount,
			daily_losses: waterStorage.dailyEnergyLoss,
			...heatExchangerParam,
		} as const satisfies Partial<SchemaStorageTank> : {
			type: "SmartHotWaterTank",
			product_reference: waterStorage.productReference,
			EnergySupply_pump: defaultElectricityEnergySupplyName,
			ColdWaterSource: "mains water",
		} as const satisfies Partial<SchemaSmartHotWaterTank>;

	const { mappedWSHeatSource, mappedHeatSourceWet }
		= mapWaterStorageHeatSource(waterStorage, dhwHeatSource, actualHeatSource, state);

	return {
		HotWaterSource: {
			"hw cylinder": {
				...mappedWaterStorage,
				HeatSource: mappedWSHeatSource,
				...mapPipework(state),
			},
		},
		...mappedHeatSourceWet,
		ColdWaterSource: {
			...mappedWaterStorage.ColdWaterSource === "header tank" ? {
				["header tank"]: defaultColdWaterSourceData,
			} : {
				["mains water"]: defaultColdWaterSourceData,
			},
		},
	} as const satisfies Partial<FhsInputSchema>;
}

function getTempFlowLimitUpper(
	dhwHeatSource: DomesticHotWaterHeatSourceData,
	actualHeatSource: ReturnType<typeof getActualHeatSourceFromDHWHeatSource>,
) {
	if (!dhwHeatSource.isExistingHeatSource) {
		return actualHeatSource && "maxFlowTemp" in actualHeatSource ? actualHeatSource.maxFlowTemp?.amount : undefined;
	} else {
		return dhwHeatSource.maxFlowTemp?.amount;
	}
}

function mapHeatSourceNoWS(
	dhwHeatSource: DomesticHotWaterHeatSourceData,
	actualHeatSource: Exclude<
		ReturnType<typeof getActualHeatSourceFromDHWHeatSource>,
		| { typeOfHeatSource: "heatPump" }
		| { typeOfHeatSource: "solarThermalSystem" }
		| { typeOfHeatSource: "immersionHeater" }
		| { typeOfHeatSource: "boiler", typeOfBoiler: "regularBoiler" }
	>,
	state: ResolvedState,
) {
	let mappedHWCylinderBit, mappedHeatSourceWet;

	const commonHWCylinderProps = {
		ColdWaterSource: coldWaterSourceMap[dhwHeatSource.coldWaterSource],
	};

	switch (actualHeatSource.typeOfHeatSource) {
		case "heatInterfaceUnit":
			mappedHWCylinderBit = {
				type: "HIU",
				HeatSourceWet: actualHeatSource.name,
				...commonHWCylinderProps,
			} as const satisfies FhsInputSchema["HotWaterSource"]["hw cylinder"];
			mappedHeatSourceWet = mapHeatSourceWet(actualHeatSource, state);
			break;
		case "boiler":
			mappedHWCylinderBit = {
				type: "CombiBoiler",
				HeatSourceWet: actualHeatSource.name,
				...commonHWCylinderProps,
			} as const satisfies FhsInputSchema["HotWaterSource"]["hw cylinder"];
			mappedHeatSourceWet = mapHeatSourceWet(actualHeatSource, state);
			break;
		case "heatBattery":
			mappedHWCylinderBit = {
				type: "HeatBattery",
				HeatSourceWet: actualHeatSource.name,
				...commonHWCylinderProps,
			} as const satisfies FhsInputSchema["HotWaterSource"]["hw cylinder"];
			mappedHeatSourceWet = mapHeatSourceWet(actualHeatSource, state);
			break;
		case "pointOfUse":
			mappedHWCylinderBit = {
				type: "PointOfUse",
				efficiency: actualHeatSource.heaterEfficiency,
				EnergySupply: defaultElectricityEnergySupplyName,
				...commonHWCylinderProps,
			} as const satisfies FhsInputSchema["HotWaterSource"]["hw cylinder"];
			break;
		default:
			throw new Error("Unexpected type of heat source");
	}

	return { mappedHWCylinderBit, mappedHeatSourceWet };
}

function mapHotWaterSourcesWithoutWaterStorage(state: ResolvedState) {
	const dhwHeatSource = state.domesticHotWater.heatSources[0];

	if (!dhwHeatSource) {
		throw new Error("Domestic hot water heat source not found");
	}

	const actualHeatSource = getActualHeatSourceFromDHWHeatSource(state);

	if (actualHeatSource.typeOfHeatSource === "solarThermalSystem"
		|| actualHeatSource.typeOfHeatSource === "immersionHeater"
		|| actualHeatSource.typeOfHeatSource === "heatPump"
		|| (actualHeatSource.typeOfHeatSource === "boiler"
			&& actualHeatSource.typeOfBoiler === "regularBoiler")
	) {
		throw new Error("Selected hot water heat source requires water storage - no water storage present");
	}

	const { mappedHWCylinderBit, mappedHeatSourceWet } = mapHeatSourceNoWS(dhwHeatSource, actualHeatSource, state);

	return {
		HotWaterSource: {
			"hw cylinder": {
				...mappedHWCylinderBit,
				...mapPipework(state),
			},
		},
		...mappedHeatSourceWet,
	} as const satisfies Partial<FhsInputSchema>;
}

export function mapHotWaterSourcesData(state: ResolvedState) {
	const waterStorage = state.domesticHotWater.waterStorage[0];

	if (!waterStorage) {
		return mapHotWaterSourcesWithoutWaterStorage(state);
	} else {
		return mapHotWaterSourcesWithWaterStorage(state, waterStorage);
	}
};

function mapPipework(state: ResolvedState) {
	const pipeworkEntries = state.domesticHotWater.pipework.map((x): SchemaWaterPipework => {
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

	return pipeworkEntries.length !== 0
		? { primary_pipework: pipeworkEntries }
		: {};
}