import type { Dimension } from "./types";
import { asUnit } from "./units";

export const cubicMetresPerHour = asUnit("cubic metres per hour");
export const cubicMetrePerHourPerSquareMetre = asUnit("cubic metres per hour per square metre");
export const litrePerSecond = asUnit("litres per second");
export const litrePerMinute = asUnit("litres per minute");
export const litrePerHour = asUnit("litres per hour");

export const _flowRateUnits = [cubicMetresPerHour, litrePerSecond, litrePerMinute, litrePerHour];

export type FlowRateUnit = (typeof _flowRateUnits)[number];
type FlowRateUnitName = FlowRateUnit["name"];

export type FlowRate = Dimension<FlowRateUnitName>;

export function asCubicMetresPerHour(flowRate: FlowRate): number {
	const { amount, unit } = flowRate;

	if (unit === "litres per second") {
		const convertedAmount = amount * 3.6;
		return convertedAmount;
	}

	return amount;
}