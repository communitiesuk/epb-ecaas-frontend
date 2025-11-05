<script setup lang="ts">
import { isInteger } from "~/utils/validation";
import { getUrl } from "#imports";

const title = "Lighting";
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
					numberOfBulbs: fields.numberOfBulbs,
					power: fields.power,
					efficacy: fields.efficacy
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
			id="numberOfBulbs"
			type="govInputInt"
			label="Number of bulbs in the dwelling"
			name="numberOfBulbs"
			help="Enter the number of bulbs in the whole dwelling"
			:validation-rules="{ isInteger }"
			validation="required | isInteger"
			:validation-messages="{
				isInteger: `Number of bulbs must be an integer.`,
			}"
			data-field="Zone.Lighting.bulbs.count"
		/>
		<FormKit
			id="power"
			type="govInputWithSuffix"
			label="Power"
			name="power"
			help="Enter the power of the bulbs"
			suffix-text="W"
			:validation-rules="{ isInteger }"
			validation="required | isInteger"
			:validation-messages="{
				isInteger: `Power must be an integer.`,
			}"
			data-field="Zone.Lighting.bulbs.power"
		/>
		<FormKit
			id="efficacy"
			type="govInputWithSuffix"
			label="Efficacy"
			name="efficacy"
			help="Enter the efficacy of the bulbs"
			suffix-text="lm/W"
			:validation-rules="{ isInteger }"
			validation="required | isInteger"
			:validation-messages="{
				isInteger: `Efficacy must be an integer.`,
			}"
			data-field="Zone.Lighting.bulbs.efficacy"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('dwellingFabric')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
