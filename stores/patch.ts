import { v4 as uuidv4 } from "uuid";
import { millimetre } from "~/utils/units/length";

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
			complete: hotWaterOutlets.complete ?? false,
		};
	}
}

function patchPipework(state: Record<string, unknown>) {
	const storeState = state as EcaasState;

	const pipework = storeState.domesticHotWater.pipework;

	if (Object.keys(pipework).some(k => k !== "data")) {
		storeState.domesticHotWater.pipework = {
			data: pipework.data ?? [],
			complete: pipework.complete ?? false,
		};
	}
}
/**
 * Handle legacy radiator product references and lengths persisted in old formats
 */

function patchRadiators(state: Record<string, unknown>) {
	const storeState = state as EcaasState;
	
	const heatEmitters = storeState.spaceHeating.heatEmitters.data;
	heatEmitters.forEach(heatEmitter => {
		if (!heatEmitter || !("emitters" in heatEmitter.data)) {
			return;
		}

		const emittersList = heatEmitter.data.emitters;
		emittersList.forEach((emitter) => {
			if (emitter.typeOfHeatEmitter === "radiator") {
				if (typeof emitter.productReference === "string" && !emitter.productReference.startsWith("CR")) {
					emitter.productReference = `CR${emitter.productReference}`;
				}
				if (typeof emitter.length === "number") {
					emitter.length = unitValue(emitter.length * 1000, millimetre);
				}
			}
		});
	});
}




/**
 * Handle edge case where emitters do not have an ID
 * @param state 
 */
function patchHeatEmitterIds(state: Record<string, unknown>) {
	const storeState = state as EcaasState;

	storeState.spaceHeating.heatEmitters.data.forEach(emittersData => {
		if ("emitters" in emittersData.data) {
			emittersData.data.emitters.forEach(emitter => {
				emitter.id ??= uuidv4();
			});
		}
	});
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
	patchHeatEmitterIds(state);
	patchRadiators(state);

	return state;
}