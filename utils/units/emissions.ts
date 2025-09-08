export enum EmissionUnitName {
	CO2_PER_KILOWATT_HOUR = "CO2 per kilowatt-hour",
}

enum EmissionSuffix {
	CO2_PER_KILOWATT_HOUR = "kgCO2e/kWh"
}

export class EmissionUnit {
	name: EmissionUnitName;
	suffix: EmissionSuffix;

	constructor(name: EmissionUnitName) {
		this.name = name;
		this.suffix = this.getSuffix();
	}

	private getSuffix() {
		switch (this.name) {
			case EmissionUnitName.CO2_PER_KILOWATT_HOUR: return EmissionSuffix.CO2_PER_KILOWATT_HOUR;
		}
	}
}

export const co2PerKilowattHour = new EmissionUnit(EmissionUnitName.CO2_PER_KILOWATT_HOUR);