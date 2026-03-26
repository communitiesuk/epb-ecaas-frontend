<script setup lang="ts">
import type { HeatBatteryDryCoreProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as HeatBatteryDryCoreProduct;

const tableData: Record<string, string> = 
{
	"First year of manufacture": show(data?.firstYearOfManufacture),
	"Final year of manufacture": show(data?.finalYearOfManufacture).replace("current", "Current"),
	"Heat storage capacity": dim(data.heatStorageCapacity, "kilowatt-hour"),
	"Internal pump power": dim(data.electricityCircPump, "watt"),
	"Internal fan power": dim(data.fanPwr, "kilowatt"),
	"Target flow temperature": dim(data.setpointTempWater, "celsius"),
	"Maximum instant heat output": dim(data.ratedPowerInstant, "kilowatt"),
	"Standby power": dim(data.electricityStandby, "kilowatt"),
	"Input charging power": dim(data.pwrIn, "kilowatt"),
};
</script>

<template>
	<ProductDetails id="heatBatteryDryCore" :data="tableData" />
</template>