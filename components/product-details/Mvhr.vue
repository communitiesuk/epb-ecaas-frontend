<script setup lang="ts">
import type { CentralisedMvhrProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as CentralisedMvhrProduct;

const tableData: Record<string, string> = 
{
	"Summer bypass": data.summerBypass?.toString() ?? "-",
	"Integral only": data.integralOnly ? (data.integralOnly === 0 ? "False" : "True") : "-",
	"First year of manufacture": data?.firstYearOfManufacture ?? "-",
	"Final year of manufacture": (data?.finalYearOfManufacture ?? "-").replace("current", "Current"),
};
</script>

<template>
	<ProductDetails id="mvhr" :data="tableData" />
</template>