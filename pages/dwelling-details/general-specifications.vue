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
                    complete: true,
                    data: {
                        typeOfResidence: fields.typeOfResidence
                    }
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