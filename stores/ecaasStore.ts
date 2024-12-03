import { defineStore } from 'pinia';
import type { EcaasState } from './ecaasStore.types';
import formStatus from '~/constants/formStatus';
import type { GovTagProps } from '~/common.types';

type Section = keyof EcaasState;

export const useEcaasStore = defineStore('ecaas', {
    state: (): EcaasState => ({
        dwellingDetails: {
            generalSpecifications: {
                data: {}
            }
        }
    }),
    getters: {
        getSectionStatus: (state) => {
            return (section: Section): GovTagProps => {
                const subsections = state[section];

                type SectionForm = keyof typeof subsections;
                const sectionForms = Object.keys(subsections) as Array<SectionForm>;

                let status = formStatus.notStarted;
                let complete = 0;

                sectionForms.forEach(form => {
                    if (subsections[form].complete) {
                        status = formStatus.inProgress;
                        complete++;
                    }

                    if (complete === sectionForms.length) {
                        status = formStatus.complete;
                    }
                });

                return status;
            };
        }
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage()
    }
});