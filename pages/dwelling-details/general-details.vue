<script setup lang="ts">
import { BuildType } from '~/schema/api-schema.types';

const title = "General details";
const store = useEcaasStore();

const model = ref({
	...store.dwellingDetails.generalDetails.data
});

const typeOfDwellingOptions: Record<BuildType, SnakeToSentenceCase<BuildType>> = {
	house: "House",
	flat: "Flat",
};

const saveForm = (fields: typeof model.value) => {
	store.$patch({
		dwellingDetails: {
			generalDetails: {
				data: {
					typeOfDwelling: fields.typeOfDwelling,
					storeysInDwelling: fields.storeysInDwelling,
					storeyOfFlat: fields.typeOfDwelling === BuildType.flat ? fields.storeyOfFlat : undefined,
					numOfBedrooms: fields.numOfBedrooms,
					coolingRequired: fields.coolingRequired,
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
			validation="required | number | min:1 | max:250"
			help="For houses this is the same as the number of storeys in the dwelling. For flats this is the total number of stories of the whole building the flat is in"
		/>
		<FormKit
			v-if="model.typeOfDwelling === 'flat'"
			id="storeyOfFlat"
			type="govInputInt"
			label="Storey of flat"
			name="storeyOfFlat"
			validation="required | number | min:-50 | max:199"
			help="The vertical position of the flat expressed by the storey it is on. 0 represents the ground floor."
		/>
		<FormKit
			id="numOfBedrooms"
			type="govInputInt"
			label="Number of bedrooms"
			name="numOfBedrooms"
			validation="required | number | min:1"
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
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
