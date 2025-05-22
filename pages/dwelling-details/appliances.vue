<script setup lang="ts">
import type { ApplianceKey } from '~/schema/api-schema.types';

const store = useEcaasStore();

const model = ref({
	...store.dwellingDetails.appliances.data
});

const applianceOptions: EnumRecord<Exclude<ApplianceKey, 'lighting' | 'Otherdevices'>, ApplianceKeyDisplay> = {
	Fridge: 'Fridge',
	Freezer: 'Freezer',
	'Fridge-Freezer': 'Fridge freezer',
	Dishwasher: 'Dishwasher',
	Oven: 'Oven',
	'Clothes_washing': 'Washing machine',
	'Clothes_drying': 'Tumble dryer',
	Hobs: 'Hobs',
	Kettle: 'Kettle',
	Microwave: 'Microwave'
};

const saveForm = (fields: typeof model.value) => {
	store.$patch({
		dwellingDetails: {
			appliances: {
				data: {
					appliances: fields.appliances
				},
				complete: true,
			},
		},
	});

	navigateTo("/dwelling-details");
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>Appliances</Title>
	</Head>
	<FormKit v-model="model" type="form" :actions="false" :incomplete-message="false" @submit="saveForm" @submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="appliancesErrorSummary"/>
		<h2 class="govuk-heading-l govuk-!-margin-bottom-3">Appliances</h2>
		<FormKit
			id="appliances"
			type="govCheckboxes"
			name="appliances"
			help="Select all that are present."
			:options="applianceOptions"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>