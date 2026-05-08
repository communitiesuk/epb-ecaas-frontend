<script setup lang="ts">
import type { UnderFloorHeatingProduct } from "~/pcdb/pcdb.types";

const { product: data } = defineProps<{ product: UnderFloorHeatingProduct }>();

const tableData: Record<string, string> = {
	"System name": show(data.systemName),
	"Floor finish compatibility": show(data.floorFinishCompatibility),
	"Pipe centres": dim(data.pipeCentres, "millimetres"),
	"Depth of floor structural material": dim(data.depthOfFloorStructuralMaterial, "millimetres"),
	"Equivalent specific thermal mass": dim(data.equivalentSpecificThermalMass, "kilojoules per square metre per kelvin"),
	"Floor finish resistance": dim(data.floorFinishResistance, "square metre kelvin per watt"),
	"Fraction convective": show(data.fracConvective),
	"System performance factor": show(data.systemPerformanceFactor),
};
</script>

<template>
	<ProductDetails id="underfloorHeating" :data="tableData" />
</template>