<script setup lang="ts">
import { isInteger } from "~/utils/validation";
import { getUrl, uniqueName } from "#imports";

const title = "Bulb";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const bulbsStoreData = store.dwellingFabric.dwellingSpaceLighting.data;
const index = getStoreIndex(bulbsStoreData);
const bulbData = useItemToEdit("bulb", bulbsStoreData);
const model = ref(bulbData?.data);

const saveForm = (fields: DwellingSpaceLightingData) => {
	store.$patch((state) => {
		const { dwellingSpaceLighting } = state.dwellingFabric;

		dwellingSpaceLighting.data[index] = {
			data: {
				name: fields.name,
				numberOfBulbs: fields.numberOfBulbs,
				power: fields.power,
				efficacy: fields.efficacy,
			},
			complete: true,
		};

		dwellingSpaceLighting.complete = false;
	});

	navigateTo("/dwelling-fabric/lighting");
};

autoSaveElementForm<DwellingSpaceLightingData>({
	model,
	storeData: store.dwellingFabric.dwellingSpaceLighting,
	defaultName: "Bulb",
	onPatch: (state, newData, index) => {
		state.dwellingFabric.dwellingSpaceLighting.data[index] = newData;
		state.dwellingFabric.dwellingSpaceLighting.complete = false;
	},
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
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
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name so this bulb type can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(bulbsStoreData, { index }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}"
		/>
		<FormKit
			id="numberOfBulbs"
			type="govInputInt"
			label="Number of bulbs"
			name="numberOfBulbs"
			help="Enter the number of bulbs in the whole dwelling with this specification"
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
			help="Enter the power of the bulb"
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
			help="Enter the efficacy of the bulb"
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
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('dwellingSpaceLighting')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
