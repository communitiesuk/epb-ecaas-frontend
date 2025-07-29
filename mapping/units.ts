export enum LengthUnitName {
	METERS = 'meters',
	CENTIMETERS = 'centimeters',
	MILLIMETERS = 'millimeters',
}

export type LengthUnit = { name: LengthUnitName; suffix: string; };

export const centimeter: LengthUnit = {
	name: LengthUnitName.CENTIMETERS,
	suffix: 'cm'
};

export const millimeter: LengthUnit = {
	name: LengthUnitName.MILLIMETERS,
	suffix: 'mm'
};

export interface Length {
	amount: number;
	unit: LengthUnitName;
}

export function length(amount: number, lengthUnit: LengthUnitName): Length {
	return { amount, unit: lengthUnit };
}

export function lengthCm(amount: number): Length {
	return {
		amount,
		unit: LengthUnitName.CENTIMETERS
	};
}

export function asMeters(length: Length): number {
	const { amount, unit } = length;
	if (unit === LengthUnitName.CENTIMETERS) {
		return amount * 0.01;
	}
		
	if (unit === LengthUnitName.MILLIMETERS) {
		return amount * 0.001;
	}

	return amount;
}
