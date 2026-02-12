<script setup lang="ts">
import type { CentralisedContinuousMevProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as CentralisedContinuousMevProduct;

const tableData: Record<string, string> = 
{
	"Integral only": data.integralOnly ? (data.integralOnly === 0 ? "False" : "True") : "-",
};
</script>

<template>
	<ProductDetails id="centralisedContinuousMev" :data="tableData" />
</template>