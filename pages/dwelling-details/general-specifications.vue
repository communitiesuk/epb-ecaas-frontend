<script setup>
    import { useEcaasStore } from '~/stores/ecaasStore';

    const store = useEcaasStore();
    const title = 'General specifications';

    const model = ref({
        ...store.dwellingDetails.generalSpecifications
    });

    const saveForm = async (fields) => {
        store.$patch({
            dwellingDetails: {
                generalSpecifications: {
                    typeOfResidence: fields.typeOfResidence,
                    status: 'Complete'
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
        <FormKit type="govButton" label="Save and continue" />
    </FormKit>
</template>