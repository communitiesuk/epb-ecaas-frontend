export enum FlowRateUnitName {
	CUBIC_METERS_PER_HOUR = 'cubic meters per hour',
	LITERS_PER_SECOND = 'liters per second'
}

export enum FlowRateSuffix {
	CUBIC_METERS_PER_HOUR = 'm³/h',
	LITERS_PER_SECOND = 'l/s'
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
			case FlowRateUnitName.CUBIC_METERS_PER_HOUR: return FlowRateSuffix.CUBIC_METERS_PER_HOUR;
			case FlowRateUnitName.LITERS_PER_SECOND: return FlowRateSuffix.LITERS_PER_SECOND;
		}
	}
}

export const literPerSecond = new FlowRateUnit(FlowRateUnitName.LITERS_PER_SECOND);
export const cubicMeterPerHour = new FlowRateUnit(FlowRateUnitName.CUBIC_METERS_PER_HOUR);

export class FlowRate {
	amount: number;
	unit: FlowRateUnitName;

	constructor(amount: number, unit: FlowRateUnit) {
		this.amount = amount;
		this.unit = unit.name;
	}

	asCubicMetersPerHour(): FlowRate {
		if (this.unit === FlowRateUnitName.LITERS_PER_SECOND) {
			const convertedAmount = this.amount * 0.001;
			return new FlowRate(convertedAmount, cubicMeterPerHour);
		}

		return this;
	}
}