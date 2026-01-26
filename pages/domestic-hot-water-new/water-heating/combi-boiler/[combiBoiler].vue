<script setup lang="ts">
const title = "Combi boiler";
const store = useEcaasStore();
const { saveToList } = useForm();

const combiBoilerData = useItemToEdit("combiBoiler", store.domesticHotWaterNew.waterHeating.combiBoiler.data);
const model: Ref<CombiBoilerData> = ref(combiBoilerData!.data);

const saveForm = (fields: CombiBoilerData) => {
	store.$patch((state) => {
		const { combiBoiler } = state.domesticHotWaterNew.waterHeating;

		const combiBoilerItem: CombiBoilerData = {
			name: fields.name,
		};

		const combiBoilerForm: EcaasForm<CombiBoilerData> = {
			complete: true,
			data: combiBoilerItem,
		};

		combiBoiler.complete = false;
		saveToList(combiBoilerForm, combiBoiler);
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
		<GovErrorSummary :error-list="errorMessages" test-id="combiBoilerErrorSummary"/>
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