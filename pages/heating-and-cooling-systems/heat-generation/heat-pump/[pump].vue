<script setup lang="ts">
import { objectFromEntries } from "ts-extras";
import { v4 as uuidv4 } from "uuid";
import { displayProduct } from "~/utils/display";
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

const heatPumpOptions = objectFromEntries(heatPumps.value!.map(entity => [entity.reference, displayProduct(entity.product)]));
const id =  heatPumpData?.data.id ?? uuidv4();

const saveForm = (fields: HeatPumpData) => {
	store.$patch((state) => {
		const { heatPump } = state.heatingAndCoolingSystems.heatGeneration;

		const heatPumpItem: EcaasForm<HeatPumpData> = {
			data: {
				id,
				name: fields.name,
				productReference: fields.productReference,
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
			id="productReference"
			type="govRadios"
			label="Heat pump"
			:options="heatPumpOptions"
			name="productReference"
			help="For this release you will only be allowed to specify the approximate size of the heat pump. In future releases you will be able to select specific models."
			validation="required"
		/>
		<GovLLMWarning />

		<div class="govuk-button-group">
			<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
			<GovButton :href="getUrl('heatGeneration')" secondary test-id="saveProgress">Save progress</GovButton>
		</div>
	</FormKit>
</template>