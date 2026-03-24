<script setup lang="ts">
import type { HeatBatteryPcmProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as HeatBatteryPcmProduct;

const tableData: Record<string, string> = 
{
	"First year of manufacture": show(data?.firstYearOfManufacture),
	"Final year of manufacture": show(data?.finalYearOfManufacture).replace("current", "Current"),
	"Maximum storage temperature": dim(data.maxTemperature, "celsius"),
	"Electricity circ pump": dim(data.electricityCircPump, "kilowatt"),
	"Phase change lower limit": dim(data.phaseTransitionTemperatureLower, "celsius"),
	"Phase change upper limit": dim(data.phaseTransitionTemperatureUpper, "celsius"),
	"Rated charging power": dim(data.ratedChargePower, "kilowatt"),
	"Maximum rated loss": dim(data.maxRatedLosses, "kilowatt"),
	"Flow rate": dim(data.flowRateLPerMin, "litres per minute"),
	"Heat capacity of storage during  phase transition": data.heatStorageZoneMaterialKjPerKDuringPhaseTransition ? `${data.heatStorageZoneMaterialKjPerKDuringPhaseTransition.toString()} kJ/K` : "-",
	"Power used when on standby": dim(data.electricityStandby, "kilowatt"),
	"Water connection diameter": dim(data.inletDiameterMm, "millimetres"),
	"Heat capacity of storage below  phase transition": data.heatStorageZoneMaterialKjPerKBelowPhaseTransition ? `${data.heatStorageZoneMaterialKjPerKBelowPhaseTransition.toString()} kJ/K` : "-",
	"Heat capacity of storage above  phase transition": data.heatStorageZoneMaterialKjPerKAbovePhaseTransition ? `${data.heatStorageZoneMaterialKjPerKAbovePhaseTransition.toString()} kJ/K` : "-",
	"Service provision": show(data.serviceProvision),
	"Velocity in heat exchanger at 1 litre/min flow rate": data.velocityInHexTubeAt1LPerMinMPerS ? `${data.velocityInHexTubeAt1LPerMinMPerS.toString()} m/s` : "-",
	"Simultaneous charging and discharging": data.simultaneousChargingAndDischarging ? (data.simultaneousChargingAndDischarging === 0 ? "No" : "Yes") : "-",
};
</script>

<template>
	<ProductDetails id="heatBatteryPcm" :data="tableData" />
</template>