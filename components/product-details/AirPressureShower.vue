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
	"Allows low flow rate": displayBoolean(data.allowLowFlowrate),
	"Original flow rate": dim(data.originalFlowrate, "litres per minute"),
	"Flow rate": dim(data.flowrate, "litres per minute"),
	"In use factor": show(data.inuseFactor),
};
</script>

<template>
	<ProductDetails id="airPressureShower" :data="tableData" />
</template>