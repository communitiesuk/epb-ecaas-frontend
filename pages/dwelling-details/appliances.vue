<script setup lang="ts">
const store = useEcaasStore();

const model = ref({
	...store.dwellingDetails.appliances.data
});

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
			:options="{
				fridge: 'Fridge',
				freezer: 'Freezer',
				fridgeFreezer: 'Fridge freezer',
				dishwasher: 'Dishwasher',
				oven: 'Oven',
				washingMachine: 'Washing machine',
				tumbleDryer: 'Tumble dryer',
				hobs: 'Hobs',
				kettle: 'Kettle',
				microwave: 'Microwave'
			}"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>