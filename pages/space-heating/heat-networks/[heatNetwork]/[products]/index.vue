<script setup lang="ts">
import { productTypeMap } from "#imports";
import type { DisplayProduct } from "~/pcdb/pcdb.types";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const { title, index, searchModel, searchData } = useProductsPage("heatNetwork");

const { data: { value } } = await useFetch("/api/products", {
	query: {
		technologyType: productTypeMap["heatNetwork"],
	},
});


const hasBoosterHeatPump = computed(() =>
	store.spaceHeating.heatSource.data.some(
		heatSource =>
			heatSource.data.typeOfHeatSource === "heatPump" &&
			"typeOfHeatPump" in heatSource.data &&
			heatSource.data.typeOfHeatPump === "booster",
	)
	||
	store.domesticHotWater.heatSources.data.some(
		heatSource =>
			heatSource.data.isExistingHeatSource === false &&
			heatSource.data.typeOfHeatSource === "heatPump" &&
			heatSource.data.typeOfHeatPump === "booster",
	),
);

const hasHeatInterfaceUnit = computed(() =>
	store.spaceHeating.heatSource.data.some(
		heatSource => heatSource.data.typeOfHeatSource === "heatInterfaceUnit",
	)
	||
	store.domesticHotWater.heatSources.data.some(
		heatSource =>
			heatSource.data.isExistingHeatSource === false &&
			heatSource.data.typeOfHeatSource === "heatInterfaceUnit",
	),
);


const filteredProducts = computed(() => {
	const products = value?.data ?? [];

	if (hasBoosterHeatPump.value) {
		return products.filter(
			product => product.boosterHeatPump === true,
		);
	} 

	if (hasHeatInterfaceUnit.value) {
		return products.filter(product => product.boosterHeatPump !== true);
	}
	return products;
});


const { pagination } = searchData(filteredProducts.value);

const selectProduct = async (product: DisplayProduct) => {
	store.$patch((state) => {
		const heatNetworkData = state.spaceHeating.heatNetworks.data[index]!.data as HeatNetworkData;
		heatNetworkData.productReference = product.id.toString();
		heatNetworkData.subHeatNetworkName = product.subheatNetworkName;
		heatNetworkData.boosterHeatPump = product.boosterHeatPump;
	});

	navigateTo(getUrl("heatNetworks").replace(":heatNetwork", `${index}`));
};

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<ProductSearch
		:model="searchModel"
		:search-options="{
			networkName: 'Network name',
			productId: 'Product ID',
		}"
		search-term-label="Search network or subnetwork"
		search-term-placeholder="Enter network or subnetwork"
	/>
	<HeatNetworkProductsTable
		:products="pagination.getData()"
		:total-pages="pagination.totalPages"
		:on-select-product="selectProduct"
	/>
	<GovButton secondary :href="`/space-heating/heat-networks/${index}`" test-id="backToHeatNetworkButton">
		Back to heat network
	</GovButton>
</template>