<script setup lang="ts">
import type { HeatPumpProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as HeatPumpProduct;

const tableData: Record<string, string> = 
{
	"Source type": data?.sourceType ? displayCamelToSentenceCase(data.sourceType) : "-",
	"Backup control type": data?.backupCtrlType ?? "-",
	"Standard rating capacity 20c": data?.standardRatingCapacity20C ? `${data.standardRatingCapacity20C} kW` : "-",
	...(data?.minimumModulationRate35 ? { "Minimum modulation rate": data?.minimumModulationRate35?.toString() } : {}),
	...(data?.minimumModulationRate ? { "Minimum modulation rate": data?.minimumModulationRate?.toString() } : {}),
	"Temp return feed max": data?.tempReturnFeedMax?.toString() ?? "-",
	"Min temp diff flow return for hp to operate": data?.minTempDiffFlowReturnForHpToOperate?.toString() ?? "-",
	...(data?.powerHeatingWarmAirFan ? { "Power heating warm air fan": data?.powerHeatingWarmAirFan?.toString() } : {}),
	"Power standby": data?.powerStandby !== undefined ? `${data.powerStandby} kW` : "-",
	"Power off": data?.powerOff !== undefined ? `${data.powerOff} kW` : "-",
	"Sink type": data?.sinkType ?? "-",
	"Modulating control": displayBoolean(data?.modulatingControl),
	"Standard rating capacity 35c": data?.standardRatingCapacity35C ? `${data.standardRatingCapacity35C} kW` : "-",
	"Time constant on/off rate": data?.timeConstantOnoffOperation?.toString() ?? "-",
	"Temp lower operating limit": data?.tempLowerOperatingLimit?.toString() ?? "-",
	"Var flow temp control during test": displayBoolean(data?.varFlowTempCtrlDuringTest),
	"Power source circ pump": data?.powerSourceCircPump?.toString() ?? "-",
	"Power heating circ pump": data?.powerHeatingCircPump?.toString() ?? "-",
	"Power crankcase heater": data?.powerCrankcaseHeater !== undefined ? `${data.powerCrankcaseHeater} kW` : "-",
	"Power max backup": data?.powerMaxBackup !== undefined ? `${data.powerMaxBackup} kW` : "-",
};
</script>

<template>
	<ProductDetails :data="tableData" />
</template>