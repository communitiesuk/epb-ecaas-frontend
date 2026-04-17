import type { SchemaBathDetails, SchemaColdWaterSourceType, SchemaOtherWaterUseDetails, SchemaWaterPipework, SchemaStorageTank, SchemaBoilerWithProductReference } from "~/schema/aliases";
import type { SchemaHeatSourceWetHeatBattery, SchemaHeatSourceWetHeatPump, SchemaInstantElecShower, SchemaMixerShower, SchemaSmartHotWaterTank } from "~/schema/api-schema.types";
import type { FhsInputSchema, ResolvedState } from "./fhsInputMapper";
import { defaultElectricityEnergySupplyName } from "./common";
import { objectFromEntries } from "ts-extras";

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
		...hotWaterSources,
	};
}

const coldWaterSourceMap = {
	mainsWater: "mains water",
	headerTank: "header tank",
} as const satisfies Record<
	DomesticHotWaterHeatSourceData["coldWaterSource"],
	SchemaColdWaterSourceType
>;

function mapShowersData(state: ResolvedState) {
	const mixedShowerEntries = state.domesticHotWater.hotWaterOutlets.filter(x => x.typeOfHotWaterOutlet === "mixedShower").map((x): [string, SchemaMixerShower] => {
		const key = x.name;
		const WWHRS_configuration = {
			instantaneousSystemA: "A",
			instantaneousSystemB: "B",
			instantaneousSystemC: "C",
		} as const;
		const dhwHotWaterSource = state.domesticHotWater.heatSources.find(hs => hs.id === x.dhwHeatSourceId);

		const mixedShower: SchemaMixerShower = {
			type: "MixerShower",
			ColdWaterSource: "mains water",
			HotWaterSource: dhwHotWaterSource?.isExistingHeatSource
				? state.spaceHeating.heatSource.find(hs => hs.id === dhwHotWaterSource.heatSourceId)?.name
				: dhwHotWaterSource?.name,
			...(x.wwhrs ? {
				WWHRS: x.wwhrsProductReference,
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
			ColdWaterSource: "mains water",
			rated_power: x.ratedPower,
			EnergySupply: defaultElectricityEnergySupplyName,
		};


		return [key, val];
	});

	return objectFromEntries([...mixedShowerEntries, ...electricShowerEntries]);
}

function mapBathsData(state: ResolvedState) {
	const bathEntries = state.domesticHotWater.hotWaterOutlets.filter(x => x.typeOfHotWaterOutlet === "bath").map((x): [string, SchemaBathDetails] => {
		const key = x.name;
		const val: SchemaBathDetails = {
			ColdWaterSource: "mains water",
			size: x.size,
		};

		return [key, val];
	});

	return objectFromEntries(bathEntries);
}

function mapOthersData(state: ResolvedState) {
	const otherEntries = state.domesticHotWater.hotWaterOutlets.filter(x => x.typeOfHotWaterOutlet === "otherHotWaterOutlet").map((x): [string, SchemaOtherWaterUseDetails] => {
		const key = x.name;
		const val: SchemaOtherWaterUseDetails = {
			ColdWaterSource: "mains water",
			flowrate: x.flowRate,
		};

		return [key, val];
	});

	return objectFromEntries(otherEntries);
}

function getWaterStorageDHWHeatSource(state: ResolvedState) {
	const ws = state.domesticHotWater.waterStorage[0];

	if (!ws) throw new Error("Expected a Water Storage entry");

	const waterStorageDHWHeatSource = state.domesticHotWater.heatSources
		.find(heatSource => heatSource.id === ws.dhwHeatSourceId);

	if (!waterStorageDHWHeatSource) {
		throw new Error("referenced heat source for water storage not found");
	}

	return waterStorageDHWHeatSource;
}

function getActualHeatSourceFromDHWHeatSource(state: ResolvedState, waterStorageDHWHeatSource: ResolvedState["domesticHotWater"]["heatSources"][number]) {
	const actualHeatSource = waterStorageDHWHeatSource.isExistingHeatSource
		? state.spaceHeating.heatSource
			.find(hs => hs.id === waterStorageDHWHeatSource.heatSourceId)
		: waterStorageDHWHeatSource;

	if (!actualHeatSource) {
		throw new Error("Hot water heat source references a space heating heat source which does not exist.");
	}
	return actualHeatSource;
}

function mapHeatSourceWet(
	heatSource: Exclude<
		ReturnType<typeof getActualHeatSourceFromDHWHeatSource>,
			| { typeOfHeatSource: "solarThermalSystem" }
			| { typeOfHeatSource: "immersionHeater" }
	>) {

	const batteryTypeMap = {
		"heatBatteryPcm": "pcm",
		"heatBatteryDryCore": "dry_core",
	} as const;

	switch (heatSource.typeOfHeatSource) {
		// TODO case "HIU":
		case "heatPump":
			return { 
				HeatSourceWet: {
					[heatSource.name]: {
						type: "HeatPump",
						product_reference: heatSource.productReference,
						EnergySupply: defaultElectricityEnergySupplyName,
						is_heat_network: false, // todo change when HNs implemented
					} as const satisfies SchemaHeatSourceWetHeatPump,
				} satisfies FhsInputSchema["HeatSourceWet"], 
			};
		case "boiler":
			return { 
				HeatSourceWet: {
					[heatSource.name]: {
						type: "Boiler",
						product_reference: heatSource.productReference,
						...("specifiedLocation" in heatSource
							? { specified_location: heatSource.specifiedLocation }
							: {}),
						EnergySupply: defaultElectricityEnergySupplyName,
						is_heat_network: false, // todo change when HNs implemented
					} as const satisfies SchemaBoilerWithProductReference, 
				} satisfies FhsInputSchema["HeatSourceWet"],
			};
		case "heatBattery":
			return { 
				HeatSourceWet: {
					[heatSource.name]: {
						type: "HeatBattery",
						product_reference: heatSource.productReference,
						EnergySupply: defaultElectricityEnergySupplyName,
						battery_type: batteryTypeMap[heatSource.typeOfHeatBattery],
						number_of_units: heatSource.numberOfUnits,
						is_heat_network: false, // todo change when HNs implemented
					} as const satisfies SchemaHeatSourceWetHeatBattery,
				} satisfies FhsInputSchema["HeatSourceWet"], 
			};
	}
};

function mapWaterStorageHeatSource(
	waterStorage: WaterStorageData,
	dhwHeatSource: DomesticHotWaterHeatSourceData,
	actualHeatSource: Exclude<
		ReturnType<typeof getActualHeatSourceFromDHWHeatSource>,
		| { typeOfHeatSource: "pointOfUse" }
	>,
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
		...(temp_flow_limit_upper ? { temp_flow_limit_upper } : {}), //might want to factor this back in actually, as should never apply to SolarThermal or immersion
	};

	switch (actualHeatSource.typeOfHeatSource) {
		case "heatPump":
			// if (actualHeatSource.typeOfHeatPump === "hotWaterOnly") {
			// 	// HeatPump_HWOnly
			// 	mappedWSHeatSource = {
			// 		// [actualHeatSource.name]: {
			// 		// 	type: "HeatPump_HWOnly",
			// 		// 	heater_position: waterStorage.heaterPosition,
			// 		// },
			// 	} ;
			// 	break;
			// }
			// falls through to "HeatSourceWet" if not a HWOnly heat pump
		case "boiler":
			// always falls through to "HeatSourceWet"
		case "heatBattery":
			// HeatSourceWet
			mappedWSHeatSource = {
				[actualHeatSource.name]: {
					type: "HeatSourceWet",
					name: actualHeatSource.name,
					...commonWSHeatSourceProps,
				} as const satisfies WaterStorageHeatSource<"HeatSourceWet">,
			};
			mappedHeatSourceWet = mapHeatSourceWet(actualHeatSource);
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
	const dhwHeatSource = getWaterStorageDHWHeatSource(state);
	const actualHeatSource = getActualHeatSourceFromDHWHeatSource(state, dhwHeatSource);

	if (actualHeatSource.typeOfHeatSource === "pointOfUse") {
		throw new Error("Cannot have a point of use heat source heating a hot water cylinder or smart hot water tank");
	}

	const mappedWaterStorage = waterStorage.typeOfWaterStorage === "hotWaterCylinder"
		? {
			type: "StorageTank",
			ColdWaterSource: coldWaterSourceMap[dhwHeatSource.coldWaterSource],
			volume: waterStorage.storageCylinderVolume.amount,
			daily_losses: waterStorage.dailyEnergyLoss,
		} as const satisfies Partial<SchemaStorageTank> : {
			type: "SmartHotWaterTank",
			product_reference: waterStorage.productReference,
			EnergySupply_pump: defaultElectricityEnergySupplyName,
		} as const satisfies Partial<SchemaSmartHotWaterTank>;

	const { mappedWSHeatSource, mappedHeatSourceWet }
		= mapWaterStorageHeatSource(waterStorage, dhwHeatSource, actualHeatSource);
		
	return {
		HotWaterSource: {
			"hw cylinder": {
				...mappedWaterStorage,
				HeatSource: mappedWSHeatSource,
				...mapPipework(state),
			},
		},
		...mappedHeatSourceWet,
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
};

function mapHeatSourceNoWS(
	dhwHeatSource: DomesticHotWaterHeatSourceData,
	actualHeatSource: Exclude<
		ReturnType<typeof getActualHeatSourceFromDHWHeatSource>,
		| { typeOfHeatSource: "heatPump" }
		| { typeOfHeatSource: "solarThermalSystem" }
		| { typeOfHeatSource: "immersionHeater" }
		| { typeOfHeatSource: "boiler", typeOfBoiler: "regularBoiler" }
	>,
) {
	let mappedHWCylinderBit, mappedHeatSourceWet;

	const commonHWCylinderProps = {
		ColdWaterSource: coldWaterSourceMap[dhwHeatSource.coldWaterSource],
	};

	switch (actualHeatSource.typeOfHeatSource) {
		// TODO case "HIU":
		case "boiler":
			mappedHWCylinderBit = {
				type: "CombiBoiler",
				HeatSourceWet: actualHeatSource.name,
				...commonHWCylinderProps,
			} as const satisfies FhsInputSchema["HotWaterSource"]["hw cylinder"];
			mappedHeatSourceWet = mapHeatSourceWet(actualHeatSource);
			break;
		case "heatBattery":
			mappedHWCylinderBit = {
				type: "HeatBattery",
				HeatSourceWet: actualHeatSource.name,
				...commonHWCylinderProps,
			} as const satisfies FhsInputSchema["HotWaterSource"]["hw cylinder"];
			mappedHeatSourceWet = mapHeatSourceWet(actualHeatSource);
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

	const actualHeatSource = getActualHeatSourceFromDHWHeatSource(state, dhwHeatSource);

	if (actualHeatSource.typeOfHeatSource === "solarThermalSystem"
		|| actualHeatSource.typeOfHeatSource === "immersionHeater"
		|| actualHeatSource.typeOfHeatSource === "heatPump"
		|| (actualHeatSource.typeOfHeatSource === "boiler"
			&& actualHeatSource.typeOfBoiler === "regularBoiler")
	) {
		throw new Error("Selected hot water heat source requires water storage - no water storage present");
	}

	const { mappedHWCylinderBit, mappedHeatSourceWet } = mapHeatSourceNoWS(dhwHeatSource, actualHeatSource);
		
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