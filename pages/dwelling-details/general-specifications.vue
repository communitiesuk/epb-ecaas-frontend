<script setup lang="ts">
	import { useEcaasStore } from "~/stores/ecaasStore";
	import Breadcrumbs from '../../components/GovBreadcrumbs.vue';

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
						coldWaterSource: fields.coldWaterSource
					},
					complete: true,
				},
			},
		});

		navigateTo("/dwelling-details");
	};
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<Breadcrumbs :currentPageId="'generalSpecifications'" />
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<FormKit type="form" v-model="model" @submit="saveForm" :actions="false" :incomplete-message="false">
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
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>