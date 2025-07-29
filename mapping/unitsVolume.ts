enum VolumeUnitName {
	LITERS = 'liters',
	CUBIC_METERS = 'cubic meters'
}

enum VolumeSuffix {
	LITERS = 'l',
	CUBIC_METERS = 'm³'
}
class VolumeUnit {
	name: VolumeUnitName;
	suffix: VolumeSuffix;

	constructor(name: VolumeUnitName) {
		this.name = name;
		this.suffix = this.getSuffix();
	}

	private getSuffix() {
		switch (this.name) {
			case VolumeUnitName.LITERS: return VolumeSuffix.LITERS;
			case VolumeUnitName.CUBIC_METERS: return VolumeSuffix.CUBIC_METERS;
		}
	}
	
}

export const liter = new VolumeUnit(VolumeUnitName.LITERS);
export const cubicMeter = new VolumeUnit(VolumeUnitName.CUBIC_METERS);

export class Volume {
	amount: number;
	unit: VolumeUnitName;

	constructor(amount: number, unit: VolumeUnit) {
		this.amount = amount;
		this.unit = unit.name;
	}

	asCubicMeters(): Volume {
		if (this.unit === VolumeUnitName.LITERS) {
			const convertedAmount = this.amount * 0.001;
			return new Volume(convertedAmount, cubicMeter);
		}

		return this;
	}
}