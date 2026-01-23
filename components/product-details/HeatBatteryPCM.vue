<script setup lang="ts">
import type { HeatBatteryPcmProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as HeatBatteryPcmProduct;

const tableData: Record<string, string> = 
{
	"Max temperature": data.maxTemperature?.toString() ?? "-",
	"Electricity circ pump": data.electricityCircPump?.toString() ?? "-",
	"Phase transition temperature lower": data.phaseTransitionTemperatureLower?.toString() ?? "-",
	"Phase transition temperature upper": data.phaseTransitionTemperatureUpper?.toString() ?? "-",
	"Rated charge power": data.ratedChargePower?.toString() ?? "-",
	"Max rated losses": data.maxRatedLosses?.toString() ?? "-",
	"Flow rate l per min": data.flowRateLPerMin?.toString() ?? "-",
	"Heat storage zone material kj per k during phase transition": data.heatStorageZoneMaterialKjPerKDuringPhaseTransition?.toString() ?? "-",
	"Electricity standby": data.electricityStandby?.toString() ?? "-",
	"Inlet diameter mm": data.inletDiameterMm?.toString() ?? "-",
	"Heat storage zone material kj per k below phase transition": data.heatStorageZoneMaterialKjPerKBelowPhaseTransition?.toString() ?? "-",
	"Service provision": data.serviceProvision ?? "-",
	"Heat storage zone material kj per k above phase transition": data.heatStorageZoneMaterialKjPerKAbovePhaseTransition?.toString() ?? "-",
	"Velocity in hex tube at 1 l per min m per s": data.velocityInHexTubeAt1LPerMinMPerS?.toString() ?? "-",
	"Simultaneous charging and discharging": data.simultaneousChargingAndDischarging?.toString() ?? "-",

};
</script>

<template>
	<ProductDetails :data="tableData" />
</template>