<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { getUrl, type HeatPumpData, uniqueName } from "#imports";
import { heatPumpTypes } from "../../../../../utils/display";
const title = "Heat pump";
const route = useRoute();
const store = useEcaasStore();

const { autoSaveElementForm, getStoreIndex } = useForm();

const heatPumpStoreData = store.spaceHeating.heatGeneration.heatPump.data;
const index = getStoreIndex(heatPumpStoreData);
const heatPumpData = useItemToEdit("pump", heatPumpStoreData);
const model = ref(heatPumpData?.data);
const id =  heatPumpData?.data.id ?? uuidv4();

const isProductSelected = () => {
	return heatPumpStoreData[index]?.data.productReference ? true : false; 
};

const saveForm = (fields: HeatPumpData) => {
	store.$patch((state) => {
		const { heatPump } = state.spaceHeating.heatGeneration;

		const heatPumpItem: EcaasForm<HeatPumpData> = {
			data: {
				id,
				name: fields.name,
				productReference: fields.productReference,
				typeOfHeatPump: fields.typeOfHeatPump,
			},
			complete: true,
		};

		heatPump.data[index] = heatPumpItem;
		heatPump.complete = false;
	});

	navigateTo("/space-heating/heat-generation");
};

autoSaveElementForm<HeatPumpData>({
	model,
	storeData: store.spaceHeating.heatGeneration.heatPump,
	defaultName: "Heat pump",
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		state.spaceHeating.heatGeneration.heatPump.data[index] = newData;
		state.spaceHeating.heatGeneration.heatPump.complete = false;
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
		<GovErrorSummary :error-list="errorMessages" test-id="heatPumpErrorSummary"/>
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this heat pump so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(heatPumpStoreData, { index }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}"
		/>
		<FormKit
			id="typeOfHeatPump"
			type="govRadios"
			label="Type of heat pump"
			:options="heatPumpTypes"
			name="typeOfHeatPump"
			validation="required"
		/>
		<ClientOnly>
			<template v-if="model?.typeOfHeatPump !== undefined">
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
			</template>
		</ClientOnly>
		<GovLLMWarning />

		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('heatGeneration')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>