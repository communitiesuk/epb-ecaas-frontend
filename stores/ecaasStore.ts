import { defineStore } from "pinia";
import type { EcaasForm, EcaasState, UsesPitchComponent } from "./ecaasStore.types";
import formStatus from "~/constants/formStatus";
import type { GovTagProps } from "~/common.types";
import { PageType, type Page } from "~/data/pages/pages.types";
import { CombustionApplianceType } from "~/schema/api-schema.types";
import type { EmptyObject } from "type-fest";
import pagesData from "~/data/pages/pages";

function getInitialState(): EcaasState {
	const store: NulledForms<EcaasState> = {
		dwellingDetails: {
			generalSpecifications: { data: {} },
			shading: { data: [] },
			externalFactors: { data: {} }
		},
		infiltrationAndVentilation: {
			mechanicalVentilation: { data: [] },
			ductwork: {data: []},
			vents: { data: [] },
			combustionAppliances: {
				[CombustionApplianceType.open_fireplace]: { data: [] },
				[CombustionApplianceType.closed_with_fan]: { data: [] },
				[CombustionApplianceType.open_gas_flue_balancer]: { data: [] },
				[CombustionApplianceType.open_gas_kitchen_stove]: { data: [] },
				[CombustionApplianceType.open_gas_fire]: { data: [] },
				[CombustionApplianceType.closed_fire]: { data: [] },
			},
			naturalVentilation: { data: {} },
			airPermeability: { data: {} }
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
				heatInterfaceUnit: { data: [] }
			},
			hotWaterOutlets: {
				mixedShower: { data: [] },
				electricShower: { data: [] },
				bath: { data: [] },
				otherOutlets: { data: [] }
			},
			pipework: {
				primaryPipework: { data: [] },
				secondaryPipework: { data: [] }
			},
			wwhrs: { data: [] }
		},
		livingSpaceFabric: {
			livingSpaceFloors: {
				livingSpaceGroundFloor: { data: [] },
				livingSpaceInternalFloor: { data: [] },
				livingSpaceExposedFloor: { data: [] },
			},
			livingSpaceWalls: {
				livingSpaceExternalWall: { data: [] },
				livingSpaceInternalWall: { data: [] },
				livingSpaceWallToUnheatedSpace: { data: [] },
				livingSpacePartyWall: { data: [] },
			},
			livingSpaceCeilingsAndRoofs: {
				livingSpaceCeilings: { data: [] },
				livingSpaceRoofs: { data: [] },
				livingSpaceUnheatedPitchedRoofs: { data: [] }
			},
			livingSpaceDoors: {
				livingSpaceExternalUnglazedDoor: { data: [] },
				livingSpaceExternalGlazedDoor: { data: [] },
				livingSpaceInternalDoor: { data: [] },
			},
			livingSpaceWindows: { data: [] },
			livingSpaceThermalBridging: {
				livingSpaceLinearThermalBridges: { data: [] },
				livingSpacePointThermalBridges: { data: [] }
			}, 
			livingSpaceZoneParameters: { data: {} }
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
				wetDistribution: { data: []},
				instantElectricHeater: { data: [] },
				electricStorageHeater: { data: [] },
				warmAirHeatPump: { data: [] },
			},
		},
		pvAndBatteries: {
			pvSystem: { data: [] },
			electricBattery: { data: [] }
		},
		cooling: {
			airConditioning: { data: [] }
		},
	};
	return store as EcaasState;
}	

export const useEcaasStore = defineStore("ecaas", {
	state: getInitialState,
	getters: {
		getStatus: (state) => {
			const stateEntries = Object.entries(state).filter(
				(e) => e[0] in getInitialState()
			);

			return (page: Page): GovTagProps => {
				const section = getSection(page.id, Object.fromEntries(stateEntries));

				if (section) {
					const entry = Object.entries(section).find((x) => x[0] === page.id)!;
					
					if(page.id === "ductwork"){
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
		async postEcaasState (){
			try {
				await $fetch("/api/setState", {
					method: "POST",
					body: this.$state,
				});
			} catch (error) {
				console.error(`Failed to post data: ${error}`);
			}
		},
	},
	persist: {
		storage: piniaPluginPersistedstate.localStorage(),
	}
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
		(e) => e[0] in getInitialState()
	);
	// go over section pages and check they are all complete
	return pagesData.filter(page => page.type === PageType.Section).every(page => {
		const section = getSection(page.id, Object.fromEntries(stateEntries))!;
		return getSectionStatus(section as Record<string, object>).text === 'Complete';
	});
}
