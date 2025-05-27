<script setup lang="ts">
import { BuildType } from '~/schema/api-schema.types';

const title = "General specifications";
const store = useEcaasStore();

const model = ref({
	...store.dwellingDetails.generalSpecifications.data
});

const typeOfDwellingOptions: Record<BuildType, SnakeToSentenceCase<BuildType>> = {
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
					storeyOfFlat: fields.typeOfDwelling === BuildType.flat ? fields.storeyOfFlat : undefined,
					numOfBedrooms: fields.numOfBedrooms,
					partGCompliance: fields.partGCompliance,
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
		<GovErrorSummary :error-list="errorMessages" test-id="generalSpecificationsErrorSummary"/>
		<FormKit
			id="typeOfDwelling"
			type="govRadios"
			:options="typeOfDwellingOptions"
			label="Type of dwelling"
			name="typeOfDwelling"
			validation="required"
			help="The broad dwelling type classification."
		/>
		<FormKit
			id="storeysInDwelling"
			type="govInputInt"
			label="Number of storeys in building"
			name="storeysInDwelling"
			validation="required | number | min:1 | max:250"
			help="Number of storeys in the building. For houses this will be the same as the number of storeys in the dwelling, for flats, this will be the total number of storeys of the whole building that the flat is part of."
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
			help="Number of bedrooms in dwelling. Affects predicted occupancy."
		/>
		<FormKit
			id="partGCompliance"
			type="govBoolean"
			label="Part G compliance"
			name="partGCompliance"
			validation="required"
			help="Is this dwelling compliant with part G regulations? Affects predicted hot water demand"
		/>
		<FormKit
			id="coolingRequired"
			type="govBoolean"
			label="Cooling required"
			name="coolingRequired"
			validation="required"
			help="Is cooling required for this dwelling? This affects space cooling of notional building"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
