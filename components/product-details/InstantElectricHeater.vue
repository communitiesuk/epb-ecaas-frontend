<script setup lang="ts">
import type { InstantElectricHeaterProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as InstantElectricHeaterProduct;

const tableData: Record<string, string> = 
{
	"c": data.c?.toString() ?? "-",
	"Thermal mass": data.thermalMass?.toString() ?? "-",
	"n": data.n?.toString() ?? "-",
	"First year of manufacture": data?.firstYearOfManufacture ?? "-",
	"Final year of manufacture": data?.finalYearOfManufacture ?? "-",
};
</script>

<template>
	<ProductDetails id="instantElectricHeater" :data="tableData" />
</template>