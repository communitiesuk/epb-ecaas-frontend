<script setup lang="ts">
const title = "Heat interface unit";
const store = useEcaasStore();
const { saveToList } = useForm();

const heatInterfaceUnitData = useItemToEdit('hotWaterHeatInterfaceUnit', store.domesticHotWater.waterHeating.heatInterfaceUnit.data);
const model: Ref<WaterHeatingHeatInterfaceUnitData> = ref(heatInterfaceUnitData!);

const saveForm = (fields: WaterHeatingHeatInterfaceUnitData) => {
	store.$patch((state) => {
		const { heatInterfaceUnit } = state.domesticHotWater.waterHeating;

		const heatInterfaceUnitItem: WaterHeatingHeatInterfaceUnitData = {
			name: fields.name
		};
		heatInterfaceUnit.complete = false;
		saveToList(heatInterfaceUnitItem, heatInterfaceUnit);
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
		<GovErrorSummary :error-list="errorMessages" test-id="heatInterfaceUnitErrorSummary"/>
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