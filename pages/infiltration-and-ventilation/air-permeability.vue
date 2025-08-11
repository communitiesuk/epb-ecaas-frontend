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
			id="testPressure"
			type="govInputWithSuffix"
			label="Test pressure"
			help="Enter the reference pressure difference from the pressure test"
			name="testPressure"
			validation="required | number | min:0 | max:500"
			suffix-text="Pa"
		>
			<GovDetails summary-text="Help with this input">
				<table class="govuk-table">
					<thead class="govuk-table__head">
						<tr class="govuk-table__row">
							<th scope="col" class="govuk-table__header govuk-!-width-one-half">Type of test</th>
							<th scope="col" class="govuk-table__header">Test pressure</th>
						</tr>
					</thead>
					<tbody class="govuk-table__body">
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header">Blower door</th>
							<td class="govuk-table__cell">50 Pa</td>
						</tr>
						<tr class="govuk-table__row">
							<th scope="row" class="govuk-table__header">Pulse</th>
							<td class="govuk-table__cell">4 Pa</td>
						</tr>
					</tbody>
				</table>
			</GovDetails>
		</FormKit>
		<FormKit
			id="airTightnessTestResult"
			type="govInputWithSuffix"
			label="Air tightness test result"
			help="Enter the amount of air leakage (in m³/h) from an airtightness test at the given reference pressure difference divided by the internal envelope area of the building (in m²)"
			name="airTightnessTestResult"
			validation="required | number"
			suffix-text="m³/(h·m²)"
		/>
		<GovLLMWarning />
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
