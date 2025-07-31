<script setup lang="ts">
const title = "General details";
const store = useEcaasStore();

const model = ref({
	...store.dwellingFabric.dwellingSpaceLighting.data,
});

const saveForm = (fields: typeof model.value) => {
	store.$patch({
		dwellingFabric: {
			dwellingSpaceLighting: {
				data: {
					numberOfLEDBulbs: fields.numberOfLEDBulbs,
					numberOfIncandescentBulbs: fields.numberOfIncandescentBulbs
				},
				complete: true
			},
		},
	});

	navigateTo("/dwelling-space");
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
		@submit-invalid="handleInvalidSubmit"
	>
		<GovErrorSummary
			:error-list="errorMessages"
			test-id="lightingErrorSummary"
		/>
		<h1 class="govuk-heading-l">{{ title }}</h1>
		<FormKit
			id="numberOfLEDBulbs"
			type="govInputInt"
			label="Number of LED bulbs"
			name="numberOfLEDBulbs"
			help="Enter the number of LED bulbs in the whole dwelling"
			validation="required"
		/>
		<FormKit
			id="numberOfIncandescentBulbs"
			type="govInputInt"
			label="Number of incandescent bulbs"
			name="numberOfIncandescentBulbs"
			help="Enter the number of incandescent bulbs in the whole dwelling"
			validation="required"
		/>
		<GovLLMWarning />
		<FormKit type="govButton" label="Save and continue"  />
	</FormKit>
</template>
