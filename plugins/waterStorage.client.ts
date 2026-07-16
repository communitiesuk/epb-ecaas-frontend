export default defineNuxtPlugin(() => {
	const nuxtApp = useNuxtApp();
	const store = useEcaasStore();

	const removeColdWaterSource = (id: string) => (waterStorage: EcaasForm<Partial<WaterStorageData> | Partial<PreheatedWaterStorageData> | Partial<DomesticHotWaterHeatSourceData>>) => {
		if (waterStorage.data.coldWaterSource === id) {
			waterStorage.data.coldWaterSource = undefined;
			waterStorage.complete = false;
		}
	};

	const removeColdWaterSources = (id: string) => {
		store.$patch(state => {
			const { waterStorage, preheatedWaterStorage, heatSources } = state.domesticHotWater;

			waterStorage.data.forEach(removeColdWaterSource(id));
			waterStorage.complete = false;

			preheatedWaterStorage.data.forEach(removeColdWaterSource(id));
			preheatedWaterStorage.complete = false;

			heatSources.data.forEach(removeColdWaterSource(id));
			heatSources.complete = false;
		});
	};

	const resetHeatSourceWaterCylinderConfig = (heatSource: EcaasForm<Partial<HeatSourceData | NewDomesticHotWaterHeatSourceData>>) => {
		if (heatSource.data.typeOfHeatSource === "heatPump" && heatSource.data.packagedWithWaterCylinder) {
			heatSource.data.waterCylinderConfiguration = undefined;
			heatSource.complete = false;
		}
	};

	const resetWaterCylinderConfig = () => {
		store.$patch(state => {
			const hotWaterHeatSources = state.domesticHotWater.heatSources.data;
			const spaceHeatingHeatSources = state.spaceHeating.heatSource.data;

			const connectedSpaceHeatingHeatSources = spaceHeatingHeatSources.filter(x =>
				x.data.typeOfHeatSource === "heatPump" &&
				"packagedWithWaterCylinder" in x.data &&
				x.data.packagedWithWaterCylinder,
			);

			const connectedHotWaterHeatSources = hotWaterHeatSources.filter(x => 
				!x.data.isExistingHeatSource &&
				x.data.typeOfHeatSource === "heatPump" &&
				x.data.packagedWithWaterCylinder &&
				x.data.waterCylinderConfiguration === "preheatedWaterCylinder",
			);

			connectedSpaceHeatingHeatSources.forEach(resetHeatSourceWaterCylinderConfig);
			connectedHotWaterHeatSources.forEach(resetHeatSourceWaterCylinderConfig);
		});
	};

	nuxtApp.hook("app:wwhrs:removed", removeColdWaterSources);
	nuxtApp.hook("app:preheatedWaterCylinder:removed", id => {
		removeColdWaterSources(id);
		resetWaterCylinderConfig();
	});
});