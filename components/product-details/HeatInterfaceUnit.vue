<script setup lang="ts">
import type { HeatInterfaceUnitProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as HeatInterfaceUnitProduct;

const tableData: Record<string, string> = 
{
	"Power circ pump": data.powerCircPump?.toString() ?? "-",
	"Max power water 70": data.maxPowerWater70?.toString() ?? "-",
	"VWART 70": data.vwart70?.toString() ?? "-",
	"Max power water 55": data.maxPowerWater55?.toString() ?? "-",
	"HUI daily loss": data.hiuDailyLoss?.toString() ?? "-",
	"VWART 55": data.vwart55?.toString() ?? "-",
	"Power aux": data.powerAux?.toString() ?? "-",
};
</script>

<template>
	<ProductDetails id="heatInterfaceUnit" :data="tableData" />
</template>