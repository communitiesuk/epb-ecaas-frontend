<script setup lang="ts">

defineProps<{
	id?: string;
	help?: string; 
	name?: string;
	selectedProductReference?: string;
	selectedSubHeatNetworkId?: string;
	selectedProductType?: string;
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
		:selected-sub-heat-network-id="selectedSubHeatNetworkId"
		:selected-product-type="selectedProductType"
		:page-url="pageUrl"
		:page-index="pageIndex"
	/> 
</template>