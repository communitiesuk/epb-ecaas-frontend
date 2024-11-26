<script setup lang="ts">
    import { useEcaasStore } from '~/stores/ecaasStore';

    const title = 'General specifications';
    const store = useEcaasStore();

    const model = ref({
        ...store.dwellingDetails.generalSpecifications.data
    });

    const saveForm = async (fields: typeof model.value) => {
        store.$patch({
            dwellingDetails: {
                generalSpecifications: {
                    typeOfResidence: fields.typeOfResidence,
                    status: 'Complete',  
                    weatherDataLocation: fields.weatherDataLocation,
                    status:'Complete',
                    storiesInDwelling: fields.storiesInDwelling,
                    status:'Complete',
                }
            }
        });

        navigateTo('/dwelling-details');
    };
</script>

<template>
    <Head>
        <Title>{{ title }}</Title>
    </Head>
    <h1 class="govuk-heading-l">{{ title }}</h1>
    <FormKit type="form" v-model="model" @submit="saveForm" :actions="false">
        <FormKit
            type="govRadios"
            :options="{
                house: 'House',
                flat: 'Flat'
            }"
            label="Type of residence"
            name="typeOfResidence"
            validation="required"
        />
        <FormKit
            type="govDropdown"
            label="Weather data location"
            name="weatherDataLocation"
            :options="{
                london: 'London',
                manchester: 'Manchester',
                york: 'York'
            }"
            validation="required"
        />

        <FormKit
            type="govInput"
            label="Number of stories in dwelling"
            name="storiesInDwelling"
            validation="required | number"
            />
            
        <FormKit type="govButton" label="Save and continue" />
    </FormKit>
</template>