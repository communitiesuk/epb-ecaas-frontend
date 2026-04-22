
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
 * Handle legacy lighting data (imported as an object) and convert to an empty array
 * @param state 
 */
function patchLighting(state: Record<string, unknown>) {
	const storeState = state as EcaasState;

	const lightingData = storeState.dwellingFabric.dwellingSpaceLighting;

	if (Array.isArray(lightingData.data)) {
		return;
	}

	lightingData.data = [];
}

function patchHotWaterOutlets(state: Record<string, unknown>) {
	const storeState = state as EcaasState;

	const hotWaterOutlets = storeState.domesticHotWater.hotWaterOutlets;

	if (hotWaterOutlets && Object.keys(hotWaterOutlets).some(k => k !== "data")) {
		storeState.domesticHotWater.hotWaterOutlets = {
			data: hotWaterOutlets.data ?? [],
		};
	}
}

function patchPipework(state: Record<string, unknown>) {
	const storeState = state as EcaasState;

	const pipework = storeState.domesticHotWater.pipework;

	if (Object.keys(pipework).some(k => k !== "data")) {
		storeState.domesticHotWater.pipework = {
			data: pipework.data ?? [],
		};
	}
}

/**
 * Patch state from deprecated properties
 * @param state 
 * @returns Patched state
 */
export function patchState(state: Record<string, unknown>): Record<string, unknown> {
	patchPackageProductIds(state);
	patchLighting(state);
	patchHotWaterOutlets(state);
	patchPipework(state);

	return state;
}