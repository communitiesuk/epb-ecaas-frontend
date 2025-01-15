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
	<FormKit v-model="model" type="form" :actions="false" :incomplete-message="false" @submit="saveForm" @submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="generalSpecificationsErrorSummary"/>
		<FormKit
			id="typeOfResidence"
			type="govRadios"
			:options="{
				house: 'House',
				flat: 'Flat',
			}"
			label="Type of residence"
			name="typeOfResidence"
			validation="required"
		/>
		<FormKit
			id="weatherDataLocation"
			type="govDropdown"
			label="Weather data location"
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
			id="sizeGroundFloorArea"
			type="govInputWithSuffix"
			label="Size of ground floor area"
			name="sizeGroundFloorArea"
			validation="required | number"
			suffixText="m2"
		/>
		<FormKit
			id="numOfBedrooms"
			type="govInputInt"
			label="Number of bedrooms"
			name="numOfBedrooms"
			validation="required | number"
		/>
		<FormKit
			id="storiesInDwelling"
			type="govInputInt"
			label="Number of stories in dwelling"
			name="storiesInDwelling"
			validation="required | number"
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
