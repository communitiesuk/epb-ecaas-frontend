import { objectFromEntries } from "ts-extras";
import type { DisplayProduct } from "~/pcdb/pcdb.types";
import type { SchemaApplianceType, SchemaColour, SchemaFuelTypeExtended, SchemaLeaksTestPressure, SchemaRadiatorType } from "~/schema/aliases";
import type { UnitForName, UnitName, UnitValue } from "./units/types";
import { asUnit } from "./units/units";
import { immersionHeaterPositionValues } from "~/mapping/common";
import type { AdjacentSpaceType, ConciseMassDistributionClass, HeatEmitterType, HeatPumpType, HeatSourceProductType, TypeOfBoiler } from "~/stores/ecaasStore.schema";

export const emptyValueRendering = "-";

/** Turns a value into something that can be shown on e.g. a summary page */
export function show(value: string | number | undefined | null): string {
	return value != null ? value.toString() : emptyValueRendering;
}

/** Renders a unit with correct visual suffix, falling back to "-" for undefined */
export function dim(amount: UnitValue | number | undefined, unit?: UnitName): string {
	if (amount as unknown === "") {
		return emptyValueRendering;
	}
	if (typeof amount === "object") {
		const { amount: num, unit: unitName } = amount;

		return renderDimensionedValue(num, unitName);
	}
	if (typeof amount === "undefined") {
		return emptyValueRendering;
	}
	if (typeof unit === "undefined") {
		return amount.toString();
	}

	return renderDimensionedValue(amount, unit);
}

function renderDimensionedValue<T extends number, U extends UnitName>(amount: T, unit: U): `${T} ${UnitForName<U>["suffix"]}` {
	return `${amount} ${asUnit(unit).suffix}` as `${T} ${UnitForName<U>["suffix"]}`;
}

export function displayBoolean(value: boolean | undefined): BooleanDisplay | typeof emptyValueRendering {
	if (typeof value === "undefined") {
		return emptyValueRendering;
	}

	return value ? "Yes" : "No";
}

type BooleanDisplay = "Yes" | "No";

export function displayMassDistributionClass(value: ConciseMassDistributionClass | undefined): MassDistributionClassDisplay | typeof emptyValueRendering {
	switch (value) {
		case "I":
			return "Internal";
		case "E":
			return "External";
		case "IE":
			return "Divided";
		case "D":
			return "Equally";
		case "M":
			return "Inside";
		default:
			return emptyValueRendering;
	}
}

type MassDistributionClassDisplay = "Internal" | "External" | "Divided" | "Equally" | "Inside";

export function sentenceCase(value: string): string {
	const replaced = value.replaceAll(/_/g, " ").trim();
	return replaced.charAt(0).toUpperCase() + replaced.slice(1).toLowerCase();
}

export type FlueGasExhaustSituationDisplay = "Into separate duct" | "Into room" | "Into mechanical vent";

export function displaySnakeToSentenceCase(value: string): string {
	const replaced = value.replaceAll(/_/g, " ");
	return replaced.charAt(0).toUpperCase() + replaced.slice(1).toLowerCase();
}

export function displayCamelToSentenceCase(value: string): string {
	// insert a space before any uppercase letter that is preceeded by a lower case letter
	const inserted = value.replace(/((?<=[a-z])[A-Z])/g, " $1");
	// lower the case of any uppercase letter that is followed by a lower case letter
	const replaced = inserted.replace(/((?<=\s)[A-Z](?=[a-z]))/g, x => x.toLowerCase());
	return replaced.charAt(0).toUpperCase() + replaced.slice(1);
}

export type ApplianceKeyDisplay = "Fridge" | "Freezer" | "Fridge-freezer" | "Dishwasher" | "Oven" | "Washing machine" | "Tumble dryer" | "Hob";

export function displayApplianceKey(value: SchemaApplianceType): ApplianceKeyDisplay {
	switch (value) {
		case "Fridge":
			return "Fridge";
		case "Freezer":
			return "Freezer";
		case "Fridge-Freezer":
			return "Fridge-freezer";
		case "Dishwasher":
			return "Dishwasher";
		case "Oven":
			return "Oven";
		case "Clothes_washing":
			return "Washing machine";
		case "Clothes_drying":
			return "Tumble dryer";
		case "Hobs":
			return "Hob";
		default:
			value satisfies never;
			throw new Error(`Missed a appliance key case: ${value}`);
	}
}
// NB. this list is written out to be available at runtime, and could drift from all upstream values over time
export const applianceKeys: SchemaApplianceType[] = [
	"Clothes_drying",
	"Clothes_washing",
	"Dishwasher",
	"Freezer",
	"Fridge",
	"Fridge-Freezer",
	"Hobs",
	"Oven",
];

function isApplianceKey(value: string): value is SchemaApplianceType {
	return applianceKeys.includes(value as SchemaApplianceType);
}

export function displayDeliveryEnergyUseKey(key: string | SchemaApplianceType): string | ApplianceKeyDisplay {
	return (isApplianceKey(key)) ? displayApplianceKey(key) : key;
}

export function displayApplianceType(appliances: SchemaApplianceType[] | undefined) {
	if (appliances === undefined) return emptyValueRendering;
	return appliances.map(appliance => displayApplianceKey(appliance)).join(", ");
}

type AdjacentSpaceTypeDisplay<T extends string> = `${T} to ${PascalToSentenceCase<AdjacentSpaceType>}`;

export function adjacentSpaceTypeOptions<T extends string>(element: T): Record<AdjacentSpaceType, AdjacentSpaceTypeDisplay<T>> {

	return objectFromEntries(adjacentSpaceTypes.map(entry => [
		entry,
		displayAdjacentSpaceType(entry, element)!,
	] as const satisfies [AdjacentSpaceType, AdjacentSpaceTypeDisplay<T>]));
}

export function displayAdjacentSpaceType<T extends string>(value: AdjacentSpaceType | undefined, element: T): AdjacentSpaceTypeDisplay<T> | undefined {
	if (typeof value === "undefined") {
		return undefined;
	}

	return `${element} to ${value === "heatedSpace" ? "heated space" : "unheated space"}`;
}

export function displayHeaterPosition(position: ImmersionHeaterPosition | undefined): string {
	if (typeof position === "undefined") {
		return emptyValueRendering;
	}
	return `${displayCamelToSentenceCase(position)} (${immersionHeaterPositionValues[position]})`;
}

export function displayReflectivity(reflective: boolean | undefined): string {
	if (typeof reflective === "undefined") {
		return emptyValueRendering;
	}
	return reflective ? "Reflective" : "Not reflective";
}

export function displayTypeOfInfiltrationPressureTest(typeOfInfiltrationPressureTest: SchemaLeaksTestPressure) {
	switch (typeOfInfiltrationPressureTest) {
		case "Standard":
			return "Blower door (test pressure is 50Pa)";
		case "Pulse test only":
			return "Pulse test (test pressure is 4Pa)";
		default:
			return emptyValueRendering;
	}
}


export type FuelTypeDisplay = "LPG (Liquid petroleum gas) - bulk" | "LPG (Liquid petroleum gas) - bottled" | "LPG - 11F" | "Electricity is the only energy source" | "Mains gas" | "Electricity";

export const energySupplyOptions = {
	"mains_gas": "Mains gas",
	"LPG_bulk": "LPG (Liquid petroleum gas) - bulk",
	"LPG_bottled": "LPG (Liquid petroleum gas) - bottled",
	"LPG_condition_11F": "LPG - 11F",
	"elecOnly": "Electricity",
	"electricity": "Electricity",
} as const satisfies Record<SchemaFuelTypeExtended | "electricity", FuelTypeDisplay>;

export function displayFuelTypes(fuelTypes: SchemaFuelTypeExtended[] | undefined) {
	if (fuelTypes === undefined) return emptyValueRendering;
	const result = fuelTypes.map(type => energySupplyOptions[type]).join(", ");

	if (!result.includes("Electricity")) {
		return result + ", Electricity";
	}
	return result;
}

export function displayFuelType(fuelType: SchemaFuelTypeExtended): FuelTypeDisplay {
	switch (fuelType) {
		case "LPG_bulk":
			return "LPG (Liquid petroleum gas) - bulk";
		case "LPG_bottled":
			return "LPG (Liquid petroleum gas) - bottled";
		case "LPG_condition_11F":
			return "LPG - 11F";
		case "elecOnly":
			return "Electricity is the only energy source";
		case "electricity":
			return "Electricity";
		case "mains_gas":
			return "Mains gas";
		default:
			fuelType satisfies never;
			throw new Error(`Missed a fuel type case: ${fuelType}`);
	}
}

export const ecoDesignControllerOptions = {
	1: "I: On/Off Room Thermostat",
	2: "II: Weather Compensator (Modulating Heaters)",
	3: "III: Weather Compensator (On/Off Heaters)",
	4: "IV: TPI Room Thermostat (On/Off Heaters)",
	5: "V: Modulating Room Thermostat",
	6: "VI: Weather Compensator + Room Sensor (Modulating)",
	7: "VII: Weather Compensator + Room Sensor (On/Off)",
	8: "VIII: Multi-Sensor Room Control (Modulating)",
};

export type EcoDesignControllerValue = keyof typeof ecoDesignControllerOptions extends infer K
	? K extends string
		? K extends `${infer N extends number}` ? N : never
		: never
	: never;

export function displayEcoDesignController(value: EcoDesignControllerValue | undefined): string {
	if (typeof value === "undefined") {
		return emptyValueRendering;
	}

	return ecoDesignControllerOptions[value] ?? ("" + value);
}

// better type/ function for displaying products once we're dealing with realistic products
// export type ProductDisplayString = `${DisplayProduct['brandName']} - ${DisplayProduct['modelName']}`;

// export function displayProduct(product: DisplayProduct): ProductDisplayString {
// 	return `${product.brandName} - ${product.modelName}`;
// }

// temporary ones just for test fake heat pumps
export type ProductDisplayString = FirstWord<DisplayProduct["modelName"]>;

type FirstWord<S extends string> = S extends `${infer Word} ${string}` ? Word : S;

export function displayProduct(product: DisplayProduct): ProductDisplayString {
	return product.modelName.split(" ")[0]!;
}


export type ColourDisplay = "Light" | "Medium" | "Dark";

export const colourOptionsMap = {
	"Light": "Light",
	"Intermediate": "Medium",
	"Dark": "Dark",
} as const satisfies Record<SchemaColour, ColourDisplay>;

export function displayColour(colour: SchemaColour | undefined): ColourDisplay | typeof emptyValueRendering {
	return colourOptionsMap[colour!] ?? emptyValueRendering;
}

export const heatPumpTypes = {
	"airSource": "Air source",
	"groundSource": "Ground source",
	"waterSource": "Water source",
	"booster": "Booster",
	"hotWaterOnly": "Hot water only",
	"exhaustAirMev": "Exhaust air MEV",
	"exhaustAirMvhr": "Exhaust air MVHR",
	"exhaustAirMixed": "Exhaust air Mixed",
} as const satisfies Record<HeatPumpType, string>;

export const boilerTypes = {
	"combiBoiler": "Combi boiler",
	"regularBoiler": "Regular boiler",
} as const satisfies Record<TypeOfBoiler, BoilerTypeDisplay>;

export const heatBatteryTypes = {
	"heatBatteryPcm": "PCM",
	"heatBatteryDryCore": "Dry core",
} as const satisfies Record<TypeOfHeatBattery, HeatBatteryTypeDisplay>;

export const heatNetworkTypes = {
	"sleevedDistrictHeatNetwork": "Sleeved district heat network",
	"unsleevedDistrictHeatNetwork": "Unsleeved district heat network",
	"communalHeatNetwork": "Communal heat network",
} as const satisfies Record<TypeOfHeatNetwork, HeatNetworkTypeDisplay>;

export const heatSourceProductTypesDisplay = {
	"airSource": pluralize("Air source heat pump"),
	"groundSource": pluralize("Ground source heat pump"),
	"waterSource": pluralize("Water source heat pump"),
	"booster": pluralize("Booster heat pump"),
	"hotWaterOnly": pluralize("Hot water only heat pump"),
	"exhaustAirMev": pluralize("Exhaust air MEV heat pump"),
	"exhaustAirMvhr": pluralize("Exhaust air MVHR heat pump"),
	"exhaustAirMixed": pluralize("Exhaust air mixed heat pump"),
	"combiBoiler": pluralize("Combi boiler"),
	"regularBoiler": pluralize("Regular boiler"),
	"sleevedDistrictHeatNetwork": pluralize("Sleeved district heat network"),
	"unsleevedDistrictHeatNetwork": pluralize("Unsleeved district heat network"),
	"communalHeatNetwork": pluralize("Communal heat network"),
	"heatBatteryPcm": pluralize("PCM heat battery", "ies"),
	"heatBatteryDryCore": pluralize("Dry core heat battery", "ies"),
} as const satisfies Record<HeatSourceProductType, (plural: boolean) => string>;

heatSourceProductTypesDisplay["airSource"](true);

export function displayHeatPumpType(type: HeatPumpType | undefined): string {
	return heatPumpTypes[type!] ?? emptyValueRendering;
}

export type BoilerTypeDisplay = "Combi boiler" | "Regular boiler";
export type BoilerLocationDisplay = "Heated space" | "Unheated space";
export type HeatNetworkTypeDisplay = "Sleeved district heat network" | "Unsleeved district heat network" | "Communal heat network";
export type HeatBatteryTypeDisplay = "PCM" | "Dry core";
export type LocationOfCollectorLoopPipingTypeDisplay = "Outside" | "Heated space" | "Unheated space";

export type HeatSourceTypeDisplay = "Heat pump" | "Boiler" | "Heat network" | "Heat battery" | "Solar thermal system";

export const heatSourceTypesWithDisplay = {
	"heatPump": "Heat pump",
	"boiler": "Boiler",
	"heatNetwork": "Heat network",
	"heatBattery": "Heat battery",
	"solarThermalSystem": "Solar thermal system",
} as const satisfies Record<HeatSourceType, HeatSourceTypeDisplay>;

export function displayHeatSourceType(type: HeatSourceType | undefined): HeatSourceTypeDisplay | typeof emptyValueRendering {
	return heatSourceTypesWithDisplay[type!] ?? emptyValueRendering;
}

export type HeatEmitterDisplay = "Radiator" | "Underfloor heating" | "Fan coil" | "Warm air heater" | "Instant electric heater" | "Electric storage heater";

export const heatEmitterTypes = {
	"radiator": "Radiator",
	"underfloorHeating": "Underfloor heating",
	"fanCoil": "Fan coil",
	"warmAirHeater": "Warm air heater",
	"instantElectricHeater": "Instant electric heater",
	"electricStorageHeater": "Electric storage heater",

} as const satisfies Record<HeatEmitterType, HeatEmitterDisplay>;

export function displayHeatEmitterType(type: HeatEmitterType | undefined): HeatEmitterDisplay | typeof emptyValueRendering {
	if (!type) {
		return emptyValueRendering;
	}
	return heatEmitterTypes[type];
}

export type RadiatorDisplay = "Standard" | "Towel radiator";

export const radiatorTypes = {
	standard: "Standard",
	towel: "Towel radiator",

} as const satisfies Record<SchemaRadiatorType, RadiatorDisplay>;

export function displayRadiatorType(type: SchemaRadiatorType | undefined): RadiatorDisplay | typeof emptyValueRendering {
	if (!type) {
		return emptyValueRendering;
	}
	return radiatorTypes[type];
}