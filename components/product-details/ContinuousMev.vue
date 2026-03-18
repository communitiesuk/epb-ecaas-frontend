<script setup lang="ts">
import type { MevProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as MevProduct;

const tableData: Record<string, string> = 
{
	...(data.technologyType === "CentralisedMev" && {
		"Integral only": data.integralOnly ? (data.integralOnly === 0 ? "False" : "True") : "-",
	}),
	"First year of manufacture": data?.firstYearOfManufacture ?? "-",
	"Final year of manufacture": (data?.finalYearOfManufacture ?? "-").replace("current", "Current"),
};
</script>

<template>
	<ProductDetails id="continuousMev" :data="tableData" />
</template>