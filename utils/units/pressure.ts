export enum PressureUnitName {
	PASCAL = "pascal",
}

enum PressureSuffix {
	PASCAL = "Pa"
}

export class PressureUnit {
	name: PressureUnitName;
	suffix: PressureSuffix;

	constructor(name: PressureUnitName) {
		this.name = name;
		this.suffix = this.getSuffix();
	}

	private getSuffix() {
		switch (this.name) {
			case PressureUnitName.PASCAL: return PressureSuffix.PASCAL;
		}
	}
}

export const pascal = new PressureUnit(PressureUnitName.PASCAL);