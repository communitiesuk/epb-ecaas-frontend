<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { getUrl, type HeatSourceData, uniqueName } from "#imports";
import { heatSourceTypes } from "../../../utils/display";

const title = "Heat source";
const store = useEcaasStore();
const { autoSaveElementForm, getStoreIndex } = useForm();

const heatSourceStoreData = store.spaceHeatingNew.heatSource.data;
const index = getStoreIndex(heatSourceStoreData);
const heatSourceData = useItemToEdit("heatSource", heatSourceStoreData);
const model = ref(heatSourceData?.data);
const id =  heatSourceData?.data.id ?? uuidv4();

const saveForm = (fields: HeatSourceData) => {
	store.$patch((state) => {
		const { heatSource } = state.spaceHeatingNew;

		console.log(id);
		const heatSourceItem: EcaasForm<HeatSourceData> = {
			data: {
				id,
				name: fields.name,
				typeOfHeatSource: fields.typeOfHeatSource,
			},
			complete: true,
		};

		heatSource.data[index] = heatSourceItem;
		heatSource.complete = false;
	});
	
	navigateTo("/space-heating-new");
};

autoSaveElementForm<HeatSourceData>({
	model,
	storeData: store.spaceHeatingNew.heatSource,
	defaultName: "Heat source",
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		state.spaceHeatingNew.heatSource.data[index] = newData;
		state.spaceHeatingNew.heatSource.complete = false;
	},
});

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
		<GovErrorSummary :error-list="errorMessages" test-id="heatSourceErrorSummary"/>
		<FormKit
			id="typeOfHeatSource"
			type="govRadios"
			label="Type of heat source"
			:options="heatSourceTypes"
			name="typeOfHeatSource"
			validation="required"
		/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this heat source so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(heatSourceStoreData, { index }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}"
		/>
		
		<!-- <template v-if="model?.typeOfHeatPump !== undefined">
			<FormKit
				id="selectHeatPump"
				:key="model.typeOfHeatPump"
				type="govPcdbProduct"
				label="Select a heat pump"
				name="productReference"
				:validation-rules="{ isProductSelected }"
				validation="required | isProductSelected"
				help="Select the air source heat pump type from the PCDB using the button below."
				:selected-product-reference="heatPumpStoreData[index]?.data.productReference"
				:selected-product-type="heatPumpTypes[model.typeOfHeatPump]"
				:page-url="route.fullPath"
				:page-index="index"
			/>
		</template> -->
		<GovLLMWarning />

		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('spaceHeatingNew')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>