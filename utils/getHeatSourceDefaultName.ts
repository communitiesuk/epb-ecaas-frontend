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
  if ("typeOfHeatNetwork" in item) {
    heatSourceSubtype = item.typeOfHeatNetwork;
  }
  if ("typeOfHeatBattery" in item) {
    heatSourceSubtype = item.typeOfHeatBattery;
  }

  return heatSourceSubtype
    ? getDefaultProductName(heatSourceType, heatSourceSubtype)
    : getDefaultProductName(heatSourceType);
};

function getDefaultProductName(
  productType: HeatSourceType,
  productSubtype = ""
) {
  const productTypeFormatted =
    productType[0]?.toUpperCase() + productType.slice(1);

  return !productSubtype.match(productTypeFormatted)
    ? displayCamelToSentenceCase(productSubtype + productTypeFormatted)
    : displayCamelToSentenceCase(productSubtype);
}

type HeatSourceFormData = Partial<HeatSourceData> & {
  id: string;
  typeOfHeatSource?: HeatSourceType;
  name?: string;
};
