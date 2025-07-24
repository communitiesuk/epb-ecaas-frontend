export enum LengthUnit {
	METERS = 'meters',
	CENTIMETERS = 'centimeters',
	MILLIMETERS = 'millimeters',
}

export class Length {
	amount: number;
	unit: LengthUnit;

	constructor(amount: number, unit: LengthUnit) {
		this.amount = amount;
		this.unit = unit;
	}

	inMeters() {		
		if (this.unit === LengthUnit.CENTIMETERS) {
			return this.amount * 0.01;
		}
		
		if (this.unit === LengthUnit.MILLIMETERS) {
			return this.amount * 0.001;
		}

		return this.amount;
	}
}
