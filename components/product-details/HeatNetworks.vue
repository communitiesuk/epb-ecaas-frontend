<script setup lang="ts">
import dayjs from "dayjs";
import type { HeatNetworkProduct, Product } from "~/pcdb/pcdb.types";

type HeatNetworkTestData = {
	emissionsFactorkgCO2ekWhincludingOutOfScopeEmissions?: number | null;
	productID?: number | string | null;
	distributionLossFactor?: number | null;
	pumpingElectricalEnergyPerSubheatNetwork?: number | null;
	pumpingEnergyFactor?: number | null;
	id?: string;
	heatNetworkId?: number | string | null;
	primaryEnergyFactorkWhkWhDelivered?: number | null;
	subheatNetworkName?: string | null;
	emissionsFactorkgCO2ekWh?: number | null;
	costOfHeat?: number | null;
};

type HeatNetworkDetailsProduct = HeatNetworkProduct & {
	serviceProvision?: number | null;
	boosterHeatPump?: boolean | null;
	dataSource?: number | null;
	status?: number | null;
	productID?: number | string | null;
	heatNetworkId?: number | string | null;
	testData?: HeatNetworkTestData | HeatNetworkTestData[] | null;
};

const { product } = defineProps<{ product: Product }>();
const rawData = product as HeatNetworkDetailsProduct;
function flattenHeatNetworkData(value: HeatNetworkDetailsProduct): HeatNetworkDetailsProduct & HeatNetworkTestData {
	const nested = Array.isArray(value.testData) ? value.testData[0] : value.testData;

	if (!nested) {
		return value;
	}
	const { testData, ...rest } = value;
	return {
		...rest,
		...nested,
	};
}

function formatDate(value: string | null | undefined): string {
	if (!value) {
		return show(value);
	}

	const parsed = dayjs(value);
	return parsed.isValid() ? parsed.format("DD MMM YYYY") : value;
}
const withSuffix = (amount: number | null | undefined, suffix: string): string => {
	if (amount === null || amount === undefined) {
		return show(amount);
	}
	return `${amount} ${suffix}`;
};

const data = flattenHeatNetworkData(rawData);

const tableData: Record<string, string> = {
	"First year of use": show(data.year),
	"Heat source 1": show(formatData(data?.heatSource1 ?? "", true) as string),
	"Percentage of heat from heat source 1": renderPercentageValue(data.percentageOfHeat1),
	"Heat source 2": show(data.heatSource2),
	"Percentage of heat from heat source 2": renderPercentageValue(data.percentageOfHeat2),
	"Version": show(data.communityHeatNetworkVersionNumber),
	"Service provision": displayHeatNetworkServiceProvision(data.serviceProvision),
	"Booster heat pump required": displayBoolean(data.boosterHeatPump ?? undefined),
	"Emissions factor": dim(data.emissionsFactorkgCO2ekWh, "CO2 per kilowatt-hour"),
	"Emission factor including out of scope emissions": dim(data.emissionsFactorkgCO2ekWhincludingOutOfScopeEmissions, "CO2 per kilowatt-hour"),
	"Electricity used for pumping in the subnetwork": dim(data.pumpingElectricalEnergyPerSubheatNetwork, "kilowatt hours per year"),
	"Electrical energy used for pumping as a fraction of the heat energy supplied": show(data.pumpingEnergyFactor),
	"Product ID": show(data.productID),
	"Subnetwork ID": show(data.id),
	"Heat network ID": show(data.heatNetworkId),
	"Cost of heat": dim(data.costOfHeat, "pence per kilowatt-hour"),
	"Validity expires": formatDate(data.validityEndDate),
	"Postcode of the primary energy centre": show(data.postcodeOfThePrimaryEnergyCentre),
	"Data type": displayHeatNetworkDataSource(data.dataSource),
	"Average primary energy factor of heat that is delivered to customers": withSuffix(data.primaryEnergyFactorkWhkWhDelivered, "kWh per kWh delivered"),
	"Distribution loss factor": show(data.distributionLossFactor),
	"Description of network": show(data.descriptionOfNetwork),
};
</script>

<template><ClientOnly>

	<ProductDetails id="heatNetwork" :data="tableData" />
</ClientOnly>
</template>