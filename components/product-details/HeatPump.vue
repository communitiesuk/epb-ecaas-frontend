<script setup lang="ts">
import type { HeatPumpProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as HeatPumpProduct;

const tableData: Record<string, string> = 
{
	"First year of manufacture": show(data?.firstYearOfManufacture),
	"Final year of manufacture": show(data?.finalYearOfManufacture).replace("current", "Current"),
	"Heat source type": data.sourceType ? displayCamelToSentenceCase(data.sourceType) : "-",
	"Backup control type": show(data.backupCtrlType),
	"Standard rating capacity at 20°C": dim(data?.standardRatingCapacity20C, "kilowatt"),
	...(data?.minimumModulationRate35 ? { "Minimum modulation ratio": data?.minimumModulationRate35?.toString() } : {}),
	...(data?.minimumModulationRate ? { "Minimum modulation ratio": data?.minimumModulationRate?.toString() } : {}),
	"Maximum return feed temperature": dim(data.tempReturnFeedMax, "celsius"),
	"Minimum flow return temperature difference for heat pump to operate": dim(data?.minTempDiffFlowReturnForHpToOperate, "celsius"),
	...(data?.powerHeatingWarmAirFan ? { "Power heating warm air fan": data?.powerHeatingWarmAirFan?.toString() } : {}),
	"Power used when on standby": dim(data.powerStandby, "kilowatt"),
	"Power used when off": dim(data?.powerOff, "kilowatt"),
	"Sink type": show(data.sinkType),
	"Modulating control": displayBoolean(data.modulatingControl),
	"Standard rating capacity at 35°C": dim(data?.standardRatingCapacity35C,"kilowatt"),
	"Time constant on/off rate": data?.timeConstantOnoffOperation ? `${data?.timeConstantOnoffOperation.toString()} seconds` : "-",
	"Minimum operating temperature": dim(data?.tempLowerOperatingLimit, "celsius"),
	"Variable flow temperature control during test": displayBoolean(data?.varFlowTempCtrlDuringTest),
	"Power source for circulating pump": dim(data?.powerSourceCircPump, "kilowatt"),
	"Power of circulation pump": dim(data?.powerHeatingCircPump, "kilowatt"),
	"Power of crankcase heater": dim(data?.powerCrankcaseHeater, "kilowatt"),
	"Maximum power of backup": dim(data?.powerMaxBackup, "kilowatt"),
};
</script>

<template>
	<ProductDetails id="heatPump" :data="tableData" />
</template>