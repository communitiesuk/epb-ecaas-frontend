<script setup lang="ts">
import { productTypeMap, type HeatNetworkProductType } from "#imports";
import type { DisplayProduct } from "~/pcdb/pcdb.types";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const { pageId, title, index, searchModel, searchData } = useProductsPage("heatNetwork");

const { data: { value } } = await useFetch("/api/products", {
	query: {
		technologyType: productTypeMap[pageId as HeatNetworkProductType],
	},
});

const { pagination } = searchData(value?.data ?? []);

const selectProduct = async (product: DisplayProduct) => {
	store.$patch((state) => {
		const heatNetworkData = state.spaceHeating.heatNetworks.data[index]!.data as HeatNetworkData;
		heatNetworkData.productReference = product.id.toString();
		heatNetworkData.subHeatNetworkName = product.subheatNetworkName;
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