<script setup lang="ts">
const title = "Instant electric heater";
const store = useEcaasStore();
const { saveToList } = useForm();

const instantElectricHeaterData = useItemToEdit('heater', store.heatingSystems.heatEmitting.instantElectricHeater.data);
const model: Ref<InstantElectricHeaterData> = ref(instantElectricHeaterData!);

const saveForm = (fields: InstantElectricHeaterData) => {
	store.$patch((state) => {
		const {instantElectricHeater} = state.heatingSystems.heatEmitting;

		const instantElectricHeaterItem: instantElectricHeaterData = {
			name: fields.name
		};

		saveToList(instantElectricHeaterItem, instantElectricHeater);
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
		<GovErrorSummary :error-list="errorMessages" test-id="instantElectricHeaterErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this instant electric heater so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>