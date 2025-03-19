<script setup lang="ts">
const title = "Combi boiler";
const store = useEcaasStore();
const route = useRoute();

const combiBoilerData = useItemToEdit('combiBoiler', store.domesticHotWater.waterHeating.combiBoiler.data);
const model: Ref<CombiBoilerData> = ref(combiBoilerData!);

const saveForm = (fields: CombiBoilerData) => {
	store.$patch((state) => {
		const {combiBoiler} = state.domesticHotWater.waterHeating;

		if (!combiBoiler.data) {
			combiBoiler.data = [];
		}

		const combiBoilerItem: CombiBoilerData = {
			name: fields.name
		};

		if (route.params.combiBoiler && route.params.combiBoiler !== 'create') {
			const index = parseInt(route.params.combiBoiler as string);
			combiBoiler.data[index] = combiBoilerItem;
		} else {
			combiBoiler.data.push(combiBoilerItem);
		}

		combiBoiler.complete = true;
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
		<GovErrorSummary :error-list="errorMessages" test-id="combiBoilerErrorSummary"/>
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