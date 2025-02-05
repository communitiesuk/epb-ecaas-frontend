<script setup lang="ts">
const title = "General specifications";
const store = useEcaasStore();

const model = ref({
	...store.dwellingDetails.generalSpecifications.data
});

const saveForm = (fields: typeof model.value) => {
	store.$patch({
		dwellingDetails: {
			generalSpecifications: {
				data: {
					typeOfDwelling: fields.typeOfDwelling,
					storeysInDwelling: fields.storeysInDwelling,
					storeyOfFlat: fields.storeyOfFlat,
					numOfBedrooms: fields.numOfBedrooms,
					levelOfShelter: fields.levelOfShelter,
					numOfShelteredSides: fields.numOfShelteredSides,
					heatingControlType: fields.heatingControlType,
					cookingFuelType: fields.cookingFuelType,
					coldWaterSource: fields.coldWaterSource,
					numOfADFWetRooms: fields.numOfADFWetRooms
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
			:options="{
				house: 'House',
				flat: 'Flat',
			}"
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
			validation="required | number | max:250"
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
			validation="required | number"
			help="Number of bedrooms in dwelling. Affects predicted occupancy."
		/>
		<FormKit
			id="levelOfShelter"
			type="govRadios"
			:options="{
				verySheltered: 'Very sheltered',
				sheltered: 'Sheltered',
				normal: 'Normal',
				exposed: 'Exposed'
			}"
			label="Shelter"
			name="levelOfShelter"
			validation="required"
			help="Exposure level of the dwelling"
		/>
		<FormKit
			id="numOfShelteredSides"
			type="govInputInt"
			label="Number of sheltered sides"
			name="numOfShelteredSides"
			validation="required | number"
		/>
		<FormKit
			id="heatingControlType"
			type="govRadios"
			:options="{
				seperateTempControl: {
					label: 'Separate temperature control',
					hint: 'Both living and rest of dwelling zones follow the same schedule but have different temperature set points.'
				},
				seperateTempAndTimeControl: {
					label: 'Separate temperature and time control',
					hint: 'Each zone has heating schedule and temperature set points.'
				},
			}"
			label="Heating control type"
			name="heatingControlType"
			validation="required"
			help="both living and rest of dwelling zones follow the same schedule but have different temperature set points./each zone has heating schedule and temperature set points."
		/>
		<FormKit
			id="cookingFuelType"
			type="govRadios"
			:options="{
				electricity: 'Electricity',
				mainsGas: 'Mains gas',
			}"
			label="Cooking fuel type"
			name="cookingFuelType"
			validation="required"
		/>
		<FormKit
			id="coldWaterSource"
			type="govRadios"
			:options="{
				mainsWater: 'Mains water',
				headerTank: 'Header tank',
			}"
			label="Cold water source"
			name="coldWaterSource"
			validation="required"
		/>
		<FormKit
			id="numOfADFWetRooms"
			type="govInputInt"
			label="Number of ADF wet rooms"
			name="numOfADFWetRooms"
			validation="required | number"
			help="Rooms used for domestic activities such as kitchen and bathroom that create a large amount of airborne moisture."
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
