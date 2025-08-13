export enum FlowRateUnitName {
	CUBIC_METRES_PER_HOUR = 'cubic metres per hour',
	CUBIC_METRES_PER_HOUR_PER_SQUARE_METRE = 'cubic metres per hour per square metre',
	LITRES_PER_SECOND = 'litres per second',
	LITRES_PER_HOUR = 'litres per hour',
	LITRES_PER_MINUTE = 'litres per minute'
}

export enum FlowRateSuffix {
	CUBIC_METRES_PER_HOUR = 'm³/h',
	CUBIC_METRES_PER_HOUR_PER_SQUARE_METRE = 'm³/(h·m²)',
	LITRES_PER_SECOND = 'litres per second',
	LITRES_PER_HOUR = 'litres per hour',
	LITRES_PER_MINUTE = 'litres per minute'
}

export class FlowRateUnit {
	name: FlowRateUnitName;
	suffix: FlowRateSuffix;

	constructor(name: FlowRateUnitName) {
		this.name = name;
		this.suffix = this.getSuffix();
	}

	private getSuffix() {
		switch (this.name) {
			case FlowRateUnitName.CUBIC_METRES_PER_HOUR: return FlowRateSuffix.CUBIC_METRES_PER_HOUR;
			case FlowRateUnitName.CUBIC_METRES_PER_HOUR_PER_SQUARE_METRE: return FlowRateSuffix.CUBIC_METRES_PER_HOUR_PER_SQUARE_METRE;
			case FlowRateUnitName.LITRES_PER_SECOND: return FlowRateSuffix.LITRES_PER_SECOND;
			case FlowRateUnitName.LITRES_PER_HOUR: return FlowRateSuffix.LITRES_PER_HOUR;
			case FlowRateUnitName.LITRES_PER_MINUTE: return FlowRateSuffix.LITRES_PER_MINUTE;
		}
	}
}

export const cubicMetrePerHour = new FlowRateUnit(FlowRateUnitName.CUBIC_METRES_PER_HOUR);
export const cubicMetrePerHourPerSquareMetre = new FlowRateUnit(FlowRateUnitName.CUBIC_METRES_PER_HOUR_PER_SQUARE_METRE);
export const litrePerSecond = new FlowRateUnit(FlowRateUnitName.LITRES_PER_SECOND);
export const litrePerHour = new FlowRateUnit(FlowRateUnitName.LITRES_PER_HOUR);
export const litrePerMinute = new FlowRateUnit(FlowRateUnitName.LITRES_PER_MINUTE);

export class FlowRate {
	amount: number;
	unit: FlowRateUnitName;

	constructor(amount: number, unit: FlowRateUnit) {
		this.amount = amount;
		this.unit = unit.name;
	}

	asCubicMetresPerHour(): FlowRate {
		if (this.unit === FlowRateUnitName.LITRES_PER_SECOND) {
			const convertedAmount = this.amount * 3.6;
			return new FlowRate(convertedAmount, cubicMetrePerHour);
		}

		return this;
	}
}