<script setup lang="ts">
const title = "Immersion heater";
const store = useEcaasStore();
const { saveToList } = useForm();

const immersionHeaterData = useItemToEdit('immersionHeater', store.domesticHotWater.waterHeating.immersionHeater.data);
const model: Ref<ImmersionHeaterData> = ref(immersionHeaterData!);

const saveForm = (fields: ImmersionHeaterData) => {
	store.$patch((state) => {
		const {immersionHeater} = state.domesticHotWater.waterHeating;

		const immersionHeaterItem: ImmersionHeaterData = {
			name: fields.name
		};

		saveToList(immersionHeaterItem, immersionHeater);
	});

	navigateTo("/domestic-hot-water/water-heating");
};

const {handleInvalidSubmit, errorMessages} = useErrorSummary();
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
		<GovErrorSummary :error-list="errorMessages" test-id="immersionHeaterErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>