import type { Dimension } from "./types";
import { unit } from "./units";

export const cubicMetresPerHour = unit('cubic metres per hour');
export const cubicMetrePerHourPerSquareMetre = unit('cubic metres per hour per square metre');
export const litrePerSecond = unit('litres per second');
export const litrePerMinute = unit('litres per minute');
export const litrePerHour = unit('litres per hour');

export const _flowRateUnits = [cubicMetresPerHour, litrePerSecond, litrePerMinute, litrePerHour];

export type FlowRateUnit = (typeof _flowRateUnits)[number];
type FlowRateUnitName = FlowRateUnit['name'];

export type FlowRate = Dimension<FlowRateUnitName>;

export function asCubicMetresPerHour(flowRate: FlowRate): number {
	const { amount, unit } = flowRate;

	if (unit === 'litres per second') {
		const convertedAmount = amount * 3.6;
		return convertedAmount;
	}

	return amount;
}