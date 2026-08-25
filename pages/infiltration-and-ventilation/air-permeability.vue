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

const hasSmartAirBricks = computed(() =>
	store.dwellingFabric.dwellingSpaceFloors.dwellingSpaceGroundFloor.data.some(
		({ data }) =>
			data.typeOfGroundFloor === "Suspended_floor" &&
			"smartAirBricks" in data &&
			data.smartAirBricks === true,
	),
);

const saveForm = (fields: AirPermeabilityData) => {
	store.$patch({
		infiltrationAndVentilation: {
			airPermeability: {
				data: {
					testPressure: fields.testPressure,
					airTightnessTestResult: fields.airTightnessTestResult,
					smartAirBricksOpen: fields.smartAirBricksOpen,
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
			help="Enter the amount of air leakage from the airtightness test. This is the AP50 result from a blower door test or the AP4 result from the pulse test."
			name="airTightnessTestResult"
			validation="required | number"
			suffix-text="m³/(h·m²)"
		/>
		<FormKit
			v-if="hasSmartAirBricks"
			id="smartAirBricksOpen"
			type="govBoolean"
			label="Were the smart air bricks open during the air tightness test?"
			help="If the test hasn’t been done yet and this is for an as-designed BREL, select yes"
			name="smartAirBricksOpen"
			validation="required"
		/>
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('infiltrationAndVentilation')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
