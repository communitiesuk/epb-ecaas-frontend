<script setup lang="ts">
import type { HotWaterOnlyHeatPumpProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as HotWaterOnlyHeatPumpProduct;

const tableData: Record<string, string> = {
	"First year of manufacture": show(data.firstYearOfManufacture),
	"Final year of manufacture": show((data.finalYearOfManufacture ?? "-").replace("current", "Current")),
	"Heat exchanger surface area": dim(data.heatExchangerSurfaceAreaDeclared , "metres square"),
	"Volume of test cylinder": dim(data.testVesselVolume, "litres"),
	"Daily energy loss declared by manufacturer": dim(data.dailyLossesDeclared, "kilowatt hours per day"),
	"Volume of integrated hot water cylinder declared by manufacturer": dim(data.tankVolumeDeclared, "litres"),
	"Fuel": show(data.fuel),
	"Daily energy loss of hot water cylinder declared by manufacturer": dim(data.hwVesselLossDaily, "kilowatt hours per day"),
	"Maximum power": dim(data.powerMax, "kilowatt"),
	"Integrated cylinder": show(data.vesselType),
};
</script>

<template>
	<ProductDetails id="hotWaterHeatPump" :data="tableData" />
</template>