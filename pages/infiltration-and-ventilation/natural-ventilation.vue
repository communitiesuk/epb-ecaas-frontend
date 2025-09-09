<script setup lang="ts">
import { getUrl } from "#imports";

const title = "Natural ventilation";
const store = useEcaasStore();
const { autoSaveForm } = useForm();

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
					crossVentilationPossible: fields.crossVentilationPossible,
					maxRequiredAirChangeRate: 2
				},
				complete: true
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
			help="This is measured from the lowest finished floor level in the dwelling to the highest of part of the dwelling that is ventilated"
			name="ventilationZoneHeight"
			validation="required | number | min:1 | max:20"
			suffix-text="m"
		/>
		<FormKit
			id="dwellingEnvelopeArea"
			type="govInputWithSuffix"
			label="Dwelling envelope area"
			help="This is the total surface area that separates the heated or cooled inside from the outside"
			name="dwellingEnvelopeArea"
			validation="required | number | min:5 | max:72000"
			suffix-text="m²"
		><GovDetails summary-text="Help with this input">	
			<p class="govuk-hint">
				It includes walls, roofs, floors exposed to the ground or unheated spaces, windows and external doors.
			</p>
		</GovDetails>
		</FormKit>
		<FieldsElevationalHeight
			field="dwellingElevationalLevelAtBase"
			label="Elevational height of dwelling at its base"
			help="Enter elevational height of the dwelling above ground datum level"
			:minmax="{ min: -150, max: 750 }"
		/>
		<FormKit
			id="crossVentilationPossible"
			type="govBoolean"
			label="Is cross ventilation possible?"
			name="crossVentilationPossible"
			validation="required"
		>
			<GovDetails summary-text="Help with this input" possibly-llm-placeholder>	
				<p class="govuk-hint">
					This input indicates whether cross ventilation is present in the building. To determine this, check if there are openings (for example, windows, vents, or doors) on opposite sides of the space that can allow air to flow through the building. If these openings are aligned or positioned in such a way that air can pass through, then cross ventilation is present. If not, it may be absent.
				</p>
			</GovDetails>
		</FormKit>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('infiltrationAndVentilation')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>
