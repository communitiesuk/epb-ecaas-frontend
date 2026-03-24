<script setup lang="ts">
import type { MevProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as MevProduct;

const tableData: Record<string, string> = 
{
	"First year of manufacture": show(data?.firstYearOfManufacture),
	"Final year of manufacture": show(data?.finalYearOfManufacture).replace("current", "Current"),
	...(data.technologyType === "CentralisedMev" && {
		"Integrated with heat pump": data.integralOnly ? (data.integralOnly === 0 ? "No" : "Yes") : "-",
	}),
};
</script>

<template>
	<ProductDetails id="continuousMev" :data="tableData" />
</template>