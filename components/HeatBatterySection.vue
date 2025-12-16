<script setup lang="ts">
import { uniqueName } from '#imports';
import type { HeatBatteryType } from '~/stores/ecaasStore.schema';
import type { HeatBatteryTypeDisplay } from '~/utils/display';
import EnergySupplies from './fields/EnergySupplies.vue';

const route = useRoute();
const store = useEcaasStore();
const { getStoreIndex } = useForm();

defineProps<{
	model: Extract<HeatSourceData, { "typeOfHeatSource": "heatBattery" }>;
}>();

const heatSourceStoreData = store.spaceHeatingNew.heatSource.data;
const index = getStoreIndex(heatSourceStoreData);


const heatBatteryTypeOptions = {
	"pcm": "PCM",
	"dryCore": "Dry core",
} as const satisfies Record<HeatBatteryType, HeatBatteryTypeDisplay>;


</script>

<template>	
  <FormKit
    id="name"
    type="govInputText"
    label="Name"
    help="Provide a name for this element so that it can be identified later"
    name="name"
    :validation-rules="{ uniqueName: uniqueName(heatSourceStoreData, { index }) }"
    validation="required | uniqueName"
    :validation-messages="{
      uniqueName: 'An element with this name already exists. Please enter a unique name.'
    }"
  />
	<FormKit
		id="typeOfHeatBattery"
		type="govRadios"
		label="Type of heat battery"
		:options="heatBatteryTypeOptions"
		name="typeOfHeatBattery"
		validation="required"
	/>
	<FormKit
		id="selectHeatBattery"
		type="govPcdbProduct"
		label="Select a heat battery"
		name="productReference"
		validation="required"
		help="Select the heat battery type from the PCDB using the button below."
		:selected-product-reference="model.productReference"
		:selected-product-type="heatBatteryTypeOptions[model.typeOfHeatBattery]"
		:page-url="route.fullPath"
		:page-index="index"
	/>
	<FormKit
		id="numberOfUnits"
		type="govInputInt"
		name="numberOfUnits"
    	label="Number of units"
		validation="required | isInteger | min:1"
    	:validation-messages="{
      		isInteger: `Number of units must be an integer.`,
		}"
	/>
	<FieldsEnergySupplies
		id="energySupply"
		name="energySupply"
		label="Energy supply"   
		help="Select the relevant energy supply that has been added previously"
	/>
</template>