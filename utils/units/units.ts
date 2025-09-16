import type { Dimension, Unit, UnitForName, UnitName } from "./types";

export const units = [
	{
		"name": "metres",
		"suffix": "m",
		"multiplier": 1,
		"dimension": "length",
	},
	{
		"name": "centimetres",
		"suffix": "cm",
		"multiplier": 100,
		"dimension": "length",
	},
	{
		"name": "millimetres",
		"suffix": "mm",
		"multiplier": 1000,
		"dimension": "length",
	},
	{
		"name": "metres square",
		"suffix": "m²",
		"multiplier": 1,
		"dimension": "area",
	},
	{
		"name": "centimetres square",
		"suffix": "cm²",
		"multiplier": 10000,
		"dimension": "area",
	},
	{
		"name": "millimetres square per metre",
		"suffix": "cm²",
		"multiplier": 1000000,
		"dimension": "area per length",
	},
	{
		"name": "litres",
		"suffix": "litres",
		"shortSuffix": "l",
		"multiplier": 1000,
		"dimension": "volume",
	},
	{
		"name": "cubic metres",
		"suffix": "m³",
		"multiplier": 1,
		"dimension": "volume",
	},
	{
		"name": "cubic metres per hour",
		"suffix": "m³/h",
		"multiplier": 1,
		"dimension": "flow rate",
	},
	{
		"name": "litres per second",
		"suffix": "litres per second",
		"shortSuffix": "l/s",
		"multiplier": 3.6,
		"dimension": "flow rate",
	},
	{
		"name": "litres per minute",
		"suffix": "litres per minute",
		"multiplier": 0.06,
		"dimension": "flow rate",
	},
	{
		"name": "litres per hour",
		"suffix": "litres per hour",
		"multiplier": 0.001,
		"dimension": "flow rate",
	},
	{
		"name": "cubic metres per hour per square metre",
		"suffix": "m³/(h·m²)",
		"multiplier": 1,
		"dimension": "flow rate per area",
	},
	{
		"name": "degrees",
		"suffix": "°",
		"multiplier": 1,
		"dimension": "angle",
	},
	{
		"name": "kilowatt-hour",
		"suffix": "kWh",
		"multiplier": 1,
		"dimension": "energy",
	},
	{
		"name": "kilowatt",
		"suffix": "kW",
		"multiplier": "1",
		"dimension": "power",
	},
	{
		"name": "kilowatt peak",
		"suffix": "kWp",
		"multiplier": 1,
		"dimension": "peak power",
	},
	{
		"name": "CO2 per kilowatt-hour",
		"suffix": "kgCO2e/kWh",
		"multiplier": 1,
		"dimension": "emissions per energy",
	},
	{
		"name": "pascal",
		"suffix": "Pa",
		"multiplier": 1,
		"dimension": "pressure",
	},
	{
		"name": "celsius",
		"suffix": "°C",
		"multiplier": 1,
		"dimension": "temperature",
	},
	{
		"name": "watts per kelvin",
		"suffix": "W/K",
		"multiplier": 1,
		"dimension": "power per unit temperature",
	},
	{
		"name": "watts per metre kelvin",
		"suffix": "W/(m·K)",
		"multiplier": 1,
		"dimension": "power per length temperature",
	},
	{
		"name": "watts per square metre kelvin",
		"suffix": "W/(m²·K)",
		"multiplier": 1,
		"dimension": "power per area temperature",
	},
	{
		"name": "square metre kelvin per watt",
		"suffix": "(m²·K)/W",
		"multiplier": 1,
		"dimension": "area temperature per power",
	},
	{
		"name": "kilowatt hour per kelvin",
		"suffix": "kWh/K",
		"multiplier": 1,
		"dimension": "energy per unit temperature",
	},
] as const;

export function asUnit<T extends UnitName>(name: T): UnitForName<T> {
	return units.find((unit): unit is UnitForName<T> => unit.name === name)!;
}

export function unitValue<T extends Unit>(amount: number, unit: T): Dimension<T["name"]>;
export function unitValue<T extends UnitName>(amount: number, unit: T): Dimension<T>;
export function unitValue(amount: number, unit: Unit | UnitName) {
	const unitName = typeof unit !== "string" ? unit.name : unit;
	return {
		amount,
		unit: unitName,
	};
}