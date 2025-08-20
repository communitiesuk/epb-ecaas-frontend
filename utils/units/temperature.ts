export enum TemperatureUnitName {
	CELSIUS = 'celsius',
}

enum TemperatureSuffix {
	CELSIUS = '°C'
}

export class TemperatureUnit {
	name: TemperatureUnitName;
	suffix: TemperatureSuffix;

	constructor(name: TemperatureUnitName) {
		this.name = name;
		this.suffix = this.getSuffix();
	}

	private getSuffix() {
		switch (this.name) {
			case TemperatureUnitName.CELSIUS: return TemperatureSuffix.CELSIUS;
		}
	}
}

export const celsius = new TemperatureUnit(TemperatureUnitName.CELSIUS);