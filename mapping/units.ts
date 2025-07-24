export enum LengthUnit {
	METERS = 'meters',
	CENTIMETERS = 'centimeters',
	MILLIMETERS = 'millimeters',
}

export interface Length {
	amount: number;
	unit: LengthUnit;
}

export function length(amount: number, unit: LengthUnit): Length {
	return { amount, unit };
}

export function lengthCm(amount: number): Length {
	return {
		amount,
		unit: LengthUnit.CENTIMETERS
	};
}

export function asMeters(length: Length): number {
	const { amount, unit } = length;
	if (unit === LengthUnit.CENTIMETERS) {
		return amount * 0.01;
	}
		
	if (unit === LengthUnit.MILLIMETERS) {
		return amount * 0.001;
	}

	return amount;
}
