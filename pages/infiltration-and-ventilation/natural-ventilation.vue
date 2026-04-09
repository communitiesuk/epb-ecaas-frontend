<script setup lang="ts">
import { getUrl } from "#imports";

const title = "Natural ventilation";
const store = useEcaasStore();
const { autoSaveForm } = useForm();

const model = ref({
	...store.infiltrationAndVentilation.naturalVentilation.data,
});

const saveForm = (fields: VentilationData) => {
	store.$patch({
		infiltrationAndVentilation: {
			naturalVentilation: {
				data: {
					ventilationZoneHeight: fields.ventilationZoneHeight,
					dwellingEnvelopeArea: fields.dwellingEnvelopeArea,
					baseHeightOfVentilationZone: fields.baseHeightOfVentilationZone,
					maxRequiredAirChangeRate: 2,
				},
				complete: true,
			},
		},
	});

	navigateTo("/infiltration-and-ventilation");
};

autoSaveForm(model, (state, newData) => {
	state.infiltrationAndVentilation.naturalVentilation = newData;
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
		<GovErrorSummary :error-list="errorMessages" test-id="ventilationErrorSummary"/>
		<FormKit
			id="ventilationZoneHeight"
			type="govInputWithSuffix"
			label="Ventilation zone height"
			help="This is measured from the lowest finished floor level in the dwelling to the top of the thermal envelope or highest ceiling in the dwelling"
			name="ventilationZoneHeight"
			validation="required | number | min:1 | max:20"
			suffix-text="m"
			data-field="InfiltrationVentilation.Leaks.ventilation_zone_height"
		/>
		<FormKit
			id="dwellingEnvelopeArea"
			type="govInputWithSuffix"
			label="Dwelling envelope area"
			help="This is the total internal surface area of all elements that separate the dwelling's heated interior from the external environment or other dwellings and unheated spaces"
			name="dwellingEnvelopeArea"
			validation="required | number | min:5 | max:72000"
			suffix-text="m²"
			data-field="InfiltrationVentilation.Leaks.env_area"
		/>
		
		<FieldsElevationalHeight
			field="baseHeightOfVentilationZone"
			label="Base height of ventilation zone"
			help="Enter the height at which the dwelling sits off or below ground. This should be measured from the ground datum level to the lowest finished floor of the dwelling."
			:minmax="{ min: -150, max: 750 }"
			data-field="InfiltrationVentilation.ventilation_zone_base_height"
		/>
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('infiltrationAndVentilation')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
