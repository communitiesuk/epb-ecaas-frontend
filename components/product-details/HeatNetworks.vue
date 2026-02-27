<script setup lang="ts">
import dayjs from "dayjs";
import type { HeatNetworkProduct, Product } from "~/pcdb/pcdb.types";

const { product } = defineProps<{ product: Product }>();
const data = product as HeatNetworkProduct;

const tableData: Record<string, string> = 
{
	"Percentage of heat 1": data.percentageOfHeat1?.toString() ?? "-",
	"Percentage of heat 2": data.percentageOfHeat2?.toString() ?? "-",
	"Percentage of heat 3": data.percentageOfHeat3?.toString() ?? "-",
	"Year": data.year?.toString() ?? "-",
	"Community heat network version number": data.communityHeatNetworkVersionNumber?.toString() ?? "-",
	"Heat source 1": data.heatSource1 ?? "-",
	"Heat source 2": data.heatSource2 ?? "-",
	"Number of subheat networks": data.numberOfSubheatNetworks?.toString() ?? "-",
	"Fifth G heat network": data.fifthGearHeatNetwork?.toString() ?? "-",
	"Validity end date": dayjs(data.validityEndDate?.replace("(GMT|BST)\\s", ""), "ddd MMM DD HH:mm:ss YYYY").format("L LT"),
	"Community heat network name": data.communityHeatNetworkName ?? "-",
	"Postcode of the primary energy centre": data.postcodeOfThePrimaryEnergyCentre ?? "-",
	"Description": data.descriptionOfNetwork ?? "-",
};
</script>

<template>
	<ProductDetails id="heatNetwork" :data="tableData" />
</template>