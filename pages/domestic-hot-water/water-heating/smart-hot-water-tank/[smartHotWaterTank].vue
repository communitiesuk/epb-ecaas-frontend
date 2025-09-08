<script setup lang="ts">
const title = "Smart hot water tank";
const store = useEcaasStore();
const { saveToList } = useForm();

const smartHotWaterTankData = useItemToEdit("smartHotWaterTank", store.domesticHotWater.waterHeating.smartHotWaterTank.data);
const model: Ref<SmartHotWaterTankData> = ref(smartHotWaterTankData!);

const saveForm = (fields: SmartHotWaterTankData) => {
	store.$patch((state) => {
		const { smartHotWaterTank } = state.domesticHotWater.waterHeating;

		const smartHotWaterTankItem: SmartHotWaterTankData = {
			name: fields.name
		};
		smartHotWaterTank.complete = false;
		saveToList(smartHotWaterTankItem, smartHotWaterTank);
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
		<GovErrorSummary :error-list="errorMessages" test-id="smartHotWaterTankErrorSummary"/>
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