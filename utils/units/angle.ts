export enum AngleUnitName {
	DEGREES = "degrees",
}

enum AngleSuffix {
	DEGREES = "°",
}

export class AngleUnit {
	name: AngleUnitName;
	suffix: AngleSuffix;

	constructor(name: AngleUnitName) {
		this.name = name;
		this.suffix = this.getSuffix();
	}

	private getSuffix() {
		switch (this.name) {
			case AngleUnitName.DEGREES: return AngleSuffix.DEGREES;
		}
	}
}

export const degrees = new AngleUnit(AngleUnitName.DEGREES);