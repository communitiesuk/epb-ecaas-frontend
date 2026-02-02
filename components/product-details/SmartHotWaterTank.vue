<script setup lang="ts">
import type { Product, SmartHotWaterTankProduct } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as SmartHotWaterTankProduct;

const tableData: Record<string, string> = 
{
	"Volume": data.volume?.toString() ?? "-",
	"Daily losses": data.dailyLosses?.toString() ?? "-",
	"Pump power": data.pumpPower?.toString() ?? "-",
	"Max flow rate pump l per min": data.maxFlowRatePumpLPerMin?.toString() ?? "-",
	"Heat exchanger surface area": data.heatExchangerSurfaceArea?.toString() ?? "-",
	"Heater position": data.heaterPosition?.toString() ?? "-",
	"Usable temp": data.usableTemp?.toString() ?? "-",
};
</script>

<template>
	<ProductDetails id="smartHotWaterTank" :data="tableData" />
</template>