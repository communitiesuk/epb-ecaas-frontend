<script setup lang="ts">

defineProps<{
	id?: string;
	help?: string; 
	name?: string;
	selectedProductReference?: string;
	selectedSubHeatNetworkName?: string;
	selectedProductType?: string;
	heatSource?: HeatSourceData;
	pageUrl?: string;
	pageIndex?: number;
}>();
</script>

<template>
	<FormKit
		:id="id || 'selectHeatPump'"
		type="govPcdbProduct"
		label="Select a product"
		:name="name || 'productReference'"
		validation="required"
		:help="help"
		:selected-product-reference="selectedProductReference"
		:selected-sub-heat-network-name="selectedSubHeatNetworkName"
		:selected-product-type="selectedProductType"
		:heat-source="heatSource"
		:page-url="pageUrl"
		:page-index="pageIndex"
	/> 
</template>