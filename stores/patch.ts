
/**
 * Copy deprecated packageProductId value to new packageProductIds array
 * @param state
 */
function patchPackageProductIds(state: Record<string, unknown>) {
	const storeState = state as EcaasState;

	const spaceHeatingHeatSources = storeState.spaceHeating.heatSource.data as EcaasForm<HeatSourceData>[];
	const domesticHotWaterHeatSources = storeState.domesticHotWater.heatSources.data as EcaasForm<DomesticHotWaterHeatSourceData>[];

	const patchData = <T extends object>(entry: EcaasForm<T>) => {
		if ("packageProductId" in entry.data) {
			const newData: Record<string, unknown> = {
				...entry.data,
				"packageProductIds": [entry.data.packageProductId],
			};

			delete newData.packageProductId;

			entry.data = newData as T;
		}
	};

	spaceHeatingHeatSources.forEach(patchData);
	domesticHotWaterHeatSources.forEach(patchData);
}

/**
 * Patch state from deprecated properties
 * @param state 
 * @returns Patched state
 */
export function patchState(state: Record<string, unknown>): Record<string, unknown> {
	patchPackageProductIds(state);

	return state;
}