<script setup lang="ts">
import { isInteger } from "~/utils/validation";
import { getUrl } from "#imports";

const title = "General details";
const store = useEcaasStore();
const { autoSaveForm } = useForm();


const model = ref({
	...store.dwellingFabric.dwellingSpaceLighting.data,
});

const saveForm = (fields: typeof model.value) => {
	store.$patch({
		dwellingFabric: {
			dwellingSpaceLighting: {
				data: {
					numberOfLEDBulbs: fields.numberOfLEDBulbs,
					numberOfIncandescentBulbs: fields.numberOfIncandescentBulbs,
				},
				complete: true,
			},
		},
	});

	navigateTo("/dwelling-fabric");
};
autoSaveForm(model, (state, newData) => {
	state.dwellingFabric.dwellingSpaceLighting = newData;
});

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
			:validation-rules="{ isInteger }"
			validation="required | isInteger"
			:validation-messages="{
				isInteger: `Number of LED bulbs must be an integer.`,
			}"
		/>
		<FormKit
			id="numberOfIncandescentBulbs"
			type="govInputInt"
			label="Number of incandescent bulbs"
			name="numberOfIncandescentBulbs"
			help="Enter the number of incandescent bulbs in the whole dwelling"
			:validation-rules="{ isInteger }"
			validation="required | isInteger"
			:validation-messages="{
				isInteger: `Number of incandescent bulbs must be an integer.`,
			}"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingFabric')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
