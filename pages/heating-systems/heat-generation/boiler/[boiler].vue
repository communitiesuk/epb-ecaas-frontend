<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

const title = "Boiler";
const store = useEcaasStore();
const { saveToList } = useForm();

const boilerData = useItemToEdit('boiler', store.heatingSystems.heatGeneration.boiler.data);
const model: Ref<BoilerData> = ref(boilerData!);

const saveForm = (fields: BoilerData) => {
	store.$patch((state) => {
		const {boiler} = state.heatingSystems.heatGeneration;

		const boilerItem: BoilerData = {
			id: uuidv4(),
			name: fields.name
		};

		saveToList(boilerItem, boiler);
		boiler.complete = false;
	});

	navigateTo("/heating-systems/heat-generation");
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
		<GovErrorSummary :error-list="errorMessages" test-id="boilerErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this boiler so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>