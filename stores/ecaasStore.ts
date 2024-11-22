import { defineStore } from "pinia";

export const useEcaasStore = defineStore('ecaas', {
    state: () => ({
        dwellingDetails: {
            generalSpecifications: {
                typeOfResidence: '',
                status: 'Not started'
            }
        }
    }),
    persist: true
});