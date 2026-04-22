<script setup lang="ts">
import type { ConvectorRadiatorProduct } from "~/pcdb/pcdb.types";

const { product: data } = defineProps<{ product: ConvectorRadiatorProduct }>();

const tableData: Record<string, string> = {
	"Water contents": dim(data.waterContents, "litres"),
	"Thermal mass per metre": dim(data.thermalMassPerM, "kilowatt-hour per kelvin per metre"),
	"Thermal output delta 50": dim(data.thermalOutputDelta50k, "watts per metre"),
	"Weight": dim(data.weight, "kilograms"),
	"Convection fraction": show(data.fracConvective),
	"ID": show(data.ID),
	"Type": show(data.type),
	"Height": dim(data.height, "millimetres"),
};
</script>

<template>
	<ProductDetails id="convectorRadiator" :data="tableData" />
</template>
