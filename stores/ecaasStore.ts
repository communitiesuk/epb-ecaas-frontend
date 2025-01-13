import { defineStore } from 'pinia';
import type { EcaasState } from './ecaasStore.types';
import formStatus from '~/constants/formStatus';
import type { GovTagProps } from '~/common.types';
import type { Page } from '~/data/pages';

type Section = keyof EcaasState;

export const useEcaasStore = defineStore('ecaas', {
    state: (): EcaasState => ({
        dwellingDetails: {
            generalSpecifications: { data: {} },
			appliancesAndElectricity: { data: {} },
			hotWaterDistribution: { data: {} },
			shading: { data: {} }
        }
    }),
    getters: {
		getStatus: (state) => {
			return (page: Page): GovTagProps => {
				const section = (page.id in state ? page.id : page.parentId) as Section;
				
				const subsections = state[section];
				type Subsection = keyof typeof subsections;

				if (page.id in state) {
					const subsectionList = Object.keys(subsections) as Array<Subsection>;

					let status = formStatus.notStarted;
					let complete = 0;

					subsectionList.forEach(subsection => {
						if (subsections[subsection].complete) {
							status = formStatus.inProgress;
							complete++;
						}

						if (complete === subsectionList.length) {
							status = formStatus.complete;
						}
					});

					return status;
				}

				if (subsections && page.id in subsections) {
					const subsection = subsections[page.id as Subsection];
					return subsection?.complete ? formStatus.complete : formStatus.notStarted;
				}

				return formStatus.notStarted;
			};
		}
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage()
    }
});