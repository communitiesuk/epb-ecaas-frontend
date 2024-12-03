<script setup lang="ts">
	import { useEcaasStore } from '~/stores/ecaasStore';

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
						typeOfResidence: fields.typeOfResidence,
						weatherDataLocation: fields.weatherDataLocation,
						sizeGroundFloorArea: fields.sizeGroundFloorArea,
						numOfBedrooms: fields.numOfBedrooms,
						storiesInDwelling: fields.storiesInDwelling,
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
	<FormKit type="form" v-model="model" @submit="saveForm" @submit-invalid="handleInvalidSubmit" :actions="false" :incomplete-message="false">
		<GovErrorSummary :error-list="errorMessages" test-id="generalSpecificationsErrorSummary"/>
		<FormKit
			type="govRadios"
			:options="{
				house: 'House',
				flat: 'Flat',
			}"
			label="Type of residence"
			id="typeOfResidence"
			name="typeOfResidence"
			validation="required"
		/>
		<FormKit
			type="govDropdown"
			label="Weather data location"
			id="weatherDataLocation"
			name="weatherDataLocation"
			:options="{
				london: 'London',
				manchester: 'Manchester',
				york: 'York',
			}"
			validation="required"
			help="The location nearest to your planned site"
		/>
		<FormKit
			type="govInputMeters"
			label="Size of ground floor area"
			id="sizeGroundFloorArea"
			name="sizeGroundFloorArea"
			validation="required | number"
		/>
		<FormKit
			type="govInputInt"
			label="Number of bedrooms"
			id="numOfBedrooms"
			name="numOfBedrooms"
			validation="required | number"
		/>
		<FormKit
			type="govInputInt"
			label="Number of stories in dwelling"
			id="storiesInDwelling"
			name="storiesInDwelling"
			validation="required | number"
		/>
		<FormKit
			type="govRadios"
			:options="{
				verySheltered: 'Very sheltered',
				sheltered: 'Sheltered',
				normal: 'Normal',
				exposed: 'Exposed'
			}"
			label="Shelter"
			id="levelOfShelter"
			name="levelOfShelter"
			validation="required"
		/>
		<FormKit
			type="govInputInt"
			label="Number of sheltered sides"
			id="numOfShelteredSides"
			name="numOfShelteredSides"
			validation="required | number"
		/>
		<FormKit
			type="govRadios"
			:options="{
				seperateTempControl: 'Separate temperature control',
				seperateTempAndTimeControl: 'Separate temperature and time control ',
			}"
			label="Heating control type"
			id="heatingControlType"
			name="heatingControlType"
			validation="required"
		/>
		<FormKit
			type="govRadios"
			:options="{
				electricity: 'Electricity',
				mainsGas: 'Mains gas',
			}"
			label="Cooking fuel type"
			id="cookingFuelType"
			name="cookingFuelType"
			validation="required"
		/>
		<FormKit
			type="govRadios"
				:options="{
				mainsWater: 'Mains water',
				headerTank: 'Header tank',
			}"
			label="Cold water source"
			id="coldWaterSource"
			name="coldWaterSource"
			validation="required"
		/>
		<FormKit
			type="govInputInt"
			label="Number of ADF wet rooms"
			id="numOfADFWetRooms"
			name="numOfADFWetRooms"
			validation="required | number"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>