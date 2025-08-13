export enum ThermalConductivityUnitName {
	WATTS_PER_KELVIN = 'watts per kelvin',
	WATTS_PER_METER_KELVIN = 'watts per meter-Kelvin',
	WATTS_PER_SQUARE_METER_KELVIN = 'watts per sqare meter-Kelvin',
	SQUARE_METER_KELVIN_PER_WATT = 'square meter-Kelvin per watt',
	KILOWATT_HOUR_PER_KELVIN = 'kilowatt hour per kelvin'
}

enum ThermalConductivitySuffix {
	WATTS_PER_KELVIN = 'W/K',
	WATTS_PER_METER_KELVIN = 'W/(m·K)',
	WATTS_PER_SQUARE_METER_KELVIN = 'W/(m²·K)',
	SQUARE_METER_KELVIN_PER_WATT = '(m²·K)/W',
	KILOWATT_HOUR_PER_KELVIN = 'kWh/K'
}

export class ThermalConductivityUnit {
	name: ThermalConductivityUnitName;
	suffix: ThermalConductivitySuffix;

	constructor(name: ThermalConductivityUnitName) {
		this.name = name;
		this.suffix = this.getSuffix();
	}

	private getSuffix() {
		switch (this.name) {
			case ThermalConductivityUnitName.WATTS_PER_KELVIN: return ThermalConductivitySuffix.WATTS_PER_KELVIN;
			case ThermalConductivityUnitName.WATTS_PER_METER_KELVIN: return ThermalConductivitySuffix.WATTS_PER_METER_KELVIN;
			case ThermalConductivityUnitName.WATTS_PER_SQUARE_METER_KELVIN: return ThermalConductivitySuffix.WATTS_PER_SQUARE_METER_KELVIN;
			case ThermalConductivityUnitName.SQUARE_METER_KELVIN_PER_WATT: return ThermalConductivitySuffix.WATTS_PER_SQUARE_METER_KELVIN;
			case ThermalConductivityUnitName.KILOWATT_HOUR_PER_KELVIN: return ThermalConductivitySuffix.KILOWATT_HOUR_PER_KELVIN;
		}
	}
}

export const wattsPerKelvin = new ThermalConductivityUnit(ThermalConductivityUnitName.WATTS_PER_KELVIN);
export const wattsPerMeterKelvin = new ThermalConductivityUnit(ThermalConductivityUnitName.WATTS_PER_METER_KELVIN);
export const wattsPerSquareMeterKelvin = new ThermalConductivityUnit(ThermalConductivityUnitName.WATTS_PER_SQUARE_METER_KELVIN);
export const squareMeterKelvinPerWatt = new ThermalConductivityUnit(ThermalConductivityUnitName.SQUARE_METER_KELVIN_PER_WATT);
export const kilowattHourPerKelvin = new ThermalConductivityUnit(ThermalConductivityUnitName.KILOWATT_HOUR_PER_KELVIN);