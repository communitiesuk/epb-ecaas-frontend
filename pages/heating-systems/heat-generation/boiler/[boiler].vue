<script setup lang="ts">
const title = "Boiler";
const store = useEcaasStore();
const route = useRoute();

const boilerData = useItemToEdit('boiler', store.heatingSystems.heatGeneration.boiler.data);
const model: Ref<BoilerData> = ref(boilerData!);

const saveForm = (fields: BoilerData) => {
	store.$patch((state) => {
		const {boiler} = state.heatingSystems.heatGeneration;

		if (!boiler.data) {
			boiler.data = [];
		}

		const boilerItem: BoilerData = {
			name: fields.name
		};

		if (route.params.boiler && route.params.boiler !== 'create') {
			const index = parseInt(route.params.boiler as string);
			boiler.data[index] = boilerItem;
		} else {
			boiler.data.push(boilerItem);
		}

		boiler.complete = true;
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