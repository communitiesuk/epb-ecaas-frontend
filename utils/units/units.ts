import type { UnitForName, UnitName } from "./types";

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
] as const;

export function unit<T extends UnitName>(name: T): UnitForName<T> {
	return units.find((unit): unit is UnitForName<T> => unit.name === name)!;
}