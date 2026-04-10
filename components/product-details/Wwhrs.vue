<script setup lang="ts">
import type { Product, WwhrsProduct } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as WwhrsProduct;

const tableData: Record<string, string> = 
{
	"First year of manufacture": show(data?.firstYearOfManufacture),
	"Final year of manufacture": show(data?.finalYearOfManufacture).replace("current", "Current"),
	"Pipe length": dim(data.pipeLength, "millimetres"),
	"Diameter of waste connection pipe": dim(data.heatExchangerWasteConnection, "millimetres"),
	"Volume of water in the heat exchanger": dim(data.heatExchangerVolumeOfWater, "litres"),
	"Diameter of cold pipe": dim(data.heatExchangerColdWaterConnection, "millimetres"),
	"Number of flow rates": show(data.numberOfFlowRates),
	"Utilisation factor": show(data.utilisationFactor),
	"Heat exchanger length": dim(data.heatExchangerLength, "metres"),
	"Weight of heat exchanger": dim(data.heatExchangerDryWeight, "kilograms"),
};
</script>

<template>
	<ProductDetails id="wwhrs" :data="tableData" />
</template>