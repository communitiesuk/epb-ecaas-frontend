<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { getUrl, uniqueName } from "#imports";

const title = "Mixer shower";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const mixedShowerData = useItemToEdit("shower", store.domesticHotWaterNew.hotWaterOutlets.mixedShower.data);
const model = ref(mixedShowerData?.data);
const id = mixedShowerData?.data.id || uuidv4();

const saveForm = (fields: MixedShowerData) => {
	store.$patch((state) => {
		const { mixedShower } = state.domesticHotWaterNew.hotWaterOutlets;

		const index = getStoreIndex(mixedShower.data);

		mixedShower.data[index] = {
			data: {
				id,
				name: fields.name,
				flowRate: fields.flowRate,
			},
			complete: true,
		};

		mixedShower.complete = false;
	});

	navigateTo("/domestic-hot-water/hot-water-outlets");
};

autoSaveElementForm<MixedShowerData>({
	model,
	storeData: store.domesticHotWaterNew.hotWaterOutlets.mixedShower,
	defaultName: "Mixer shower",
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		state.domesticHotWaterNew.hotWaterOutlets.mixedShower.data[index] = newData;
		state.domesticHotWaterNew.hotWaterOutlets.mixedShower.complete = false;
	} });

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
		<GovErrorSummary :error-list="errorMessages" test-id="mixedShowerErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this shower so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(store.domesticHotWaterNew.hotWaterOutlets.mixedShower.data, { id }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}"
		/>
		<FormKit
			id="flowRate"
			type="govInputWithSuffix"
			label="Flow rate"
			name="flowRate"
			validation="required | number | min:8 | max:15"
			suffix-text="litres per minute"
			data-field="HotWaterDemand.Shower.*.flowrate"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('hotWaterOutlets')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>