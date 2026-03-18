<script setup lang="ts">
import type { FanCoilProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as FanCoilProduct;

const tableData: Record<string, string> = 
{
	"Number of fan speeds": data.numberOfFanSpeeds?.toString() ?? "-",
	"Number of fan point delta T": data.numberOfTestPointDeltaT?.toString() ?? "-",
	"Frac convective": data.fracConvective?.toString() ?? "-",
	"First year of manufacture": data?.firstYearOfManufacture ?? "-",
	"Final year of manufacture": (data?.finalYearOfManufacture ?? "-").replace("current", "Current"),
};
</script>

<template>
	<ProductDetails id="fanCoil" :data="tableData" />
</template>