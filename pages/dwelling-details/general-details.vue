<script setup lang="ts">
import type { SchemaBuildType } from "~/schema/api-schema.types";
import { isInteger } from "~/utils/validation";
import { getUrl } from "#imports";

const title = "General details";
const store = useEcaasStore();
const { autoSaveForm } = useForm();

const model = ref({
	...store.dwellingDetails.generalSpecifications.data
});

const typeOfDwellingOptions: Record<SchemaBuildType, SnakeToSentenceCase<SchemaBuildType>> = {
	house: "House",
	flat: "Flat",
};

const saveForm = (fields: typeof model.value) => {
	store.$patch({
		dwellingDetails: {
			generalSpecifications: {
				data: {
					typeOfDwelling: fields.typeOfDwelling,
					storeysInDwelling: fields.storeysInDwelling,
					storeyOfFlat: fields.typeOfDwelling === "flat" ? fields.storeyOfFlat : undefined,
					numOfBedrooms: fields.numOfBedrooms,
					coolingRequired: fields.coolingRequired,
				},
				complete: true,
			},
		},
	});

	navigateTo("/dwelling-details");
};

autoSaveForm(model, (state, newData) => {
	state.dwellingDetails.generalSpecifications = newData;
});

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<FormKit v-model="model" type="form" :actions="false" :incomplete-message="false" @submit="saveForm" @submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="generalDetailsErrorSummary"/>
		<FormKit
			id="typeOfDwelling"
			type="govRadios"
			:options="typeOfDwellingOptions"
			label="Type of dwelling"
			name="typeOfDwelling"
			validation="required"
			help="Select the broad dwelling classification"
		/>
		<FormKit
			id="storeysInDwelling"
			type="govInputInt"
			label="Number of storeys in building"
			name="storeysInDwelling"
			:validation-rules="{ isInteger }"
			validation="required | isInteger | min:1 | max:250"
			:validation-messages="{
				isInteger: `Number of storeys in building must be an integer.`,
			}"
			help="For houses this is the same as the number of storeys in the dwelling. For flats this is the total number of stories of the whole building the flat is in"
		/>
		<FormKit
			v-if="model.typeOfDwelling === 'flat'"
			id="storeyOfFlat"
			type="govInputInt"
			label="Storey of flat"
			name="storeyOfFlat"
			:validation-rules="{ isInteger }"
			validation="required | isInteger | min:-50 | max:199"
			:validation-messages="{
				isInteger: `Storey of flat must be an integer.`,
			}"
			help="The vertical position of the flat expressed by the storey it is on. 0 represents the ground floor."
		/>
		<FormKit
			id="numOfBedrooms"
			type="govInputInt"
			label="Number of bedrooms"
			name="numOfBedrooms"
			:validation-rules="{ isInteger }"
			validation="required | isInteger | min:1"
			:validation-messages="{
				isInteger: `Number of bedrooms must be an integer.`,
			}"
			help="This affects the dwelling's predicted occupancy"
		/>
		<FormKit
			id="coolingRequired"
			type="govBoolean"
			label="Is cooling required for this dwelling?"
			name="coolingRequired"
			validation="required"
			help="This affects the space cooling of the notional dwelling"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('dwellingDetails')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
