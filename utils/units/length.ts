export enum LengthUnitName {
	METERS = 'meters',
	CENTIMETERS = 'centimeters',
	MILLIMETERS = 'millimeters',
}

enum LengthSuffix {
	METERS = 'm',
	CENTIMETERS = 'cm',
	MILLIMETERS = 'mm',
}

export class LengthUnit {
	name: LengthUnitName;
	suffix: LengthSuffix;

	constructor(name: LengthUnitName) {
		this.name = name;
		this.suffix = this.getSuffix();
	}

	private getSuffix() {
		switch (this.name) {
			case LengthUnitName.METERS: return LengthSuffix.METERS;
			case LengthUnitName.CENTIMETERS: return LengthSuffix.CENTIMETERS;
			case LengthUnitName.MILLIMETERS: return LengthSuffix.MILLIMETERS;
		}
	}
}

export const meter = new LengthUnit(LengthUnitName.METERS);
export const centimeter = new LengthUnit(LengthUnitName.CENTIMETERS);
export const millimeter = new LengthUnit(LengthUnitName.MILLIMETERS);

export class Length {
	amount: number;
	unit: LengthUnitName;

	constructor(amount: number, unit: LengthUnit) {
		this.amount = amount;
		this.unit = unit.name;
	}

	asMeters(): Length {
		if (this.unit === LengthUnitName.CENTIMETERS) {
			const convertedAmount = this.amount * 0.01;
			return new Length(convertedAmount, meter);
		}

		if (this.unit === LengthUnitName.MILLIMETERS) {
			const convertedAmount = this.amount * 0.001;
			return new Length(convertedAmount, millimeter);
		}

		return this;
	}
}