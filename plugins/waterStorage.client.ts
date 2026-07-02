export default defineNuxtPlugin(() => {
	const nuxtApp = useNuxtApp();
	const store = useEcaasStore();

	const removeColdWaterSource = (id: string) => (waterStorage: EcaasForm<Partial<WaterStorageData> | Partial<PreheatedWaterStorageData>>) => {
		if (waterStorage.data.coldWaterSource === id) {
			waterStorage.data.coldWaterSource = undefined;
			waterStorage.complete = false;
			waterStorage.complete = false;
		}
	};

	const removeColdWaterSources = (id: string) => {
		store.$patch(state => {
			const { waterStorage, preheatedWaterStorage } = state.domesticHotWater;

			waterStorage.data.forEach(removeColdWaterSource(id));
			preheatedWaterStorage.data.forEach(removeColdWaterSource(id));
		});
	};

	nuxtApp.hook("app:wwhrs:removed", removeColdWaterSources);
	nuxtApp.hook("app:preheatedWaterCylinder:removed", removeColdWaterSources);
});