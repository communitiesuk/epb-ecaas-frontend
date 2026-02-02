<script setup lang="ts">
import type { HeatBatteryDryCoreProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as HeatBatteryDryCoreProduct;

const tableData: Record<string, string> = 
{
	"Heat storage capacity": data.heatStorageCapacity?.toString() ?? "-",
	"Electricity circ pump": data.electricityCircPump?.toString() ?? "-",
	"Fan power": data.fanPwr?.toString() ?? "-",
	"Setpoint temp water": data.setpointTempWater?.toString() ?? "-",
	"Rated power instant": data.ratedPowerInstant?.toString() ?? "-",
	"Electricity standby": data.electricityStandby?.toString() ?? "-",
	"Power in": data.pwrIn?.toString() ?? "-",
};
</script>

<template>
	<ProductDetails id="heatBatteryDryCore" :data="tableData" />
</template>