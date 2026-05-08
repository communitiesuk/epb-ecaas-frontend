<script setup lang="ts">
import type { UnderFloorHeatingProduct } from "~/pcdb/pcdb.types";

const { product: data } = defineProps<{ product: UnderFloorHeatingProduct }>();

const tableData: Record<string, string> = {
	"System": show(data.systemName),
	"System type": show(data.systemType),
	"R-value of floor finish": dim(data.floorFinishResistance, "square metre kelvin per watt"),
	"Spacing between heating pipes": dim(data.pipeCentres, "millimetres"),
	"Structural floor material description": show(data.structuralFloorMaterial),
	"Depth of floor structural material": dim(data.depthOfFloorStructuralMaterial, "millimetres"),
	"Floor finishes the system is suitable for": show(data.floorFinishCompatibility),
	"System performance factor": dim(data.systemPerformanceFactor, "watts per square metre kelvin"),
	"Equivalent specific thermal mass of system": dim(data.equivalentSpecificThermalMass, "kilojoules per square metre per kelvin"),
	"Convection fraction": show(data.fracConvective),
};
</script>

<template>
	<ProductDetails id="underFloorHeating" :data="tableData" />
</template>