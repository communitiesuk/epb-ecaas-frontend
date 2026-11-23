export const getCombinedHeatSources = (store: EcaasState) => {

	const heatSourcesSpaceHeating = store.spaceHeating.heatSource.data;
	const heatSourcesDHW = store.domesticHotWater.heatSources.data.filter((x) => x.data.isExistingHeatSource === false);
	return [...heatSourcesDHW, ...heatSourcesSpaceHeating] as EcaasForm<HeatSourceData | DomesticHotWaterHeatSourceData>[];
};

export const getCombinedHeatPumpsAndBoilers = (store: EcaasState) => {
	const heatSourcesSpaceHeating = store.spaceHeating.heatSource.data.filter((x) => x.data.typeOfHeatSource === "heatPump" || x.data.typeOfHeatSource === "boiler");
	const heatSourcesDHW = store.domesticHotWater.heatSources.data.filter((x) => x.data.isExistingHeatSource === false && (x.data.typeOfHeatSource === "heatPump" || x.data.typeOfHeatSource === "boiler"));
	return [...heatSourcesDHW, ...heatSourcesSpaceHeating] as EcaasForm<Extract<HeatSourceData, { typeOfHeatSource: "heatPump" | "boiler" }> | Extract<DomesticHotWaterHeatSourceData, { isExistingHeatSource: false; typeOfHeatSource: "heatPump" | "boiler" }>, "name">[];
};