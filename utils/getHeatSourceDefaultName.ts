
export const getHeatSourceDefaultName = (item: HeatSourceFormData): string => {
	if (!item?.typeOfHeatSource) return "Heat source";
	const heatSourceType = item?.typeOfHeatSource;
	
	let productSubType: string | undefined;

	if ("typeOfHeatPump" in item) {
		productSubType = heatPumpTypes[item.typeOfHeatPump!];
	}

	if ("typeOfBoiler" in item) {
		return boilerTypes[item.typeOfBoiler!];
	}

	if (heatSourceType === "heatNetwork") {
		return item.typeOfHeatNetwork ? heatNetworkTypes[item.typeOfHeatNetwork] : "Heat network";
	}

	if ("typeOfHeatBattery" in item) {
		productSubType = heatBatteryTypes[item.typeOfHeatBattery!];
	}

	return getDefaultProductName(heatSourceType, productSubType);
};

function getDefaultProductName(heatSourceType: HeatSourceType, productSubType: string | undefined) {
	const formattedProductType = displayCamelToSentenceCase(heatSourceType);

	return productSubType ? `${productSubType} ${formattedProductType.toLowerCase()}` : formattedProductType;
}

export type HeatSourceFormData = {
	id: string;
	typeOfHeatSource: HeatSourceType;
	name?: string;
	typeOfHeatPump?: HeatPumpType;
	typeOfBoiler?: TypeOfBoiler;
	typeOfHeatNetwork?: TypeOfHeatNetwork;
	typeOfHeatBattery?: TypeOfHeatBattery;
};
