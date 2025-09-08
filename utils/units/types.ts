import type { units } from "./units";

export type Dimension<T extends UnitName> = {
	amount: number,
	unit: T
};

export type DimensionName = typeof units[number]["dimension"];
export type UnitName = typeof units[number]["name"];
export type Unit = typeof units[number];

export type UnitForName<T extends UnitName> = Extract<Unit, { name: T }>;
export type UnitForDimension<T extends DimensionName> = Extract<Unit, { dimension: T }>;

export type UnitValue = {
	amount: number,
	unit: UnitName
};

export function unitValue<T extends Unit>(amount: number, unit: T): Dimension<T["name"]> {
	return {
		amount,
		unit: unit.name,
	};
}
