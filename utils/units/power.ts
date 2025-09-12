export enum PowerUnitName {
	KILOWATT_HOUR = "kilowatt-hour",
	KILOWATT = "kilowatt",
	KILOWATT_PEAK = "kilowatt peak",
}

enum PowerSuffix {
	KILOWATT_HOUR = "kWh",
	KILOWATT = "kW",
	KILOWATT_PEAK = "kWp",
}

export class PowerUnit {
	name: PowerUnitName;
	suffix: PowerSuffix;

	constructor(name: PowerUnitName) {
		this.name = name;
		this.suffix = this.getSuffix();
	}

	private getSuffix() {
		switch (this.name) {
			case PowerUnitName.KILOWATT_HOUR: return PowerSuffix.KILOWATT_HOUR;
			case PowerUnitName.KILOWATT: return PowerSuffix.KILOWATT;
			case PowerUnitName.KILOWATT_PEAK: return PowerSuffix.KILOWATT_PEAK;
		}
	}
}

export const kilowattHour = new PowerUnit(PowerUnitName.KILOWATT_HOUR);
export const kilowatt = new PowerUnit(PowerUnitName.KILOWATT);
export const kilowattPeak = new PowerUnit(PowerUnitName.KILOWATT_PEAK);