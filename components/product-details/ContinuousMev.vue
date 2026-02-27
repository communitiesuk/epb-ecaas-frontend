<script setup lang="ts">
import type { MevProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as MevProduct;

const tableData: Record<string, string> = 
{
	...(data.technologyType === "CentralisedMev" && {
		"Integral only": data.integralOnly ? (data.integralOnly === 0 ? "False" : "True") : "-",
	}),
};
</script>

<template>
	<ProductDetails id="continuousMev" :data="tableData" />
</template>