<script setup lang="ts">
import { getUrl, type HeatingControlData } from "#imports";

const title = "Heating controls";
const store = useEcaasStore();


const heatingControlOptions = {
	separateTemperatureControl: "Separate temperature control",
	separateTimeAndTemperatureControl: "Separate time and temperature control",
};

const heatingControlData = store.spaceHeating.heatingControls.data[0];
const model = ref(heatingControlData?.data as HeatingControlData);

const saveForm = (fields: HeatingControlData) => {
	store.$patch((state) => {
		const { heatingControls } = state.spaceHeating;

		const heatingControlsItem: EcaasForm<HeatingControlData> = {
			data: {
				name: displayCamelToSentenceCase(fields.heatingControlType),
				heatingControlType: fields.heatingControlType,
			},
			complete: true,
		};
		
		heatingControls.data = [heatingControlsItem];
		heatingControls.complete = false;
	});

	navigateTo("/space-heating");
};

watch(model, async (newData, initialData) => {

	if (initialData === undefined || newData === undefined) {
		return;
	};

	store.$patch(state => {
		state.spaceHeating.heatingControls.data[0] = {
			data: {
				...newData,
				name: displayCamelToSentenceCase(newData.heatingControlType),
			},
		};

		state.spaceHeating.heatingControls.complete = false;
	});
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
		<GovErrorSummary :error-list="errorMessages" test-id="heatingControlsErrorSummary"/>
		<FormKit
			id="heatingControlType"
			type="govRadios"
			:options="heatingControlOptions"
			label="Type of heating control for dwelling"
			name="heatingControlType"
			validation="required"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('spaceHeating')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>