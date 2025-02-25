import { defineStore } from 'pinia';
import type { EcaasState } from './ecaasStore.types';
import formStatus from '~/constants/formStatus';
import type { GovTagProps } from '~/common.types';
import { PageType, type Page } from '~/data/pages';

function getInitialState(): EcaasState {
	return {
		dwellingDetails: {
			generalSpecifications: { data: {} },
			appliances: { data: {} },
			shading: { data: {} },
			externalFactors: { data: {} }
		},
		hotWaterOutlets: {
			hotWaterDistribution: { data: {} }
		},
		livingSpaceFabric: {
			livingSpaceFloors: {
				livingSpaceGroundFloor: { data: [] }
			},
			livingSpaceWalls: {
				livingSpaceExternalWall: {data: []},
				livingSpaceInternalWall: {data: []},
				livingSpaceWallToUnheatedSpace: {data: []},
				livingSpacePartyWall: {data: []}
			},
			livingSpaceCeilingsAndRoofs: {
				livingSpaceCeilings: { data: [] },
				livingSpaceRoofs: { data: [] }
			},
			livingSpaceDoors: {
				livingSpaceExternalUnglazedDoor: { data: [] },
				livingSpaceExternalGlazedDoor: { data: [] },
				livingSpaceInternalDoor: { data: [] }
			},
			livingSpaceWindows: { data: [] }
		}
	};
}

export const useEcaasStore = defineStore('ecaas', {
	state: getInitialState,
	getters: {
		getStatus: (state) => {
			const stateEntries = Object.entries(state).filter(e => e[0] in getInitialState());

			return (page: Page): GovTagProps => {
				const section = getSection(page.id, Object.fromEntries(stateEntries));

				if (section) {
					const entry = Object.entries(section).find(x => x[0] === page.id)!;

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
		}
	},
	persist: {
		storage: piniaPluginPersistedstate.localStorage()
	}
});