<script setup lang="ts">
import { type HeatSourceData, uniqueName } from "#imports";
import { heatPumpTypes } from "../utils/display";
const route = useRoute();
const store = useEcaasStore();

defineProps<{
	model: Extract<HeatSourceData, { "typeOfHeatSource": "heatPump" }>;
	index: number;
}>();

const heatSourceStoreData = store.spaceHeating.heatSource.data;
const emit = defineEmits(["update-heat-pump-model"]);

</script>

<template>
	<FormKit
		id="typeOfHeatPump"
		type="govRadios"
		label="Type of heat pump"
		:options="heatPumpTypes"
		name="typeOfHeatPump"
		validation="required"
		@click="emit('update-heat-pump-model', 'typeOfHeatPump')" />
	<FormKit
		v-if="model.typeOfHeatPump"
		id="name"
		:value="model.name"
		type="govInputText"
		label="Name"
		help="Provide a name for this element so that it can be identified later"
		name="name"
		:validation-rules="{ uniqueName: uniqueName(heatSourceStoreData, { index }) }"
		validation="required | uniqueName"
		:validation-messages="{
			uniqueName: 'An element with this name already exists. Please enter a unique name.'
		}" />
	<FieldsSelectPcdbProduct
		v-if="model?.typeOfHeatPump && model.typeOfHeatPump === 'airSource'"
		help="Select the air source heat pump type from the PCDB using the button below"
		:selected-product-reference="model.productReference"
		:selected-product-type="heatPumpTypes[model.typeOfHeatPump]"
		:page-url="route.fullPath"
		:page-index="index" />
	<FieldsSelectPcdbProduct
		v-else-if="model?.typeOfHeatPump && model.typeOfHeatPump === 'groundSource'"
		help="Select the ground source heat pump type from the PCDB using the button below"
		:selected-product-reference="model.productReference"
		:selected-product-type="heatPumpTypes[model.typeOfHeatPump]"
		:page-url="route.fullPath"
		:page-index="index" />
	<FieldsSelectPcdbProduct
		v-else-if="model?.typeOfHeatPump && model.typeOfHeatPump === 'waterSource'"
		help="Select the water source heat pump type from the PCDB using the button below"
		:selected-product-reference="model.productReference"
		:selected-product-type="heatPumpTypes[model.typeOfHeatPump]"
		:page-url="route.fullPath"
		:page-index="index" />
	<FieldsSelectPcdbProduct
		v-else-if="model?.typeOfHeatPump && model.typeOfHeatPump === 'booster'"
		help="Select the booster heat pump type from the PCDB using the button below"
		:selected-product-reference="model.productReference"
		:selected-product-type="heatPumpTypes[model.typeOfHeatPump]"
		:page-url="route.fullPath"
		:page-index="index" />
	<FieldsSelectPcdbProduct
		v-else-if="model?.typeOfHeatPump && model.typeOfHeatPump === 'hotWaterOnly'"
		help="Select the hot water only heat pump type from the PCDB using the button below"
		:selected-product-reference="model.productReference"
		:selected-product-type="heatPumpTypes[model.typeOfHeatPump]"
		:page-url="route.fullPath"
		:page-index="index" />
	<FieldsSelectPcdbProduct
		v-else-if="model?.typeOfHeatPump && model.typeOfHeatPump === 'exhaustAirMev'"
		help="Select the exhaust air MEV heat pump type from the PCDB using the button below"
		:selected-product-reference="model.productReference"
		:selected-product-type="heatPumpTypes[model.typeOfHeatPump]"
		:page-url="route.fullPath"
		:page-index="index" />
	<FieldsSelectPcdbProduct
		v-else-if="model?.typeOfHeatPump && model.typeOfHeatPump === 'exhaustAirMvhr'"
		help="Select the exhaust air MVHR heat pump type from the PCDB using the button below"
		:selected-product-reference="model.productReference"
		:selected-product-type="heatPumpTypes[model.typeOfHeatPump]"
		:page-url="route.fullPath"
		:page-index="index" />
	<FieldsSelectPcdbProduct
		v-else-if="model?.typeOfHeatPump && model.typeOfHeatPump === 'exhaustAirMixed'"
		help="Select the exhaust air mixed heat pump type from the PCDB using the button below"
		:selected-product-reference="model.productReference"
		:selected-product-type="heatPumpTypes[model.typeOfHeatPump]"
		:page-url="route.fullPath"
		:page-index="index" />
</template>