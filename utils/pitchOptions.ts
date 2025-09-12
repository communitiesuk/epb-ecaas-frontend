import * as z from "zod";

export const standardPitchOption = z.enum(["90", "custom"]);

export type StandardPitchOption = z.infer<typeof standardPitchOption>;
export type StandardPitchOptionLabel = "90°" | "Custom";

export function standardPitchOptions(): Record<StandardPitchOption, StandardPitchOptionLabel> {
	return {
		"90": "90°",
		custom: "Custom",
	};
}

export const zeroPitchOption = z.enum(["0", "custom"]);

export type ZeroPitchOption = z.infer<typeof zeroPitchOption>;
export type ZeroPitchOptionLabel = "0°" | "Custom";

export function zeroPitchOptions(): Record<ZeroPitchOption, ZeroPitchOptionLabel> {
	return {
		"0": "0°",
		custom: "Custom",
	};
}