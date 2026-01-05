<script setup lang="ts">

const props = defineProps<{
	help?: string;
  selectedProductReference?: string;
  selectedProductType?: string;
  pageUrl?: string;
  pageIndex?: number;
}>();
</script>

<template>
	<FormKit
		id="selectHeatPump"
		type="govPcdbProduct"
		label="Select a heat pump"
		name="productReference"
		validation="required"
		:help="help"
	  :selected-product-reference="selectedProductReference"
		:selected-product-type="selectedProductType"
		:page-url="pageUrl"
		:page-index="pageIndex"
	/> 
</template>