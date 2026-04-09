<script setup lang="ts">
import type { Product, SmartHotWaterTankProduct } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as SmartHotWaterTankProduct;

const tableData: Record<string, string> = 
{
	"First year of manufacture": show(data?.firstYearOfManufacture),
	"Final year of manufacture": show(data?.finalYearOfManufacture).replace("current", "Current"),
	"Storage capacity": dim(data.volume, "litres"),
	"Daily energy loss of hot water cylinder declared by manufacturer": dim(data.dailyLosses, "kilowatt hours per day"),
	"Circulation pump power": dim(data.powerPumpKW, "kilowatt"),
	"Maximum pump flow rate": dim(data.maxFlowRatePumpLPerMin, "litres per minute"),
	"Heat exchanger surface area": dim(data.heatExchangerSurfaceArea, "metres square"),
	"Immersion heater position": data.heaterPosition ? formatIntoPercentage(data.heaterPosition) : "-",
	"Lowest usable hot water temperature": dim(data.tempUsable, "celsius"),
};
</script>

<template>
	<ProductDetails id="smartHotWaterTank" :data="tableData" />
</template>