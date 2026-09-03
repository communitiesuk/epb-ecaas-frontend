import { v4 as uuidv4 } from "uuid";
import { millimetre } from "~/utils/units/length";
import type { EcaasFormList, ExternalGlazedDoorData, OpenablePartData, WindowData } from "./ecaasStore.schema";

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

function patchPvs(state: Record<string, unknown>) {
	const storeState = state as EcaasState & {
		pvAndBatteries?: {
			pvArrays?: EcaasState["pvAndBatteries"]["pvs"];
			pvs?: EcaasState["pvAndBatteries"]["pvs"];
		};
	};

	const pvAndBatteries = storeState.pvAndBatteries;
	const hasDefaultEmptyPvs = Array.isArray(pvAndBatteries?.pvs?.data)
		&& pvAndBatteries.pvs.data.length === 0
		&& pvAndBatteries.pvs.complete === undefined;

	if (!pvAndBatteries || !pvAndBatteries.pvArrays || (!hasDefaultEmptyPvs && pvAndBatteries.pvs)) {
		return;
	}

	pvAndBatteries.pvs = pvAndBatteries.pvArrays;
	delete pvAndBatteries.pvArrays;
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

function patchFloorIds(state: Record<string, unknown>) {
	const storeState = state as EcaasState;

	const { dwellingSpaceGroundFloor, dwellingSpaceFloorAboveUnheatedBasement, dwellingSpaceFloorOfHeatedBasement } = storeState.dwellingFabric.dwellingSpaceFloors;

	dwellingSpaceGroundFloor.data.forEach(floor => floor.data.id ??= uuidv4());
	dwellingSpaceFloorAboveUnheatedBasement.data.forEach(floor => floor.data.id ??= uuidv4());
	dwellingSpaceFloorOfHeatedBasement.data.forEach(floor => floor.data.id ??= uuidv4());
}

function patchRoofs(state: Record<string, unknown>) {
	const storeState = state as EcaasState;

	if ("dwellingSpaceCeilingsAndRoofs" in storeState.dwellingFabric) {
		const ceilingsAndRoofs = storeState.dwellingFabric.dwellingSpaceCeilingsAndRoofs;

		if (ceilingsAndRoofs && typeof ceilingsAndRoofs === "object") {
			if ("dwellingSpaceRoofs" in ceilingsAndRoofs) {
				const roofs = ceilingsAndRoofs.dwellingSpaceRoofs;
			
				if (roofs && typeof roofs === "object" &&
					"data" in roofs &&
					Array.isArray(roofs.data)
				) {
					storeState.dwellingFabric.dwellingSpaceRoofs.data = [
						...storeState.dwellingFabric.dwellingSpaceRoofs.data,
						...roofs.data,
					];
				}
			}

			if ("dwellingSpaceCeilings" in ceilingsAndRoofs) {
				const ceilings = ceilingsAndRoofs.dwellingSpaceCeilings;

				if (ceilings && typeof ceilings === "object" &&
					"data" in ceilings &&
					Array.isArray(ceilings.data) &&
					ceilings.data.length
				) {
					storeState.dwellingFabric.dwellingSpaceFloors.dwellingSpaceInternalFloor.complete = false;
					delete storeState.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
				}
			}
		}
	}
}

function patchWindows(state: Record<string, unknown>) {
	const storeState = state as EcaasState;
	const windows = storeState.dwellingFabric.dwellingSpaceWindows;

	patchOpenableParts(windows);
}

function patchExternalGlazedDoors(state: Record<string, unknown>) {
	const storeState = state as EcaasState;
	const doors = storeState.dwellingFabric.dwellingSpaceDoors.dwellingSpaceExternalGlazedDoor;

	patchOpenableParts(doors);
}

function patchOpenableParts(section: EcaasFormList<WindowData> | EcaasFormList<ExternalGlazedDoorData>) {
	section.data.forEach(element => {
		element.data.openableParts ??= [];

		for (let part = 1; part <= 4; part++) {
			const key = `midHeightOpenablePart${part}`;

			if (key in element.data) {
				const dataKey = key as keyof typeof element.data;

				element.data.openableParts.push({
					midHeight: Number(element.data[dataKey]),
				} as OpenablePartData);

				element.complete = false;
				section.complete = false;

				// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
				delete element.data[dataKey];
			}
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
	patchPvs(state);
	patchHeatEmitterIds(state);
	patchRadiators(state);
	patchFloorIds(state);
	patchRoofs(state);
	patchWindows(state);
	patchExternalGlazedDoors(state);

	return state;
}