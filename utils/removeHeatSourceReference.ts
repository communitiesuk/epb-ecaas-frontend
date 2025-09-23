export const removeHeatSourceReference = (storeItems: EcaasFormList<HotWaterCylinderData| WetDistributionData> , id: string | undefined) => {
	const store = useEcaasStore();

	storeItems.data.forEach((x, index: number) => {
		if (x.data.heatSource === id) {
			store.$patch(() => {
				storeItems.data[index]!.data.heatSource = undefined;
				storeItems.data[index]!.complete = false;
				storeItems.complete = false;
			});
		}
	});
};
