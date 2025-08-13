export enum VolumeUnitName {
	LITRES = 'litres',
	CUBIC_METRES = 'cubic metres'
}

export enum VolumeSuffix {
	LITRES = 'litres',
	CUBIC_METRES = 'm³'
}

export class VolumeUnit {
	name: VolumeUnitName;
	suffix: VolumeSuffix;

	constructor(name: VolumeUnitName) {
		this.name = name;
		this.suffix = this.getSuffix();
	}

	private getSuffix() {
		switch (this.name) {
			case VolumeUnitName.LITRES: return VolumeSuffix.LITRES;
			case VolumeUnitName.CUBIC_METRES: return VolumeSuffix.CUBIC_METRES;
		}
	}
	
}

export const litre = new VolumeUnit(VolumeUnitName.LITRES);
export const cubicMetre = new VolumeUnit(VolumeUnitName.CUBIC_METRES);

export class Volume {
	amount: number;
	unit: VolumeUnitName;

	constructor(amount: number, unit: VolumeUnit) {
		this.amount = amount;
		this.unit = unit.name;
	}

	asLitres(): Volume {
		if (this.unit === VolumeUnitName.CUBIC_METRES) {
			const convertedAmount = this.amount * 1000;
			return new Volume(convertedAmount, litre);
		}

		return this;
	}
}