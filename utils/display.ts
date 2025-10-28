import { objectFromEntries } from "ts-extras";
import type { DisplayProduct } from "~/pcdb/products";
import type { ApplianceKey, SchemaFlueGasExhaustSituation, SchemaFuelType } from "~/schema/aliases";
import type { UnitForName, UnitName, UnitValue } from "./units/types";
import { asUnit } from "./units/units";
import { immersionHeaterPositionValues } from "~/mapping/common";
import type { ConciseMassDistributionClass } from "~/stores/ecaasStore.schema";

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

export function displayFlueGasExhaustSituation(value: SchemaFlueGasExhaustSituation): FlueGasExhaustSituationDisplay {
	switch (value) {
		case "into_separate_duct":
			return "Into separate duct";
		case "into_room":
			return "Into room";
		case "into_mech_vent":
			return "Into mechanical vent";
		default:
			value satisfies never;
			throw new Error(`Missed a flue gas exhaust situation case: ${value}`);
	}
}

export type ApplianceKeyDisplay = "Fridge" | "Freezer" | "Fridge freezer" | "Dishwasher" | "Oven" | "Washing machine" | "Tumble dryer" | "Hobs" | "Kettle" | "Microwave" | "Lighting" | "Other";

export function displayApplianceKey(value: ApplianceKey): ApplianceKeyDisplay {
	switch (value) {
		case "Fridge":
			return "Fridge";
		case "Freezer":
			return "Freezer";
		case "Fridge-Freezer":
			return "Fridge freezer";
		case "Dishwasher":
			return "Dishwasher";
		case "Oven":
			return "Oven";
		case "Clothes_washing":
			return "Washing machine";
		case "Clothes_drying":
			return "Tumble dryer";
		case "Hobs":
			return "Hobs";
		case "Kettle":
			return "Kettle";
		case "Microwave":
			return "Microwave";
		case "Otherdevices":
			return "Other";
		default:
			value satisfies never;
			throw new Error(`Missed a appliance key case: ${value}`);
	}
}

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

// NB. this list is written out to be available at runtime, and could drift from all upstream values over time
const applianceKeys: ApplianceKey[] = [
	"Clothes_drying",
	"Clothes_washing",
	"Dishwasher",
	"Freezer",
	"Fridge",
	"Fridge-Freezer",
	"Hobs",
	"Kettle",
	"Microwave",
	"Otherdevices",
	"Oven",
];

function isApplianceKey(value: string): value is ApplianceKey {
	return applianceKeys.includes(value as ApplianceKey);
}

export function displayDeliveryEnergyUseKey(key: string | ApplianceKey): string | ApplianceKeyDisplay {
	return (isApplianceKey(key)) ? displayApplianceKey(key) : key;
}

type AdjacentSpaceTypeDisplay<T extends string> = `${T} to ${PascalToSentenceCase<AdjacentSpaceType>}`;

export function adjacentSpaceTypeOptions<T extends string>(element: T): Record<AdjacentSpaceType, AdjacentSpaceTypeDisplay<T>> {
	return objectFromEntries(Object.values(AdjacentSpaceType).map(key => [
		key,
		displayAdjacentSpaceType(key, element)!,
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

export function displayFuelTypes(fuelTypes: SchemaFuelType[] | undefined) {
	if (fuelTypes === undefined) return emptyValueRendering;
	return fuelTypes.map(type => displayFuelType(type)).join(", ");
}

export function displayFuelType(fuelType: SchemaFuelType): FuelTypeDisplay {
	switch (fuelType) {
		case "gas":
			return "Bottled gas";
		case "lpg_bulk":
			return "LPG bulk";
		case "custom":
			return "Custom";
		case "electricity":
			return "Electricity";
		case "mains_gas":
			return "Mains gas";
		case "wood":
			return "Wood";
		case "coal":
			return "Coal";
		case "oil":
			return "Oil";
		default:
			fuelType satisfies never;
			throw new Error(`Missed a fuel type case: ${fuelType}`);
	}
}

export type FuelTypeDisplay = "Bottled gas" | "LPG bulk" | "Custom" | "Electricity" | "Mains gas" | "Wood" | "Coal" | "Oil";

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