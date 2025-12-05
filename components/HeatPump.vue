<script setup lang="ts">
import { type HeatSourceData , type HeatPumpData, uniqueName } from "#imports";
import { heatPumpTypes } from "../utils/display";
const route = useRoute();
const store = useEcaasStore();
const { getStoreIndex } = useForm();

// const props = defineProps<{
// 	modelRef: HeatSourceData;
// }>();

const heatPumpStoreData = store.spaceHeating.heatGeneration.heatPump.data;
const index = getStoreIndex(heatPumpStoreData);

const isProductSelected = () => {
	return heatPumpStoreData[index]?.data.productReference ? true : false; 
};

</script>

<template>	
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
	<!-- <template v-if="props.modelRef.typeOfHeatSource === 'heatPump' && props.modelRef?.typeOfHeatPump !== undefined">
		<FormKit
			id="selectHeatPump"
			:key="props.modelRef.typeOfHeatPump"
			type="govPcdbProduct"
			label="Select a heat pump"
			name="productReference"
			:validation-rules="{ isProductSelected }"
			validation="required | isProductSelected"
			help="Select the air source heat pump type from the PCDB using the button below."
			:selected-product-reference="heatPumpStoreData[index]?.data.productReference"
			:selected-product-type="heatPumpTypes[props.modelRef.typeOfHeatPump]"
			:page-url="route.fullPath"
			:page-index="index"
		/>
	</template> -->
</template>