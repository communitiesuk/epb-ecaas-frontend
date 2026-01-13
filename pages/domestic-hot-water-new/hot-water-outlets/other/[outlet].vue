<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { getUrl, type OtherHotWaterOutletData, uniqueName } from "#imports";
const { autoSaveElementForm, getStoreIndex } = useForm();

const title = "Other outlets";
const store = useEcaasStore();

const otherOutletsData = useItemToEdit("outlet", store.domesticHotWater.hotWaterOutlets.otherOutlets.data);
const model = ref(otherOutletsData?.data);
const id = otherOutletsData?.data.id || uuidv4();

const saveForm = (fields: OtherHotWaterOutletData) => {
	store.$patch((state) => {
		const { otherOutlets } = state.domesticHotWater.hotWaterOutlets;

		const index = getStoreIndex(otherOutlets.data);

		otherOutlets.data[index] = {
			data: {
				id,
				name: fields.name,
				flowRate: fields.flowRate,
			},
			complete: true,
		};
		otherOutlets.complete = false;
	});

	navigateTo("/domestic-hot-water/hot-water-outlets");
};

autoSaveElementForm<OtherHotWaterOutletData>({
	model,
	storeData: store.domesticHotWater.hotWaterOutlets.otherOutlets,
	defaultName: "Other outlet",
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		state.domesticHotWater.hotWaterOutlets.otherOutlets.data[index] = newData;
		state.domesticHotWater.hotWaterOutlets.otherOutlets.complete = false;
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
		<GovErrorSummary :error-list="errorMessages" test-id="otherOutletsErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this outlet so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(store.domesticHotWater.hotWaterOutlets.otherOutlets.data, { id }) }"
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
			validation="required | number | min:0 | max:15"
			suffix-text="litres per minute"
			data-field="HotWaterDemand.Other.*.flowrate"
		/>
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('hotWaterOutlets')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>