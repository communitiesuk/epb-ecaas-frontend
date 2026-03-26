<script setup lang="ts">

defineProps<{
	id?: string;
	help?: string; 
	name?: string;
	selectedProductReference?: string;
	selectedProductType?: string;
	pageUrl?: string;
	pageIndex?: number | null;
	maxNumOfItemsIsOne?: boolean
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
		:selected-product-type="selectedProductType"
		:page-url="pageUrl"
		:page-index="pageIndex"
		:max-num-of-items-is-one="maxNumOfItemsIsOne"
	/> 
</template>