<script setup lang="ts">
import type { BoilerProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as BoilerProduct;

const tableData: Record<string, string> = 
{
	"Flue type": data.flueType ? data.flueType : "-",
	"Electricity circ pump": data.electricityCircPump?.toString() ?? "-",
	"Ignition": data.ignition ? data.ignition : "-",
	"Condensing": data.condensing,
	"Modulation load": data.modulationLoad?.toString() ?? "-",
	"Efficiency full load": data.efficiencyFullLoad?.toString() ?? "-",
	"Mounting position": data.mountingPosition ?? "-",
	"Electricity part load": data.electricityPartLoad?.toString() ?? "-",
	"Electricity full load": data.electricityFullLoad?.toString() ?? "-",
	"Fan assistance": data.fanAssistance,
	"Rated power": data.ratedPower?.toString() ?? "-",
	"Electricity standby": data.electricityStandby?.toString() ?? "-",
	"Boiler location": data.boilerLocation ?? "-",
	"Efficiency part load": data.efficiencyPartLoad?.toString() ?? "-",
	"ERP space efficiency class": data.erpSpaceEfficiencyClass ?? "-",
	"ERP space efficiency perc": data.erPSpaceEfficiencyPerc?.toString() ?? "-",
	"Power bottom range": data.powerBottomRange?.toString() ?? "-",
	"Burner control": data.burnerControl ?? "-",
	...(data.technologyType === "CombiBoiler" && {
		"Volume primary": data.volumePrimary?.toString() ?? "-",
		"Volume secondary": data.volumeSecondary?.toString() ?? "-",
	}),
	...(data.technologyType === "RegularBoiler" && {
		"Heat loss standby": data.heatLossStandby?.toString() ?? "-",
	}),
};
</script>

<template>
	<ProductDetails id="boiler" :data="tableData" />
</template>