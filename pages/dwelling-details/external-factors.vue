<script setup lang="ts">
const title = "External factors";
const store = useEcaasStore();

const model = ref({
	...store.dwellingDetails.externalFactors.data
});

const saveForm = (fields: typeof model.value) => {
	store.$patch({
		dwellingDetails: {
			externalFactors: {
				data: {
					altitude: fields.altitude,
					typeOfExposure: fields.typeOfExposure,
					terrainType: fields.terrainType,
					noiseNuisance: fields.noiseNuisance
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
		<GovErrorSummary :error-list="errorMessages" test-id="externalFactorsErrorSummary"/>
		<FormKit
			id="altitude"
			type="govInputWithSuffix"
			label="Altitude"
			name="altitude"
			suffix-text="m"
			validation="required | number | min:-150 | max:7200"
			help="Metres the dwelling is above sea level."
		/>
		<FormKit
			id="typeOfExposure"
			type="govRadios"
			:options="{
				Open: 'Open',
				Normal: 'Normal',
				Shielded: 'Shielded'
			}"
			label="Type of exposure"
			name="typeOfExposure"
			validation="required"
			help="The level of shielding or protection a building or a specific system has against external environmental factors such as wind, noise, or outdoor pollutants."
		/>
		<FormKit
			id="terrainType"
			type="govRadios"
			:options="{
				OpenWater: 'Open water',
				OpenField: 'Open field',
				Suburban: 'Suburban',
				Urban: 'Urban'
			}"
			label="Terrain Type"
			name="terrainType"
			validation="required"
			help="The type of surrounding landscape or environment. Terrain class helps determine how external conditions, such as wind speed and turbulence, will impact ventilation and airflow around a building."
		/>
		<FormKit
			id="noiseNuisance"
			type="govBoolean"
			label="Noise nuisance"
			name="noiseNuisance"
			validation="required"
			help="Is there environmental noise from the surrounding area, which can influence whether occupants keep windows closed?"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
