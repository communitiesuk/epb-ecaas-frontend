<script setup lang="ts">
import type { DirectElectricHeaterProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as DirectElectricHeaterProduct;

const tableData: Record<string, string> = 
{
	"First year of manufacture": show(data?.firstYearOfManufacture),
	"Final year of manufacture": show(data?.finalYearOfManufacture).replace("current", "Current"),
};
</script>

<template>
	<ProductDetails id="instantElectricHeater" :data="tableData" />
</template>