<script setup lang="ts">
import { objectFromEntries } from "ts-extras";
// const { getStoreIndex } = useForm();
// const { autoSaveForm } = useForm();

const store = useEcaasStore();
const heatPumpStoreData = store.heatingAndCoolingSystems.heatGeneration.heatPump.data;

const heatPumpData = useItemToEdit("pump", heatPumpStoreData);
const model = ref(heatPumpData?.data);


const { data: heatPumps } = await useFetch("/api/products", { query: { category: "heatPump" } });

// sort into Small, Medium, Large (to retain while we are using test fake heat pumps and don't have better means to sort them by)
heatPumps.value?.sort((a, b) => -a.reference.localeCompare(b.reference));

const heatPumpOptions = objectFromEntries(heatPumps.value!.map(entity => [entity.reference, displayProduct(entity.product)]));

const saveForm = (fields: Partial<HeatPumpData>) => {
	store.$patch((state) => {
		const { heatPump } = state.heatingAndCoolingSystems.heatGeneration;
		heatPump.data[0]!.data.productReference = fields.productReference;	// index temporarily hardcoded - this will need updating when this page is completed
	});

	navigateTo("/heating-and-cooling-systems/heat-generation");
};
</script>

<template>
	<FormKit
		v-model="model"
		type="form"
		:actions="false"
		:incomplete-message="false"
		@submit="saveForm"
	>
		<FormKit
			id="productReference"
			type="govRadios"
			label="Heat pump"
			:options="heatPumpOptions"
			name="productReference"
			help="For this release you will only be allowed to specify the approximate size of the heat pump. In future releases you will be able to select specific models."
			validation="required"
		/>
		<FormKit type="govButton" label="Save and mark as complete" test-id="saveAndComplete" />
	</Formkit>
</template>