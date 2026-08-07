
export function isHotWaterHeatSource(heatSource: HeatSourceData | DomesticHotWaterHeatSourceData): heatSource is DomesticHotWaterHeatSourceData {
	return "isExistingHeatSource" in heatSource;
}

export function isNewHeatSource(heatSource: HeatSourceData | DomesticHotWaterHeatSourceData):
	heatSource is HeatSourceData | NewDomesticHotWaterHeatSourceData {

	return !isHotWaterHeatSource(heatSource) || !heatSource.isExistingHeatSource;
}