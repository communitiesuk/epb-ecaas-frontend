export enum FlowRateUnitName {
	CUBIC_METRES_PER_HOUR = 'cubic metres per hour',
	LITRES_PER_SECOND = 'litres per second'
}

export enum FlowRateSuffix {
	CUBIC_METRES_PER_HOUR = 'm³/h',
	LITRES_PER_SECOND = 'litres per second'
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
			case FlowRateUnitName.LITRES_PER_SECOND: return FlowRateSuffix.LITRES_PER_SECOND;
		}
	}
}

export const litrePerSecond = new FlowRateUnit(FlowRateUnitName.LITRES_PER_SECOND);
export const cubicMetrePerHour = new FlowRateUnit(FlowRateUnitName.CUBIC_METRES_PER_HOUR);

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