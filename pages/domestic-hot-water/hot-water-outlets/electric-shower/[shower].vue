<script setup lang="ts">
const title = "Electric shower";
const store = useEcaasStore();
const route = useRoute();

const electricShowerData = useItemToEdit('shower', store.domesticHotWater.hotWaterOutlets.electricShower.data);
const model: Ref<ElectricShowerData> = ref(electricShowerData!);

const saveForm = (fields: ElectricShowerData) => {
	store.$patch((state) => {
		const {electricShower} = state.domesticHotWater.hotWaterOutlets;

		if (!electricShower.data) {
			electricShower.data = [];
		}

		const electricShowerItem: ElectricShowerData = {
			name: fields.name,
			ratedPower: fields.ratedPower,
		};

		if (route.params.shower && route.params.shower !== 'create') {
			const index = parseInt(route.params.shower as string);
			electricShower.data[index] = electricShowerItem;
		} else {
			electricShower.data.push(electricShowerItem);
		}

		electricShower.complete = true;
	});

	navigateTo("/domestic-hot-water/hot-water-outlets");
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
		<GovErrorSummary :error-list="errorMessages" test-id="electricShowerErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this shower so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="ratedPower"
			type="govInputWithSuffix"
			label="Rated power"
			name="ratedPower"
			validation="required | number | min:0 | max:30"
			suffix-text="kW"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>