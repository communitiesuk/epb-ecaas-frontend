import { EcaasError } from "~/errors.types";

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

	const preventDuplicateWaterStorage = (
		state: EcaasState,
		packageProductIds: string[],
	) => {
		const waterStorageData = state.domesticHotWater.waterStorage.data;
		const packageItem = waterStorageData.find(x => packageProductIds.includes(x.data.id!));

		if (packageItem) {
			throw new EcaasError("DUPLICATION_ERROR");
		}
	};

	return {
		removeWaterStorage,
		preventDuplicateWaterStorage,
	};
}