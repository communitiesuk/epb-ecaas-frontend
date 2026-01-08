<script setup lang="ts">
import { page } from "~/data/pages/pages";

definePageMeta({ layout: false });

const store = useEcaasStore();
const { pageId, title, index, searchModel, searchData } = useProductsPage("heatSource");

const { data: { value } } = await useFetch("/api/products", {
	query: {
		technologyType: pcdbTechnologyTypes[pageId as keyof typeof pcdbTechnologyTypes],
	},
});

const { productData, pagination } = searchData(value?.data ?? []);

const selectProduct = (reference: string) => {
	store.$patch((state) => {

		const item = state.spaceHeatingNew.heatSource.data[index]

		if (item) {
			const data = item.data as HeatSourceData
			if (data.typeOfHeatSource === HeatSourceType.heatPump) {
				data.productReference = reference
			}
			if (data.typeOfHeatSource === HeatSourceType.heatBattery) {
				data.productReference = reference
			}
			if (data.typeOfHeatSource === HeatSourceType.boiler) {
				data.productReference = reference
			}
			if (data.typeOfHeatSource === HeatSourceType.heatNetwork && data.isHeatNetworkInPcdb === true) {
				data.productReference
			}
		}
	});

	navigateTo(page("heatSource").url.replace(":heatSource", `${index}`));
};
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<ProductSearch :products="productData" :model="searchModel" />
	<GovProductsTable 
		:products="pagination.getData()"
		:total-pages="pagination.totalPages"
		:on-select-product="selectProduct"
	/>
	<GovButton
		secondary
		:href="`/space-heating-new/heat-source/${index}`"
		test-id="backToHeatSourceButton"
	>
		Back to heat source
	</GovButton>
</template>