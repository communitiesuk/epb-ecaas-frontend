<script setup lang="ts">
import type { AnyPcdbProduct } from "~/pcdb/pcdb.types";

defineProps<{
	id?: string;
	help?: string;
	name?: string;
	label?: string;
	selectedProductReference?: string;
	selectedSubHeatNetworkName?: string;
	selectedProductType?: string;
	heatSource?: HeatSourceData;
	emitterIndex?: number;
	pageUrl?: string;
	pageIndex?: number;
	disabled?: boolean;
	onProductLoaded?: (product: AnyPcdbProduct) => void;
}>();
</script>

<template>
	<FormKit
		:id="id || 'selectHeatPump'"
		type="govPcdbProduct"
		:label="label || 'Select a product'"
		:name="name || 'productReference'"
		validation="required"
		:help="help"
		:selected-product-reference="selectedProductReference"
		:selected-sub-heat-network-name="selectedSubHeatNetworkName"
		:selected-product-type="selectedProductType"
		:heat-source="heatSource"
		:emitter-index="emitterIndex"
		:page-url="pageUrl"
		:page-index="pageIndex"
		:disabled="disabled"
		:on-product-loaded="onProductLoaded"
	/> 
</template>