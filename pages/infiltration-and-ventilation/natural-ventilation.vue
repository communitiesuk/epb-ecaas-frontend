<script setup lang="ts">
const title = "Natural ventilation";
const store = useEcaasStore();

const model = ref({
	...store.infiltrationAndVentilation.naturalVentilation.data
});

const saveForm = (fields: VentilationData) => {
	store.$patch({
		infiltrationAndVentilation: {
			naturalVentilation: {
				data: {
					ventilationZoneHeight: fields.ventilationZoneHeight,
					dwellingEnvelopeArea: fields.dwellingEnvelopeArea,
					dwellingElevationalLevelAtBase: fields.dwellingElevationalLevelAtBase,
					crossVentilation: fields.crossVentilation,
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
			id="ventilationZoneHeight"
			type="govInputWithSuffix"
			label="Ventilation zone height"
			help="Used for ventilation calculations. Measured from the lowest finished floor level in the dwelling to the top of the ventilation zone."
			name="ventilationZoneHeight"
			validation="required | number | min:1 | max:20"
			suffix-text="m"
		/>
		<FormKit
			id="dwellingEnvelopeArea"
			type="govInputWithSuffix"
			label="Dwelling envelope area"
			help="The dwelling envelope area is the total surface area that separates the heated or cooled inside from the outside, including walls, roof, floors exposed to the ground or unheated spaces, windows, and external doors."
			name="dwellingEnvelopeArea"
			validation="required | number | min:5 | max:72000"
			suffix-text="m2"
		/>
		<FieldsElevationalHeight field="dwellingElevationalLevelAtBase" label="Elevational height of dwelling at its base" help="Elevational height of dwelling above ground datum level" :minmax="{ min: -150, max: 750 }" />
		<FormKit
			id="crossVentilation"
			type="govBoolean"
			label="Cross ventilation"
			help="This input indicates whether cross ventilation is present in the building. To determine this, check if there are openings (e.g., windows, vents, or doors) on opposite sides of the space that can allow air to flow through the building. If these openings are aligned or positioned in such a way that air can pass through, then cross ventilation is present. If not, it may be absent."
			name="crossVentilation"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>
