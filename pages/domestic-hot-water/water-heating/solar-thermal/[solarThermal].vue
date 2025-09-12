<script setup lang="ts">
const title = "Solar thermal";
const store = useEcaasStore();
const { saveToList } = useForm();

const solarThermalData = useItemToEdit("solarThermal", store.domesticHotWater.waterHeating.solarThermal.data);
const model: Ref<SolarThermalData> = ref(solarThermalData!);

const saveForm = (fields: SolarThermalData) => {
	store.$patch((state) => {
		const { solarThermal } = state.domesticHotWater.waterHeating;

		const solarThermalItem: SolarThermalData = {
			name: fields.name,
		};
		solarThermal.complete = false;
		saveToList(solarThermalItem, solarThermal);
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
		<GovErrorSummary :error-list="errorMessages" test-id="solarThermalErrorSummary"/>
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