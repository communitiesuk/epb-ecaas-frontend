import { displayHeatEmitterType } from "./display";

export const getHeatEmitterDefaultName = (item: HeatEmitterFormData): string => {
	if (!item?.typeOfHeatEmitter) return "Heat emitter";
	const heatEmitterType = item.typeOfHeatEmitter;
	if (heatEmitterType === "wetDistributionSystem") {
		return "Wet distribution";
	}

	return displayHeatEmitterType(heatEmitterType) ?? "Heat emitter";
};

export type HeatEmitterFormData = {
	id?: string;
	typeOfHeatEmitter: HeatEmitterType;
	name?: string;
};
