<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import { getUrl, type HeatPumpData, uniqueName } from "#imports";

const title = "Heat pump";
const store = useEcaasStore();

const { autoSaveElementForm, getStoreIndex } = useForm();

const heatPumpStoreData = store.heatingAndCoolingSystems.heatGeneration.heatPump.data;
const index = getStoreIndex(heatPumpStoreData);
const heatPumpData = useItemToEdit("pump", heatPumpStoreData);
const model = ref(heatPumpData?.data);

const { data: heatPumps } = await useFetch("/api/products", { query: { category: "heatPump" } });

// sort into Small, Medium, Large (to retain while we are using test fake heat pumps and don't have better means to sort them by)
heatPumps.value?.sort((a, b) => -a.reference.localeCompare(b.reference));

const id =  heatPumpData?.data.id ?? uuidv4();

type HeatPumpTypeDisplay = "Air source" |"Ground source"| "Water source" | "Booster" | "Hot water only" | "Exhaust air MEV" | "Exhaust air MVHR" | "Exhaust air Mixed";

const heatPumpType = {
	"airSource": "Air source",
	"groundSource": "Ground source",
	"waterSource": "Water source",
	"booster": "Booster",
	"hotWaterOnly": "Hot water only",
	"exhaustAirMev": "Exhaust air MEV",
	"exhaustAirMvhr": "Exhaust air MVHR",
	"exhaustAirMixed": "Exhaust air Mixed",
} as const satisfies Record<HeatPumpType, HeatPumpTypeDisplay>;

const isProductSelected = () => {
	return heatPumpStoreData[index]?.data.productReference ? true : false; 
};

const saveForm = (fields: HeatPumpData) => {
	store.$patch((state) => {
		const { heatPump } = state.heatingAndCoolingSystems.heatGeneration;

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

	navigateTo("/heating-and-cooling-systems/heat-generation");
};

autoSaveElementForm<HeatPumpData>({
	model,
	storeData: store.heatingAndCoolingSystems.heatGeneration.heatPump,
	defaultName: "Heat pump",
	onPatch: (state, newData, index) => {
		newData.data.id ??= id;
		state.heatingAndCoolingSystems.heatGeneration.heatPump.data[index] = newData;
		state.heatingAndCoolingSystems.heatGeneration.heatPump.complete = false;
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
			:options="heatPumpType"
			name="typeOfHeatPump"
			validation="required"
		/>
		<template v-if="model?.typeOfHeatPump !== undefined">
			<FormKit
				id="selectHeatPump"
				type="govPcdbProduct"
				label="Select a heat pump"
				name="productReference"
				:validation-rules="{ isProductSelected }"
				validation="required | isProductSelected"
				help="Select the air source heat pump type from the PCDB using the button below."
				:selected-product-reference="heatPumpStoreData[index]?.data.productReference"
				products-id="airSourceProducts"
			/>
		</template>
		<GovLLMWarning />

		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('heatGeneration')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>