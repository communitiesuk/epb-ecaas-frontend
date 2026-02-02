<script setup lang="ts">
import type { ElectricStorageHeaterProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as ElectricStorageHeaterProduct;

const tableData: Record<string, string> = 
{
	"Backup power": data.backupPower?.toString() ?? "-",
	"Storage capacity": data.storageCapacity?.toString() ?? "-",
	"Rated power": data.ratedPower?.toString() ?? "-",
	"Air flow type": data.airFlowType?.toString() ?? "-",
	"Convective fraction": data.convectiveFraction?.toString() ?? "-",
	"Heat retention": data.heatRetention?.toString() ?? "-",
	"Rated fan power": data.ratedFanPower?.toString() ?? "-",
	"Power in": data.pwrIn?.toString() ?? "-",
	"Output power": data.outputPower?.toString() ?? "-",
	"High heat retention": data.highHeatRetention?.toString() ?? "-",
	"Control type": data.controlType ?? "-",
};
</script>

<template>
	<ProductDetails id="electricStorageHeater" :data="tableData" />
</template>