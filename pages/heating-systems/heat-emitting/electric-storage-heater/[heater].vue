<script setup lang="ts">
const title = "Electric storage heater";
const store = useEcaasStore();
const { saveToList } = useForm();

const electricStorageHeaterData = useItemToEdit('heater', store.heatingSystems.heatEmitting.electricStorageHeater.data);
const model: Ref<ElectricStorageHeaterData> = ref(electricStorageHeaterData!);

const saveForm = (fields: ElectricStorageHeaterData) => {
	store.$patch((state) => {
		const {electricStorageHeater} = state.heatingSystems.heatEmitting;

		const item: ElectricStorageHeaterData = {
			name: fields.name
		};

		saveToList(item, electricStorageHeater);
		electricStorageHeater.complete = false;

	});
	navigateTo("/heating-systems/heat-emitting");
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
		<GovErrorSummary :error-list="errorMessages" test-id="electricStorageHeaterErrorSummary"/>
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