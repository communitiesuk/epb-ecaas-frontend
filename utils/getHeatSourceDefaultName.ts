export const getHeatSourceDefaultName = (
	updatedItem: HeatSourceWithoutName,
): string => {
	const heatSourceType = updatedItem?.typeOfHeatSource;
	const heatSourceTypeFormatted =
    heatSourceType.charAt(0).toUpperCase() + heatSourceType.slice(1);
	const heatSourceSubtype = updatedItem[`typeOf${heatSourceTypeFormatted}`];

	return heatSourceSubtype
		? getDefaultProductName(heatSourceType, heatSourceSubtype)
		: getDefaultProductName(heatSourceType);
};

export type HeatSourceWithoutName = {
	typeOfHeatSource: HeatSourceType;
} & Record<string, string | undefined>;

function getDefaultProductName(productType: HeatSourceType, productSubtype = "") {

	const productTypeFormatted =
    productType[0]?.toUpperCase() + productType.slice(1);

	return !productSubtype.match(productTypeFormatted)
		? displayCamelToSentenceCase(productSubtype + productTypeFormatted)
		: displayCamelToSentenceCase(productSubtype);
}
