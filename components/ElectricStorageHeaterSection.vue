<script setup lang="ts">
import type { ElectricStorageHeaterModelType } from "~/pages/space-heating-new/heat-emitters/[heatEmitter]/index.vue";

const route = useRoute();

defineProps<{
	model: ElectricStorageHeaterModelType
	index: number;
}>();


</script>

<template>
	<FormKit
		id="name"
		type="govInputText"
		label="Name"
		name="name"
		validation="required" />
	<FormKit
		id="selectElectricStorageHeater"
		type="govPcdbProduct"
		label="Select product"
		name="selectElectricStorageHeater"
		validation="required"
		help="Select the electric storage heater type from the PCDB using the button below."
		:selected-product-reference="model.productReference"
		:selected-product-type="model.typeOfHeatEmitter"
		:page-url="route.fullPath"
		:page-index="index" />
	<FormKit
		id="numOfStorageHeaters"
		name="numOfStorageHeaters"
		type="govInputInt"
		label="Number of storage heaters"
		help="Enter the number of storage heaters with this specification in the dwelling" />
</template>
