<script setup lang="ts">
import { getUrl } from "#imports";
import type { SchemaLeaksTestPressure } from "~/schema/aliases";

const title = "Air permeability";
const store = useEcaasStore();
const { autoSaveForm } = useForm();

const model = ref({
	...store.infiltrationAndVentilation.airPermeability.data,
});

const testPressureOptions = {
	"Standard": "Blower door (test pressure is 50Pa)",
	"Pulse test only": "Pulse test (test pressure is 4Pa)",
} as const satisfies Record<SchemaLeaksTestPressure, string>;

const saveForm = (fields: AirPermeabilityData) => {
	store.$patch({
		infiltrationAndVentilation: {
			airPermeability: {
				data: {
					testPressure: fields.testPressure,
					airTightnessTestResult: fields.airTightnessTestResult,
				},
				complete: true,
			},
		},
	});

	navigateTo("/infiltration-and-ventilation");
};

autoSaveForm(model, (state, newData) => {
	state.infiltrationAndVentilation.airPermeability = newData;
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
		<GovErrorSummary :error-list="errorMessages" test-id="airPermeabilityErrorSummary"/>
		<FormKit
			id="testPressure"
			type="govRadios"
			:options="testPressureOptions"
			label="Type of infiltration pressure test"
			help="Select the type of infiltration pressure test conducted"
			name="testPressure"
			validation="required"
		/>
		<FormKit
			id="airTightnessTestResult"
			type="govInputWithSuffix"
			label="Air tightness test result"
			help="Enter the amount of air leakage from an airtightness test divided by the internal envelope area of the building"
			name="airTightnessTestResult"
			validation="required | number"
			suffix-text="m³/(h·m²)"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('infiltrationAndVentilation')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
