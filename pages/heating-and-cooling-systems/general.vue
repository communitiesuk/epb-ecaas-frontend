<script setup lang="ts">
import { getUrl } from "#imports";

const title = "General";
const store = useEcaasStore();
const { autoSaveForm } = useForm();

const model = ref({
	...store.heatingAndCoolingSystems.general.data,
});

const heatingControlOptions = {
	separateTemperatureControl: "Separate temperature control",
	separateTimeAndTemperatureControl: "Separate time and temperature control",
};

const saveForm = (fields: GeneralHeatingAndCoolingSystems) => {
	store.$patch({
		heatingAndCoolingSystems: {
			general: {
				data: {
					heatingControlType: fields.heatingControlType,
					coolingRequired: fields.coolingRequired,
				},
				complete: true,
			},
		},
	});

	navigateTo("/heating-and-cooling-systems");
};

autoSaveForm(model, (state, newData) => {
	state.heatingAndCoolingSystems.general = newData;
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
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="generalErrorSummary"/>
		<FormKit
			id="heatingControlType"
			type="govRadios"
			:options="heatingControlOptions"
			label="Type of heating control for dwelling"
			name="heatingControlType"
			validation="required"
		/>
		<FormKit
			id="coolingRequired"
			type="govBoolean"
			label="Is cooling required for this dwelling?"
			name="coolingRequired"
			validation="required"
			help="This is in accordance with Part O compliance. It will affect the space cooling of the notional dwelling."
			data-field="General.PartO_active_cooling_required"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('heatingAndCoolingSystems')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>