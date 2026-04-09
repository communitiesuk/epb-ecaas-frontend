<script setup lang="ts">
import type { ElectricStorageHeaterProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as ElectricStorageHeaterProduct;

const tableData: Record<string, string> = 
{
	"First year of manufacture": show(data?.firstYearOfManufacture),
	"Final year of manufacture": show(data?.finalYearOfManufacture).replace("current", "Current"),
	"Storage capacity": dim(data.storageCapacity, "kilowatt-hour"),
	"Rated charging power": dim(data.ratedPower, "kilowatt"),
	"Air flow type": data.airFlowType ? capitalizeFirstLetter(data.airFlowType) : "-", 
	"Convective heat ratio": data.fracConvective ? formatIntoPercentage(data.fracConvective) : "-",
	"Heat retention": data.heatRetention ? formatIntoPercentage(data.heatRetention) : "-",
	"Fan power": dim(data.fanPwr, "watt"),
	"Input power": dim(data.pwrIn, "kilowatt"),
	"Nominal heat output": dim(data.outputPower, "kilowatt"),
	"High heat retention": data.highHeatRetention ? (data.highHeatRetention === 0 ? "No" : "Yes") : "-",
};
</script>

<template>
	<ProductDetails id="electricStorageHeater" :data="tableData" />
</template>