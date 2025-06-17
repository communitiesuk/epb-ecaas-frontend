<script setup lang="ts">
const title = "Natural ventilation";
const store = useEcaasStore();

const model = ref({
	...store.infiltrationAndVentilation.ventilation.data
});

const saveForm = (fields: VentilationData) => {
	store.$patch({
		infiltrationAndVentilation: {
			ventilation: {
				data: {
					dwellingHeight: fields.dwellingHeight,
					dwellingEnvelopeArea: fields.dwellingEnvelopeArea,
					dwellingElevationalLevelAtBase: fields.dwellingElevationalLevelAtBase,
					crossVentFactor: fields.crossVentFactor,
					maxRequiredAirChangeRate: 2
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
		<GovErrorSummary :error-list="errorMessages" test-id="ventilationErrorSummary"/>
		<FormKit
			id="dwellingHeight"
			type="govInputWithSuffix"
			label="Dwelling height"
			help="Height of the whole dwelling"
			name="dwellingHeight"
			validation="required | number | min:1 | max:20"
			suffix-text="m"
		/>
		<FormKit
			id="dwellingEnvelopeArea"
			type="govInputWithSuffix"
			label="Dwelling envelope area"
			help="Total envelope area for the whole dwelling"
			name="dwellingEnvelopeArea"
			validation="required | number | min:5 | max:72000"
			suffix-text="m2"
		/>
		<FieldsElevationalHeight field="dwellingElevationalLevelAtBase" label="Elevational height of dwelling at its base" help="Elevational height of dwelling above ground datum level" :minmax="{ min: -150, max: 750 }" />
		<FormKit
			id="crossVentFactor"
			type="govBoolean"
			label="Cross vent factor"
			help="A flag to indicate if cross ventilation is possible or not"
			name="crossVentFactor"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
