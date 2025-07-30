export enum LengthUnitName {
	METRES = 'metres',
	CENTIMETRES = 'centimetres',
	MILLIMETRES = 'millimetres',
}

enum LengthSuffix {
	METRES = 'm',
	CENTIMETRES = 'cm',
	MILLIMETRES = 'mm',
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
			case LengthUnitName.METRES: return LengthSuffix.METRES;
			case LengthUnitName.CENTIMETRES: return LengthSuffix.CENTIMETRES;
			case LengthUnitName.MILLIMETRES: return LengthSuffix.MILLIMETRES;
		}
	}
}

export const metre = new LengthUnit(LengthUnitName.METRES);
export const centimetre = new LengthUnit(LengthUnitName.CENTIMETRES);
export const millimetre = new LengthUnit(LengthUnitName.MILLIMETRES);

export class Length {
	amount: number;
	unit: LengthUnitName;

	constructor(amount: number, unit: LengthUnit) {
		this.amount = amount;
		this.unit = unit.name;
	}

	asMetres(): Length {
		if (this.unit === LengthUnitName.CENTIMETRES) {
			const convertedAmount = this.amount * 0.01;
			return new Length(convertedAmount, metre);
		}

		if (this.unit === LengthUnitName.MILLIMETRES) {
			const convertedAmount = this.amount * 0.001;
			return new Length(convertedAmount, millimetre);
		}

		return this;
	}
}