import { displayHeatEmitterType, displayRadiatorType } from "./display";

export const getHeatEmitterDefaultName = (item: HeatEmitterFormData): string => {
	if (!item?.typeOfHeatEmitter) return "Heat emitter";
	const heatEmitterType = item.typeOfHeatEmitter;

	if (heatEmitterType === "radiator") {
		const radiatorSubtype = "typeOfRadiator" in item ? item.typeOfRadiator ?? "" : "";
		if (!radiatorSubtype) return "Radiator";
		const display = displayRadiatorType(radiatorSubtype);
		return display.toLowerCase().includes("radiator") ? display : `${display} radiator`;
	}

	return displayHeatEmitterType(heatEmitterType) ?? "Heat emitter";
};

export type HeatEmitterFormData = {
	id?: string;
	typeOfHeatEmitter: HeatEmitterType;
	name?: string;
	typeOfRadiator?: "standard" | "towel" //COME BACK TO THIS AND INFER
};
