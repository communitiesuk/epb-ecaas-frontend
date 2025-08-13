export enum TemperatureUnitName {
	CELCIUS = 'celcius',
}

enum TemperatureSuffix {
	CELCIUS = '°C'
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
			case TemperatureUnitName.CELCIUS: return TemperatureSuffix.CELCIUS;
		}
	}
}

export const celcius = new TemperatureUnit(TemperatureUnitName.CELCIUS);