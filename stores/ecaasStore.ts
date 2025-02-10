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
			appliances: { data: {} },
			shading: { data: {} },
			externalFactors: { data: {} }
		},
		hotWaterOutlets: {
			hotWaterDistribution: { data: {} }
		}
	}),
	getters: {
		getStatus: (state) => {
			return (page: Page): GovTagProps => {
				const sectionName = (page.id in state ? page.id : page.parentId) as Section;
				
				const section = state[sectionName]; 

				if (page.id in state) {

					let status = formStatus.notStarted;
					let complete = 0;

					const entries = Object.entries(section);

					entries.forEach(entry => {
						const form = entry[1] as EcaasForm<typeof entry[1]>;

						if (form.complete) {
							status = formStatus.inProgress;
							complete++;
						}

						if (complete === entries.length) {
							status = formStatus.complete;
						}
					});

					return status;
				}

				if (section && page.id in section) {
					const entry = Object.entries(section).find(x => x[0] === page.id)!;
					const form = entry[1] as EcaasForm<typeof entry[1]>;

					return form.complete ? formStatus.complete : formStatus.notStarted;
				}

				return formStatus.notStarted;
			};
		}
	},
	persist: {
		storage: piniaPluginPersistedstate.localStorage()
	}
});