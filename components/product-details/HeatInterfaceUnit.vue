<script setup lang="ts">
import type { HeatInterfaceUnitProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as HeatInterfaceUnitProduct;

const tableData: Record<string, string> = 
{
	"First year of manufacture": show(data?.firstYearOfManufacture),
	"Final year of manufacture": show(data?.finalYearOfManufacture).replace("current", "Current"),
	"Circulation pump power": dim(data.powerCircPump, "kilowatt"),
	"Maximum heat output (70°C flow temperature)": dim(data.maxPowerWater70, "kilowatt"),
	"Return temperature during test at 70°C flow temperature)": dim(data.vwart70, "celsius"),
	"Maximum heat output (55°C flow temperature)": dim(data.maxPowerWater55, "kilowatt"),
	"Standing heat loss": dim(data.hiuDailyLoss, "kilowatt hours per day"),
	"Return temperature during test at 55°C flow temperature)": dim(data.vwart55, "celsius"),
	"Auxiliary power": dim(data.powerAux, "kilowatt"),
};
</script>

<template>
	<ProductDetails id="heatInterfaceUnit" :data="tableData" />
</template>