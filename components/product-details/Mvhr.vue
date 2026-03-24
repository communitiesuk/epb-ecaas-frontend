<script setup lang="ts">
import type { CentralisedMvhrProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as CentralisedMvhrProduct;

const tableData: Record<string, string> = 
{
	"First year of manufacture": show(data?.firstYearOfManufacture),
	"Final year of manufacture": show(data?.finalYearOfManufacture).replace("current", "Current"),
	"Summer bypass": data.summerBypass ? (data.summerBypass === 0 ? "No" : "Yes") : "-",
	"Integrated with heat pump": data.integralOnly ? (data.integralOnly === 0 ? "No" : "Yes") : "-",
};
</script>

<template>
	<ProductDetails id="mvhr" :data="tableData" />
</template>