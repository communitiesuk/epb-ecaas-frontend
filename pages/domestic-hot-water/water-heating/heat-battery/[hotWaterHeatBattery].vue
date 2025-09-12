<script setup lang="ts">
const title = "Heat battery";
const store = useEcaasStore();
const { saveToList } = useForm();

const heatBatteryData = useItemToEdit("hotWaterHeatBattery", store.domesticHotWater.waterHeating.heatBattery.data);
const model: Ref<WaterHeatingHeatBatteryData> = ref(heatBatteryData!);

const saveForm = (fields: WaterHeatingHeatBatteryData) => {
	store.$patch((state) => {
		const { heatBattery } = state.domesticHotWater.waterHeating;

		const heatBatteryItem: WaterHeatingHeatBatteryData = {
			name: fields.name,
		};
		heatBattery.complete = false;
		saveToList(heatBatteryItem, heatBattery);
	});

	navigateTo("/domestic-hot-water/water-heating");
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
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<GovLLMWarning />
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>