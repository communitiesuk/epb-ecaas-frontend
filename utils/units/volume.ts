import type { Dimension, UnitForDimension } from "./types";
import { unit } from "./units";

export type VolumeUnit = UnitForDimension<'volume'>;

export const litre = unit('litres');
export const cubicMetre = unit('cubic metres');

export type Volume = Dimension<VolumeUnit['name']>;

export function asLitres(volume: Volume): number {
	const { amount, unit } = volume;

	if (unit === 'cubic metres') {
		const convertedAmount = amount * 1000;
		return convertedAmount;
	}

	return amount;
}