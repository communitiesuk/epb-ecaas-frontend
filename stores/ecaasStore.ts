import { defineStore } from "pinia";
import type { EcaasForm, EcaasState, UsesPitchComponent } from "./ecaasStore.schema";
import formStatus from "~/constants/formStatus";
import type { GovTagProps } from "~/common.types";
import { PageType } from "~/data/pages/pages.types";
import type { Page } from "~/data/pages/pages.types";
import type { EmptyObject } from "type-fest";
import pagesData from "~/data/pages/pages";

export function getInitialState(): EcaasState {
	const store: NulledForms<EcaasState> = {
		dwellingDetails: {
			generalSpecifications: { data: {} },
			shading: { data: [] },
			externalFactors: { data: {} },
		},
		infiltrationAndVentilation: {
			mechanicalVentilation: { data: [] },
			ductwork: { data: [] },
			vents: { data: [] },
			combustionAppliances: {
				open_fireplace: { data: [] },
				closed_with_fan: { data: [] },
				open_gas_flue_balancer: { data: [] },
				open_gas_kitchen_stove: { data: [] },
				open_gas_fire: { data: [] },
				closed_fire: { data: [] },
			},
			naturalVentilation: { data: {} },
			airPermeability: { data: {} },
		},
		domesticHotWater: {
			waterHeating: {
				hotWaterCylinder: { data: [] },
				immersionHeater: { data: [] },
				solarThermal: { data: [] },
				pointOfUse: { data: [] },
				heatPump: { data: [] },
				combiBoiler: { data: [] },
				heatBattery: { data: [] },
				smartHotWaterTank: { data: [] },
				heatInterfaceUnit: { data: [] },
			},
			hotWaterOutlets: {
				mixedShower: { data: [] },
				electricShower: { data: [] },
				bath: { data: [] },
				otherOutlets: { data: [] },
			},
			pipework: {
				primaryPipework: { data: [] },
				secondaryPipework: { data: [] },
			},
			wwhrs: { data: [] },
		},
		dwellingFabric: {
			dwellingSpaceFloors: {
				dwellingSpaceGroundFloor: { data: [] },
				dwellingSpaceInternalFloor: { data: [] },
				dwellingSpaceExposedFloor: { data: [] },
			},
			dwellingSpaceWalls: {
				dwellingSpaceExternalWall: { data: [] },
				dwellingSpaceInternalWall: { data: [] },
				dwellingSpaceWallToUnheatedSpace: { data: [] },
				dwellingSpacePartyWall: { data: [] },
			},
			dwellingSpaceCeilingsAndRoofs: {
				dwellingSpaceCeilings: { data: [] },
				dwellingSpaceRoofs: { data: [] },
			},
			dwellingSpaceDoors: {
				dwellingSpaceExternalUnglazedDoor: { data: [] },
				dwellingSpaceExternalGlazedDoor: { data: [] },
				dwellingSpaceInternalDoor: { data: [] },
			},
			dwellingSpaceWindows: { data: [] },
			dwellingSpaceThermalBridging: {
				dwellingSpaceLinearThermalBridges: { data: [] },
				dwellingSpacePointThermalBridges: { data: [] },
			},
			dwellingSpaceZoneParameters: { data: {} },
			dwellingSpaceLighting: { data: {} },
		},
		heatingSystems: {
			heatGeneration: {
				heatPump: { data: [] },
				boiler: { data: [] },
				heatBattery: { data: [] },
				heatNetwork: { data: [] },
				heatInterfaceUnit: { data: [] },
			},
			energySupply: { data: {} },
			heatEmitting: {
				wetDistribution: { data: [] },
				instantElectricHeater: { data: [] },
				electricStorageHeater: { data: [] },
				warmAirHeatPump: { data: [] },
			},
			cooling: {
				airConditioning: { data: [] },
			},
		},
		pvAndBatteries: {
			pvSystems: { data: [] },
			electricBattery: { data: [] },
		},
	};
	return store as EcaasState;
}

export const useEcaasStore = defineStore("ecaas", {
	state: getInitialState,
	getters: {
		getStatus: (state) => {
			const stateEntries = Object.entries(state).filter(
				(e) => e[0] in getInitialState(),
			);

			return (page: Page): GovTagProps => {
				const section = getSection(page.id, Object.fromEntries(stateEntries));

				if (section) {
					const entry = Object.entries(section).find((x) => x[0] === page.id)!;

					if (page.id === "ductwork") {
						return getDuctworkStatus(entry[1]);
					}

					if (page.type === PageType.Task) {
						return getTaskStatus(entry[1]);
					}

					if (page.type === PageType.TaskGroup) {
						return getSectionStatus(entry[1]);
					}

					if (page.type === PageType.Section) {
						return getSectionStatus(entry[1]);
					}
				}

				return formStatus.notStarted;
			};
		},
	},
	actions: {
		async postEcaasState() {
			try {
				await $fetch("/api/setState", {
					method: "POST",
					body: this.$state,
				});
			} catch (error) {
				console.error(`Failed to post data: ${error}`);
			}
		},
		clearState() {
			this.$reset();
		},
		revalidate() {
			const { newState: newValidatedState } = revalidateState(this.$state as EcaasState);

			this.$patch({
				...getInitialState(),
				...newValidatedState,
				lastResult: undefined,
			});
		},
	},
	persist: {
		storage: piniaPluginPersistedstate.localStorage(),
	},
});

export type NulledForms<T> = { [P in keyof T]: T[P] extends EcaasForm<infer U> ? EcaasForm<U | EmptyObject> : NulledForms<T[P]> };

/** Function to wrap a form that uses the Pitch component (which writes to pitch and pitchOption fields) and extract the pitch number value */
export function extractPitch(form: UsesPitchComponent): number {
	const { pitch, pitchOption } = form;
	if (pitchOption === "custom") {
		return pitch!;
	}
	return Number(pitchOption);
}

export function hasCompleteState(state: EcaasState): boolean {
	const stateEntries = Object.entries(state).filter(
		(e) => e[0] in getInitialState(),
	);
	// go over section pages and check they are all complete
	const sectionPages = pagesData.filter(page => page.type === PageType.Section);

	return sectionPages.every(page => {
		const section = Object.fromEntries(stateEntries.filter(e => e[0] === page.id));
		return getSectionStatus(section as Record<string, object>).text === "Complete";
	});
}
