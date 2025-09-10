<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { getUrl  } from "#imports";
 
const title = "Electric shower";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();


const electricShowerData = useItemToEdit("shower", store.domesticHotWater.hotWaterOutlets.electricShower.data);
const model: Ref<ElectricShowerData | undefined> = ref(electricShowerData?.data);
const id = electricShowerData?.data.id ?? uuidv4();


const saveForm = (fields: ElectricShowerData) => {
	store.$patch((state) => {
		const { electricShower } = state.domesticHotWater.hotWaterOutlets;
		
		const index = getStoreIndex(electricShower.data);

		electricShower.data[index] = {
			data : {
				id,
				name: fields.name,
				ratedPower: fields.ratedPower,
			},
			complete: true
		};

		electricShower.complete = false;
	});

	navigateTo("/domestic-hot-water/hot-water-outlets");
};

autoSaveElementForm({
	model,
	storeData: store.domesticHotWater.hotWaterOutlets.electricShower,
	defaultName: "Electric shower",
	onPatchCreate: (state, newData) => {
		newData.data.id ??= id;
		state.domesticHotWater.hotWaterOutlets.electricShower.data.push(newData);},
	onPatchUpdate: (state, newData, index) => {
		newData.data.id ??= id;
		state.domesticHotWater.hotWaterOutlets.electricShower.data[index] = newData;
		state.domesticHotWater.hotWaterOutlets.electricShower.complete = false;
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
		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" :ignore="true" />
			<GovButton :href="getUrl('hotWaterOutlets')" test-id="saveProgress" secondary>Save progress</GovButton>
		</div>
	</FormKit>
</template>