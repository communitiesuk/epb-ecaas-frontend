<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import { getUrl  } from '#imports';
const { autoSaveElementForm, getStoreIndex } = useForm();

const title = "Bath";
const store = useEcaasStore();

const bathData = useItemToEdit('bath', store.domesticHotWater.hotWaterOutlets.bath.data);
const model: Ref<BathData | undefined> = ref(bathData?.data);

const saveForm = (fields: BathData) => {

	store.$patch((state) => {
		const {bath} = state.domesticHotWater.hotWaterOutlets;
	
		const index = getStoreIndex(bath.data);
		bath.data[index] = {
			data: {
				id: bathData?.data.id || uuidv4(),
				name: fields.name,
				size: fields.size,
				flowRate: fields.flowRate
			},
			complete: true
		};

		bath.complete = false;
	});

	navigateTo("/domestic-hot-water/hot-water-outlets");
};

autoSaveElementForm({
	model,
	storeData: store.domesticHotWater.hotWaterOutlets.bath,
	defaultName: 'Bath',
	onPatchCreate: (state, newData) => state.domesticHotWater.hotWaterOutlets.bath.data.push(newData),
	onPatchUpdate: (state, newData, index) => {
		state.domesticHotWater.hotWaterOutlets.bath.data[index] = newData;
		state.domesticHotWater.hotWaterOutlets.bath.complete = false;
	}});


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
		<GovErrorSummary :error-list="errorMessages" test-id="bathErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this bath so that it can be identified later"
			name="name"
			validation="required"
		/>
		<FormKit
			id="size"
			type="govInputWithSuffix"
			label="Size"
			name="size"
			validation="required | number | min:0 | max:500"
			suffix-text="litres"
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
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('hotWaterOutlets')" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>