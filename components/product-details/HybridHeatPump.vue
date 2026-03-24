<script setup lang="ts">
import type { HybridHeatPumpProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as HybridHeatPumpProduct;

const tableData: Record<string, string> = {
	"Source type": data.sourceType ? displayCamelToSentenceCase(data.sourceType) : "-",
	"Backup control type": data.backupCtrlType ?? "-",
	...(data.minModulationRate55 ? { "Minimum modulation rate 55": data.minModulationRate55?.toString() } : {}),
	...(data.minModulationRate35 ? { "Minimum modulation rate 35": data.minModulationRate35?.toString() } : {}),
	"Temp return feed max": data?.tempReturnFeedMax?.toString() ?? "-",
	"Fuel": data.fuel ?? "-",
	"Min temp diff flow return for hp to operate": data.minTempDiffFlowReturnForHpToOperate?.toString() ?? "-",
	"Power standby": data.powerStandby !== undefined ? `${data.powerStandby} kW` : "-",
	"Power off": data.powerOff !== undefined ? `${data.powerOff} kW` : "-",
	"Sink type": data.sinkType ?? "-",
	"Modulating control": displayBoolean(data.modulatingControl),
	"Has cost ratio control": displayBoolean(data.hasCostRatioControl),
	"Time constant on/off rate": data.timeConstantOnoffOperation?.toString() ?? "-",
	"Temp lower operating limit": data.tempLowerOperatingLimit?.toString() ?? "-",
	"Var flow temp control during test": displayBoolean(data.varFlowTempCtrlDuringTest),
	"Power source circ pump": data.powerSourceCircPump?.toString() ?? "-",
	"Power heating circ pump": data.powerHeatingCircPump?.toString() ?? "-",
	"Power crankcase heater": data.powerCrankcaseHeater !== undefined ? `${data.powerCrankcaseHeater} kW` : "-",
	"First year of manufacture": data?.firstYearOfManufacture ?? "-",
	"Final year of manufacture": (data?.finalYearOfManufacture ?? "-").replace("current", "Current"),
};
</script>

<template>
	<ProductDetails id="hybridHeatPump" :data="tableData" />
</template>