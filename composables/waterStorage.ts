
export function useWaterStorage() {
	const store = useEcaasStore();

	const removeWaterStorage = (packageProductIds: string[]) => {
		store.$patch(state => {
			const waterStorageData = state.domesticHotWater.waterStorage.data;
			const packageProductIndex = waterStorageData.findIndex(x => packageProductIds.includes(x.data.id!));

			if (packageProductIndex >= 0) {
				waterStorageData.splice(packageProductIndex, 1);
			}
		});
	};

	const duplicateWaterStorage = (
		state: EcaasState,
		packageProductIds: string[],
	) => {
		const waterStorageData = state.domesticHotWater.waterStorage.data;
		const packageItem = waterStorageData.find(x => packageProductIds.includes(x.data.id!));

		if (!packageItem) {
			return;
		}

		const packagedDuplicates = waterStorageData.filter(x => x && x.data.name.match(duplicateNamePattern(packageItem.data.name)));
		
		const newPackagedItem = duplicateFormEntry(packageItem, packagedDuplicates.length, false) as EcaasForm<WaterStorageData>;

		waterStorageData.push(newPackagedItem);
		state.domesticHotWater.waterStorage.complete = false;

		return newPackagedItem;
	};

	return {
		removeWaterStorage,
		duplicateWaterStorage,
	};
}