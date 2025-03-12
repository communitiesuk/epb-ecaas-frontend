<script setup lang="ts">
const title = "Air permeability";
const store = useEcaasStore();

const model = ref({
	...store.infiltrationAndVentilation.airPermeability.data
});

const saveForm = (fields: AirPermeabilityData) => {
	store.$patch({
		infiltrationAndVentilation: {
			airPermeability: {
				data: {
					zoneHeight: fields.zoneHeight,
					zoneEnvelopeArea: fields.zoneEnvelopeArea,
					testPressure: fields.testPressure,
					airTightnessTestResult: fields.airTightnessTestResult
				},
				complete: true
			},
		},
	});

	navigateTo("/infiltration-and-ventilation");
};

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
		<GovErrorSummary :error-list="errorMessages" test-id="airPermeabilityErrorSummary"/>
		<FormKit
			id="zoneHeight"
			type="govInputWithSuffix"
			label="Zone height"
			help="Height of zone"
			name="zoneHeight"
			validation="required | number | min:1 | max:20"
			suffix-text="m"
		/>
		<FormKit
			id="zoneEnvelopeArea"
			type="govInputWithSuffix"
			label="Zone envelope area"
			help="External surface area of envelope"
			name="zoneEnvelopeArea"
			validation="required | number | min:5 | max:72000"
			suffix-text="m2"
		/>
		<FormKit
			id="testPressure"
			type="govInputWithSuffix"
			label="Test pressure"
			help="Reference pressure difference (From pressure test e.g blower door = 50Pa)"
			name="testPressure"
			validation="required | number | min:0 | max:500"
			suffix-text="pa"
		/>
		<FormKit
			id="airTightnessTestResult"
			type="govInputWithSuffix"
			label="Air tightness test result"
			help="The amount of air leakage (in m3/h) divided by the internal envelope area of the building (in m2), from an airtightness test at a given reference pressure difference, such as 50 Pa"
			name="airTightnessTestResult"
			validation="required | number"
			suffix-text="m3/(h.m2)"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
