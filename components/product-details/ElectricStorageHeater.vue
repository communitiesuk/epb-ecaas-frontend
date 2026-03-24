<script setup lang="ts">
import type { ElectricStorageHeaterProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as ElectricStorageHeaterProduct;

const tableData: Record<string, string> = 
{
	"First year of manufacture": show(data?.firstYearOfManufacture),
	"Final year of manufacture": show(data?.finalYearOfManufacture).replace("current", "Current"),
	"Backup power": dim(data.backupPower, "kilowatt"),
	"Storage capacity": dim(data.storageCapacity, "kilowatt-hour"),
	"Rated charging power": dim(data.ratedPower, "kilowatt"),
	"Air flow type": show(data.airFlowType),
	"Convective heat ratio": data.convectiveFraction ? formatIntoPercentage(data.convectiveFraction) : "-",
	"Heat retention": data.heatRetention ? formatIntoPercentage(data.heatRetention) : "-",
	"Fan power": dim(data.ratedFanPower, "watt"),
	"Input power": dim(data.pwrIn, "kilowatt"),
	"Nominal heat output": dim(data.outputPower, "kilowatt"),
	"High heat retention": data.highHeatRetention ? (data.highHeatRetention === 0 ? "No" : "Yes") : "-",
	"Control type": show(data.controlType),
};
</script>

<template>
	<ProductDetails id="electricStorageHeater" :data="tableData" />
</template>