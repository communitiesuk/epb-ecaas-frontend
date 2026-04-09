<script setup lang="ts">
import type { ConvectorRadiatorProduct } from "~/pcdb/pcdb.types";

const { product: data } = defineProps<{ product: ConvectorRadiatorProduct }>();

const tableData: Record<string, string> = {
	"Water contents": dim(data.water_contents, "litres"),
	"Thermal mass per metre": `${data.thermal_mass_per_m} (kWh/K)/m`,
	"Thermal output delta 50": `${data.thermal_output_delta_50k} W/m`,
	"Weight": `${data.weight} Kg`,
	"Convection fraction": show(data.frac_convective),
	"ID": show(data.ID),
	"Type": show(data.type),
	"Height": `${data.height} Mm`,
};
</script>

<template>
	<ProductDetails id="convectorRadiator" :data="tableData" />
</template>
