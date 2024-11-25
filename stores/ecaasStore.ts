import { defineStore } from "pinia";
import type { EcaasState } from "./ecaasStore.types";
import FormStatus from "~/constants/formStatus";

type Section = keyof EcaasState;

export const useEcaasStore = defineStore('ecaas', {
    state: (): EcaasState => ({
        dwellingDetails: {
            generalSpecifications: {
                data: {
                    typeOfResidence: ''
                }
            }
        }
    }),
    getters: {
        getSectionStatus: (state) => {
            return (section: Section): string => {
                const subsections = state[section];

                type SectionForm = keyof typeof subsections;
                const sectionForms = Object.keys(subsections) as Array<SectionForm>;

                let status = FormStatus.NotStarted;
                let complete = 0;

                sectionForms.forEach(form => {
                    if (subsections[form].complete) {
                        status = FormStatus.InProgress;
                        complete++;
                    }

                    if (complete === sectionForms.length) {
                        status = FormStatus.Complete;
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