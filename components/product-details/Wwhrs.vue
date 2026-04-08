<script setup lang="ts">
import type { Product, WwhrsProduct } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as WwhrsProduct;

const tableData: Record<string, string> = 
{
	"First year of manufacture": show(data?.firstYearOfManufacture),
	"Final year of manufacture": show(data?.finalYearOfManufacture).replace("current", "Current"),
	"Pipe length": show(data.pipeLength),
	"Heat exchanger waste connection": show(data.heatExchangerWasteConnection),
	"Heat exchanger volume of water": show(data.heatExchangerVolumeOfWater),
	"Heat exchanger cold water connection": show(data.heatExchangerColdWaterConnection),
	"Heat exchanger wet weight": show(data.heatExchangerWetWeight),
	"Number of flow rates": show(data.numberOfFlowRates),
	"Utilisation factor": show(data.utilisationFactor),
	"Heat exchanger length": show(data.heatExchangerLength),
	"Heat exchanger dry weight": show(data.heatExchangerDryWeight),
};
</script>

<template>
	<ProductDetails id="wwhrs" :data="tableData" />
</template>