<script setup lang="ts">
import type { CentralisedMvhrProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as CentralisedMvhrProduct;

const tableData: Record<string, string> = 
{
	"Summer bypass": data.summerBypass?.toString() ?? "-",
	"Integral only": data.integralOnly ? (data.integralOnly === 0 ? "False" : "True") : "-",
};
</script>

<template>
	<ProductDetails id="mvhr" :data="tableData" />
</template>