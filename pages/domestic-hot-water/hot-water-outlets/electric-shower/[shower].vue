<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

const title = "Electric shower";
const store = useEcaasStore();
const { saveToList } = useForm();

const electricShowerData = useItemToEdit('shower', store.domesticHotWater.hotWaterOutlets.electricShower.data);
const model: Ref<ElectricShowerData> = ref(electricShowerData!);

const saveForm = (fields: ElectricShowerData) => {
	store.$patch((state) => {
		const {electricShower} = state.domesticHotWater.hotWaterOutlets;

		const electricShowerItem: ElectricShowerData = {
			id: uuidv4(),
			name: fields.name,
			ratedPower: fields.ratedPower,
		};

		saveToList(electricShowerItem, electricShower);
		electricShower.complete = false;
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
		<GovLLMWarning />
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>