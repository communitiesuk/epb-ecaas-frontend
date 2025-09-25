import { objectFromEntries } from "ts-extras";
import { ApplianceKey, FlueGasExhaustSituation, FuelType, MassDistributionClass, WwhrsType } from "../schema/api-schema.types";
import type { DisplayProduct } from "~/pcdb/products";
import type { UnitForName, UnitName, UnitValue } from "./units/types";
import { asUnit } from "./units/units";
import { immersionHeaterPositionValues } from "~/mapping/common";

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

export function displayMassDistributionClass(value: MassDistributionClass | undefined): MassDistributionClassDisplay | typeof emptyValueRendering {
	switch (value) {
		case MassDistributionClass.I:
			return "Internal";
		case MassDistributionClass.E:
			return "External";
		case MassDistributionClass.IE:
			return "Divided";
		case MassDistributionClass.D:
			return "Equally";
		case MassDistributionClass.M:
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

export function displayFlueGasExhaustSituation(value: FlueGasExhaustSituation): FlueGasExhaustSituationDisplay {
	switch (value) {
		case FlueGasExhaustSituation.into_separate_duct:
			return "Into separate duct";
		case FlueGasExhaustSituation.into_room:
			return "Into room";
		case FlueGasExhaustSituation.into_mech_vent:
			return "Into mechanical vent";
		default:
			value satisfies never;
			throw new Error(`Missed a flue gas exhaust situation case: ${value}`);
	}
}

export type ApplianceKeyDisplay = "Fridge" | "Freezer" | "Fridge freezer" | "Dishwasher" | "Oven" | "Washing machine" | "Tumble dryer" | "Hobs" | "Kettle" | "Microwave" | "Lighting" | "Other";

export function displayApplianceKey(value: ApplianceKey): ApplianceKeyDisplay {
	switch (value) {
		case ApplianceKey.Fridge:
			return "Fridge";
		case ApplianceKey.Freezer:
			return "Freezer";
		case ApplianceKey.Fridge_Freezer:
			return "Fridge freezer";
		case ApplianceKey.Dishwasher:
			return "Dishwasher";
		case ApplianceKey.Oven:
			return "Oven";
		case ApplianceKey.Clothes_washing:
			return "Washing machine";
		case ApplianceKey.Clothes_drying:
			return "Tumble dryer";
		case ApplianceKey.Hobs:
			return "Hobs";
		case ApplianceKey.Kettle:
			return "Kettle";
		case ApplianceKey.Microwave:
			return "Microwave";
		case ApplianceKey.lighting:
			return "Lighting";
		case ApplianceKey.Otherdevices:
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

export function displayWwhrsType(value: WwhrsType): WwhrsTypeDisplay {
	switch (value) {
		case WwhrsType.WWHRS_InstantaneousSystemA:
			return "A";
		case WwhrsType.WWHRS_InstantaneousSystemB:
			return "B";
		case WwhrsType.WWHRS_InstantaneousSystemC:
			return "C";
		default:
			value satisfies never;
			throw new Error(`Missed a Wwhrs type case: ${value}`);
	}
}

export type WwhrsTypeDisplay = "A" | "B" | "C";

export function displayDeliveryEnergyUseKey(key: string | ApplianceKey): string | ApplianceKeyDisplay {
	return (Object.values(ApplianceKey).includes(key as ApplianceKey)) ? displayApplianceKey(key as ApplianceKey) : key;
}

export const arealHeatCapacityOptions = {
	"50000": "Very light",
	"75000": "Light",
	"110000": "Medium",
	"175000": "Heavy",
	"250000": "Very heavy",
};

export type ArealHeatCapacityValue = keyof typeof arealHeatCapacityOptions extends infer K
	? K extends string
		? K extends `${infer N extends number}` ? N : never
		: never
	: never;

export function displayArealHeatCapacity(value: ArealHeatCapacityValue | undefined): string {
	if (typeof value === "undefined") {
		return emptyValueRendering;
	}

	return arealHeatCapacityOptions[value] ?? ("" + value);
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
	return `${ displayCamelToSentenceCase(position) } (${ immersionHeaterPositionValues[position] })`;
}

export function displayReflectivity(reflective: boolean | undefined): string {
	if (typeof reflective === "undefined") {
		return emptyValueRendering;
	}
	return reflective ? "Reflective" : "Not reflective";
}

export function displayFuelTypes(fuelTypes: FuelType[] | undefined) {
	return fuelTypes?.map(type => {
		return displayFuelType(type);
	}).join(", ");
}

export function displayFuelType(fuelType: FuelType): FuelTypeDisplay {
	switch (fuelType) {
		case FuelType.LPG_bottled:
			return "LPG bottled";
		case FuelType.LPG_bulk:
			return "LPG bulk";
		case FuelType.LPG_condition_11F:
			return "LPG condition 11F";
		case FuelType.custom:
			return "Custom";
		case FuelType.electricity:
			return "Electricity";
		case FuelType.energy_from_environment:
			return "Energy from environment";
		case FuelType.mains_gas:
			return "Mains gas";
		case FuelType.unmet_demand:
			return "Unmet demand";
		default:
			fuelType satisfies never;
			throw new Error(`Missed a fuel type case: ${fuelType}`);
	}
}

export type FuelTypeDisplay = "LPG bottled" | "LPG bulk" | "LPG condition 11F" | "Custom" | "Electricity" | "Energy from environment" | "Mains gas" | "Unmet demand";

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