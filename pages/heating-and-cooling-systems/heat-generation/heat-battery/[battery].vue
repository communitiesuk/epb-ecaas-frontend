<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";

const title = "Heat battery";
const store = useEcaasStore();
const { saveToList } = useForm();

const heatBatteryData = useItemToEdit("battery", store.heatingSystems.heatGeneration.heatBattery.data);
const model: Ref<HeatBatteryData> = ref(heatBatteryData!);

const saveForm = (fields: HeatBatteryData) => {
	store.$patch((state) => {
		const { heatBattery } = state.heatingSystems.heatGeneration;

		const heatBatteryItem: HeatBatteryData = {
			id: uuidv4(),
			name: fields.name,
		};

		saveToList(heatBatteryItem, heatBattery);
		heatBattery.complete = false;
	});

	navigateTo("/heating-and-cooling-systems/heat-generation");
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
		@submit-invalid="handleInvalidSubmit">
		<GovErrorSummary :error-list="errorMessages" test-id="heatBatteryErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this heat battery so that it can be identified later"
			name="name"
			validation="required"
		/>
		<GovLLMWarning />
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>