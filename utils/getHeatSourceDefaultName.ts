import type { SchemaHeatNetworkType } from "~/schema/aliases";
import { displayHeatNetworkType } from "./display";

export const getHeatSourceDefaultName = (item: HeatSourceFormData): string => {
	if (!item?.typeOfHeatSource) return "Heat source";
	const heatSourceType = item?.typeOfHeatSource;
	
	let heatSourceSubtype;

	if ("typeOfHeatPump" in item) {
		heatSourceSubtype = item.typeOfHeatPump;
	}
	if ("typeOfBoiler" in item) {
		heatSourceSubtype = item.typeOfBoiler;
	}
	if (heatSourceType === "heatNetwork") {
		// for heat network, just use the display form
		return item.typeOfHeatNetwork ? displayHeatNetworkType(item.typeOfHeatNetwork) : "Heat network";
	}
	if ("typeOfHeatNetwork" in item) {
		heatSourceSubtype = item.typeOfHeatNetwork;
	}
	if ("typeOfHeatBattery" in item) {
		heatSourceSubtype = item.typeOfHeatBattery;
	}

	return getDefaultProductName(heatSourceType, heatSourceSubtype);
};

function getDefaultProductName(
	productType: HeatSourceType,
	productSubtype = "",
) {
	const productTypeFormatted =
    productType[0]?.toUpperCase() + productType.slice(1);

	return !productSubtype.match(productTypeFormatted)
		? displayCamelToSentenceCase(productSubtype + productTypeFormatted)
		: displayCamelToSentenceCase(productSubtype);
}

export type HeatSourceFormData = {
	id: string;
	typeOfHeatSource: HeatSourceType;
	name?: string;
	typeOfHeatPump?: HeatPumpType;
	typeOfBoiler?: TypeOfBoiler;
	typeOfHeatNetwork?: SchemaHeatNetworkType;
	typeOfHeatBattery?: TypeOfHeatBattery;
};
