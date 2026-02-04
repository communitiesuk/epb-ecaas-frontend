export const getCombinedHeatSources = (store: EcaasState) => {
	
	const heatSourcesSpaceHeating = store.spaceHeating.heatSource.data;
	const heatSourcesDHW = store.domesticHotWaterNew.heatSources.data.filter((x) => x.data.isExistingHeatSource === false) ;
	return [...heatSourcesDHW,...heatSourcesSpaceHeating] as EcaasForm<HeatSourceData | DomesticHotWaterHeatSourceData>[];
};