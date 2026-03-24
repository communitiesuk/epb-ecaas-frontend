<script setup lang="ts">
import type { InstantElectricHeaterProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as InstantElectricHeaterProduct;

const tableData: Record<string, string> = 
{
	"First year of manufacture": show(data?.firstYearOfManufacture),
	"Final year of manufacture": show(data?.finalYearOfManufacture).replace("current", "Current"),
	"c": show(data.c),
	"Thermal mass": show(data.thermalMass),
	"n": show(data.n),
};
</script>

<template>
	<ProductDetails id="instantElectricHeater" :data="tableData" />
</template>