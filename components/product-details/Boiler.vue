<script setup lang="ts">
import type { BoilerProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as BoilerProduct;

const tableData: Record<string, string> = 
{
	"First year of manufacture": show(data?.firstYearOfManufacture),
	"Final year of manufacture": show(data?.finalYearOfManufacture).replace("current", "Current"),
	"Flue type": show(data.flueType),
	"Circulation pump power": dim(data.electricityCircPump, "kilowatt"),
	"Permanent pilot light": data.ignition ? data.ignition.replace("no", "No").replace("yes", "Yes").replace("unknown", "Unknown") : "-",
	"Condensing": data.condensing === "condensing" ? "Yes" : "No",
	"Minimum modulation ratio": data.modulationLoad ? formatIntoPercentage(data.modulationLoad) : "-",
	"Full load efficiency": data.efficiencyFullLoad ? formatIntoPercentage(data.efficiencyFullLoad) : "-",
	"Mounting position": show(data.mountingPosition),
	"Part load electrical power": dim(data.electricityPartLoad, "kilowatt"),
	"Full load electrical power": dim(data.electricityFullLoad, "kilowatt"),
	"Flue fan": data.fanAssistance ? data.fanAssistance.replace("fan", "Fan").replace("no fan", "No fan") : "-",
	"Maximum thermal output": dim(data.ratedPower, "kilowatt"),
	"Standby power consumption": dim(data.electricityStandby, "kilowatt"),
	"Boiler location": show(data.boilerLocation),
	"Part load net efficiency": data.efficiencyPartLoad ? formatIntoPercentage(data.efficiencyPartLoad) : "-",
	"ErP space efficiency class": data.erpSpaceEfficiencyClass ? `${data.erpSpaceEfficiencyClass} A+++-G` : "-",
	"ErP seasonal space heating efficiency": data.erPSpaceEfficiencyPerc ? formatIntoPercentage(data.erPSpaceEfficiencyPerc) : "-",
	"Minimum thermal output": dim(data.powerBottomRange, "kilowatt"),
	"Burner modulation type": show(data.burnerControl),
	...(data.technologyType === "CombiBoiler" && {
		"Primary water content": dim(data.volumePrimary, "litres"),
		"Secondary water content": dim(data.volumeSecondary, "litres"),
	}),
	...(data.technologyType === "RegularBoiler" && {
		"Standby heat loss": dim(data.heatLossStandby, "kilowatt hours per day"),
	}),
};
</script>

<template>
	<ProductDetails id="boiler" :data="tableData" />
</template>