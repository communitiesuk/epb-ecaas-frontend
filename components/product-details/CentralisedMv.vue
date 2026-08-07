<script setup lang="ts">
import type { CentralisedMvProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as CentralisedMvProduct;

const tableData: Record<string, string> = 
{
	"First year of manufacture": show(data?.firstYearOfManufacture),
	"Final year of manufacture": show(data?.finalYearOfManufacture).replace("current", "Current"),
	"Integrated with heat pump": data.integralOnly ? (data.integralOnly === 0 ? "No" : "Yes") : "-",
};
</script>

<template>
	<ProductDetails id="centralisedMv" :data="tableData" />
</template>