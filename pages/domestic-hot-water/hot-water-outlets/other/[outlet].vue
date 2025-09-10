<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { getUrl  } from "#imports";

const title = "Other outlets";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const otherOutletsData = useItemToEdit("outlet", store.domesticHotWater.hotWaterOutlets.otherOutlets.data);
const model: Ref<OtherHotWaterOutletData | undefined> = ref(otherOutletsData?.data);
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
			complete: true
		};
		otherOutlets.complete = false;
	});

	navigateTo("/domestic-hot-water/hot-water-outlets");
};

autoSaveElementForm({
	model,
	storeData: store.domesticHotWater.hotWaterOutlets.otherOutlets,
	defaultName: "Other outlet",
	onPatchCreate: (state, newData) => {
		newData.data.id ??= id;
		state.domesticHotWater.hotWaterOutlets.otherOutlets.data.push(newData);},
	onPatchUpdate: (state, newData, index) => {
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
		<GovLLMWarning />
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('hotWaterOutlets')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>