<script setup lang="ts">
const title = "Ventilation";
const store = useEcaasStore();

const model = ref({
	...store.infiltrationAndVentilation.ventilation.data
});

const saveForm = (fields: VentilationData) => {
	store.$patch({
		infiltrationAndVentilation: {
			ventilation: {
				data: {
					zoneElevationalLevelAtBase: fields.zoneElevationalLevelAtBase,
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
			id="zoneElevationalLevelAtBase"
			type="govInputWithSuffix"
			label="Zone elevational level at base"
			help="Elevational height of zone above ground datum level"
			name="zoneElevationalLevelAtBase"
			validation="required | number | min:-150 | max:750"
			suffix-text="m"
		/>
		<FormKit
			id="crossVentFactor"
			type="govRadios"
			:options="{
				yes: 'Yes',
				no: 'No'
			}"
			label="Cross vent factor"
			help="A flag to indicate if cross ventilation is possible or not"
			name="crossVentFactor"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
