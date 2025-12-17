export const getHeatSourceDefaultName = (
	updatedItem: HeatSourceWithoutName,
): string => {
	const heatSource = updatedItem?.typeOfHeatSource;
	let defaultName;
	const heatSourceFormatted = heatSource.charAt(0).toUpperCase() + heatSource.slice(1); 
 
	const heatSourceProductType = updatedItem[`typeOf${heatSourceFormatted}`];
  
	if (heatSourceProductType) {
		defaultName = `${displayCamelToSentenceCase(heatSourceProductType + heatSource[0]?.toUpperCase() + heatSource.slice(1))}`;
	} else {
		defaultName = displayCamelToSentenceCase(heatSourceFormatted);
	}
	return defaultName;
};

export type HeatSourceWithoutName = {
	typeOfHeatSource: HeatSourceType;
} & Record<string, string | undefined>;
