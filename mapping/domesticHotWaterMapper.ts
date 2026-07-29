import type { SchemaBathDetails, SchemaColdWaterSourceType, SchemaOtherWaterUseDetails, SchemaWaterPipework, SchemaStorageTank, SchemaHeatSourceWetDetails, SchemaWWHRS } from "~/schema/aliases";
import type { SchemaHeaderTankOrMainsWater, SchemaInstantElecShower, SchemaMixerShower, SchemaSmartHotWaterTank } from "~/schema/api-schema.types";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import { defaultElectricityEnergySupplyName } from "./common";
import { objectFromEntries } from "ts-extras";
import { useColdWaterSource } from "~/composables/coldWaterSource";
import type { ColdWaterSourceType, WaterStorageData } from "~/stores/ecaasStore.schema";

export const defaultColdWaterSourceData: SchemaHeaderTankOrMainsWater = {
	start_day: 0,
	temperatures: [3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7],
	time_series_step: 1,
};

export function mapDomesticHotWaterData(state: ResolvedState): Partial<FhsInputSchema> {
	const { showers, WWHRS } = mapShowersData(state);
	const baths = mapBathsData(state);
	const others = mapOthersData(state);
	const hotWaterSources = mapHotWaterSourcesData(state);
	const preheatedWaterSources = mapPreheatedWaterSourceData(state);

	const data: Partial<FhsInputSchema> = { 
		HotWaterDemand: {
			Shower: showers,
			Bath: baths,
			Other: others,
		} ,
		...hotWaterSources,
		...preheatedWaterSources,
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
	ColdWaterSourceType,
	SchemaColdWaterSourceType
>;

function getColdWaterSourceData(source: DomesticHotWaterHeatSourceData | PreheatedWaterStorageData | WaterStorageData): SchemaColdWaterSourceType {
	const { getColdWaterSource } = useColdWaterSource();
	const coldWaterSource = getColdWaterSource(source);

	if (!coldWaterSource) {
		throw new Error("No cold water source for heat source");
	}

	return coldWaterSourceMap[coldWaterSource];
}

function mapShowersData(state: ResolvedState) {
	const { wwhrs, hotWaterOutlets } = state.domesticHotWater;
	let WWHRS: SchemaWWHRS | undefined = undefined;

	const mixedShowerEntries = hotWaterOutlets.filter(x => x.typeOfHotWaterOutlet === "mixedShower").map((x): [string, SchemaMixerShower] => {
		const key = x.name;
		let associatedWwhrs: WwhrsData | undefined;

		if (x.wwhrs && x.associatedWwhrs) {
			associatedWwhrs = wwhrs.find(s => s.id === x.associatedWwhrs);

			if (associatedWwhrs) {
				WWHRS ??= {};
				WWHRS[associatedWwhrs.name] = {
					product_reference: associatedWwhrs.productReference,
					ColdWaterSource: coldWaterSourceMap[associatedWwhrs.coldWaterSource],
				};
			}
		}

		const mixedShower: SchemaMixerShower = {
			type: "MixerShower",
			ColdWaterSource: coldWaterSourceMap[x.coldWaterSource],
			HotWaterSource: "hw cylinder",
			...(x.wwhrs && associatedWwhrs ? {
				WWHRS: associatedWwhrs.name,
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
			ColdWaterSource: coldWaterSourceMap[x.coldWaterSource],
			rated_power: x.ratedPower,
			EnergySupply: defaultElectricityEnergySupplyName,
		};

		return [key, val];
	});
	
	return { showers: objectFromEntries([...mixedShowerEntries, ...electricShowerEntries]), WWHRS };
}

function mapBathsData(state: ResolvedState) {
	const bathEntries = state.domesticHotWater.hotWaterOutlets.filter(x => x.typeOfHotWaterOutlet === "bath").map((x): [string, SchemaBathDetails] => {
		const key = x.name;
		const val: SchemaBathDetails = {
			ColdWaterSource: coldWaterSourceMap[x.coldWaterSource],
			size: x.size,
			HotWaterSource: "hw cylinder",
		};

		return [key, val];
	});

	return objectFromEntries(bathEntries);
}

function mapOthersData(state: ResolvedState) {
	const otherEntries = state.domesticHotWater.hotWaterOutlets.filter(x => x.typeOfHotWaterOutlet === "otherHotWaterOutlet").map((x): [string, SchemaOtherWaterUseDetails] => {
		const key = x.name;
		const val: SchemaOtherWaterUseDetails = {
			ColdWaterSource: coldWaterSourceMap[x.coldWaterSource],
			flowrate: x.flowRate,
			HotWaterSource: "hw cylinder",
		};

		return [key, val];
	});

	return objectFromEntries(otherEntries);
}

/**
 * Gets the DHW heat source reference used for DHW-specific metadata.
 * Defaults to the only heat source which is not connected to a pre-heated water cylinder.
 * Excludes packaged heat sources.
 */
function getDomesticHotWaterHeatSource(state: ResolvedState) {
	const dhwHeatSources = state.domesticHotWater.heatSources;
	const heatSourcesExcludingPackaged = dhwHeatSources.filter(x => !hasPackagedProduct(x));
	const packagedHeatSources = dhwHeatSources.filter(x => hasPackagedProduct(x));
	let expectedHeatSourceCount = 1 + packagedHeatSources.length;

	if (heatSourcesExcludingPackaged.length === 1) {
		return heatSourcesExcludingPackaged[0]!;
	}

	if (heatSourcesExcludingPackaged.length > 1) {
		const preheatedHeatSourceId = state.domesticHotWater.preheatedWaterStorage?.[0]?.heatSourceId;
		const preheatedHeatSource = heatSourcesExcludingPackaged.find(x => x.id === preheatedHeatSourceId);

		if (preheatedHeatSource) {
			if (heatSourcesExcludingPackaged.length === 2) {
				return heatSourcesExcludingPackaged.find(x => x.id !== preheatedHeatSource.heatSourceId)!;
			}

			expectedHeatSourceCount += 1;
		}
	}

	throw new Error(
		`Expected exactly ${expectedHeatSourceCount} domestic hot water heat ${pluralize("source")(expectedHeatSourceCount !== 1)}, found ${dhwHeatSources.length}`,
	);
}

/**
 * Resolves the actual heat source details from either space heating or DHW,
 * depending on where the source was originally created.
 */
function getActualHeatSourceFromDHWHeatSource(dhwHeatSource: DomesticHotWaterHeatSourceData, state: ResolvedState) {
	const { spaceHeating } = state;

	if (dhwHeatSource.isExistingHeatSource) {
		const heatSource = spaceHeating.heatSource?.find(x => x.id === dhwHeatSource.heatSourceId);

		if (!heatSource) {
			throw new Error("Expected associated space heating heat source");
		}

		return heatSource;
	}

	return dhwHeatSource;
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

	switch (heatSource.typeOfHeatSource) {
		case "heatInterfaceUnit":
			return {
				HeatSourceWet: {
					[heatSource.name]: {
						type: "HIU" as const,
						product_reference: heatSource.productReference,
						EnergySupply: defaultElectricityEnergySupplyName,
						// TODO: Remove once Alpha 8 backend is implemented and no longer requires building_level_distribution_losses for house HIUs
						building_level_distribution_losses:
					state.dwellingDetails.generalSpecifications.typeOfDwelling === "house"
						? 0
						: typeof heatSource.buildingLevelLosses === "object"
							&& heatSource.buildingLevelLosses !== null
							&& "amount" in heatSource.buildingLevelLosses
							? heatSource.buildingLevelLosses.amount
							: heatSource.buildingLevelLosses ?? 0,
						...getHeatNetworkFields(
							state,
							heatSource.associatedHeatNetworkId,
						),
					} as const satisfies SchemaHeatSourceWetDetails,
				} satisfies FhsInputSchema["HeatSourceWet"],
			};
		case "heatPump":
			return {
				HeatSourceWet: {
					[heatSource.name]: {
						type: "HeatPump" as const,
						product_reference: heatSource.productReference,
						EnergySupply: defaultElectricityEnergySupplyName,
						...(heatSource.typeOfHeatPump === "booster"
							? getHeatNetworkFields(
								state,
								heatSource.associatedHeatNetworkId,
							)
							: {
								is_heat_network: false as const,
							}),
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
	waterStorage: WaterStorageData | PreheatedWaterStorageData,
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
		...(waterStorage.typeOfWaterStorage === "hotWaterCylinder" && "thermostatPosition" in waterStorage
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

	if (!dhwHeatSource) {
		return;
	}

	const actualHeatSource = getActualHeatSourceFromDHWHeatSource(dhwHeatSource, state);
	const coldWaterSource = getColdWaterSourceData(waterStorage);

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
			ColdWaterSource: coldWaterSource,
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
	const coldWaterSource = getColdWaterSourceData(dhwHeatSource);
	let mappedHWCylinderBit, mappedHeatSourceWet;

	const commonHWCylinderProps = {
		ColdWaterSource: coldWaterSource,
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
				efficiency: 1, // TODO: Needs to be removed once Alpha 8 is introduced
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
	const preheatedWaterStorage = state.domesticHotWater.preheatedWaterStorage?.[0];
	const dhwHeatSource = state.domesticHotWater.heatSources
		.filter(x => preheatedWaterStorage ? x.id !== preheatedWaterStorage.heatSourceId : true)[0];

	if (!preheatedWaterStorage && !dhwHeatSource) {
		throw new Error("Domestic hot water heat source not found");
	}

	if (!dhwHeatSource) {
		return;
	}

	const actualHeatSource = getActualHeatSourceFromDHWHeatSource(dhwHeatSource, state);

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

export function mapPreheatedWaterSourceData(state: ResolvedState): Partial<FhsInputSchema> | undefined {
	const preheatedWaterStorage = state.domesticHotWater.preheatedWaterStorage?.[0];

	if (!preheatedWaterStorage) {
		return;
	}

	const dhwHeatSource = state.domesticHotWater.heatSources
		?.find(x => x.id === preheatedWaterStorage.heatSourceId);

	if (!dhwHeatSource) {
		throw new Error("No heat source connected to pre-heated water cylinder");
	}

	const actualHeatSource = getActualHeatSourceFromDHWHeatSource(dhwHeatSource, state);
	const coldWaterSource = getColdWaterSourceData(dhwHeatSource);

	if (actualHeatSource.typeOfHeatSource === "pointOfUse") {
		throw new Error("Cannot have a point of use heat source heating a pre-heated water cylinder or smart water cylinder");
	}

	const { mappedWSHeatSource, mappedHeatSourceWet }
		= mapWaterStorageHeatSource(preheatedWaterStorage, dhwHeatSource, actualHeatSource, state);

	if (preheatedWaterStorage.typeOfWaterStorage === "hotWaterCylinder") {
		return {
			PreHeatedWaterSource: {
				"preheated tank": {
					ColdWaterSource: coldWaterSource,
					volume: preheatedWaterStorage.storageCylinderVolume.amount,
					daily_losses: preheatedWaterStorage.dailyEnergyLoss,
					HeatSource: mappedWSHeatSource,
				},
			},
			...mappedHeatSourceWet,
			ColdWaterSource: {
				...coldWaterSource === "header tank" ? {
					["header tank"]: defaultColdWaterSourceData,
				} : {
					["mains water"]: defaultColdWaterSourceData,
				},
			},
		};
	}

	// TODO: Map smart pre-heated water cylinders
	return undefined;
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