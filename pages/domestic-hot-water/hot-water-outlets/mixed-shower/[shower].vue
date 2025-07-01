<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';

const title = "Mixed shower";
const store = useEcaasStore();
const { saveToList } = useForm();

const mixedShowerData = useItemToEdit('shower', store.domesticHotWater.hotWaterOutlets.mixedShower.data);
const model: Ref<MixedShowerData> = ref(mixedShowerData!);

const saveForm = (fields: MixedShowerData) => {
	store.$patch((state) => {
		const {mixedShower} = state.domesticHotWater.hotWaterOutlets;

		const mixedShowerItem: MixedShowerData = {
			id: uuidv4(),
			name: fields.name,
			flowRate: fields.flowRate,
		};

		saveToList(mixedShowerItem, mixedShower);
		mixedShower.complete = false;
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
		<GovErrorSummary :error-list="errorMessages" test-id="mixedShowerErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this shower so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="flowRate"
			type="govInputWithSuffix"
			label="Flow rate"
			name="flowRate"
			validation="required | number | min:0 | max:15"
			suffix-text="litres per minute"
		/>
		<FormKit type="govButton" label="Save and continue" />
	</FormKit>
</template>