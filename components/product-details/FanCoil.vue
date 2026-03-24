<script setup lang="ts">
import type { FanCoilProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as FanCoilProduct;

const tableData: Record<string, string> = 
{
	"First year of manufacture": show(data?.firstYearOfManufacture),
	"Final year of manufacture": show(data?.finalYearOfManufacture).replace("current", "Current"),
	"Number of fan speeds": show(data.numberOfFanSpeeds),
	"Convective heat ratio": data.fracConvective ? formatIntoPercentage(data.fracConvective) : "-",
};
</script>

<template>
	<ProductDetails id="fanCoil" :data="tableData" />
</template>