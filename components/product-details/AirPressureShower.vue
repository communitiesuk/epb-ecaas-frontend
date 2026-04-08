<script setup lang="ts">
import type { Product, AirPoweredShowerProduct } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as AirPoweredShowerProduct;

const tableData: Record<string, string> = 
{
	...(data.firstYearOfManufacture ? {
		"First year of manufacture": show(data?.firstYearOfManufacture),
	} : {}),
	...(data.finalYearOfManufacture ? {
		"Final year of manufacture": show(data?.finalYearOfManufacture).replace("current", "Current"),
	} : {}),
	"Allow low flowrate": displayBoolean(data.allowLowFlowrate),
	"Original flowrate": show(data.originalFlowrate),
	"Flowrate": show(data.flowrate),
	"Inuse factor": show(data.inuseFactor),
};
</script>

<template>
	<ProductDetails id="airPressureShower" :data="tableData" />
</template>