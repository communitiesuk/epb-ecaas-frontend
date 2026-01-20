<script setup lang="ts">
import { page } from "~/data/pages/pages";

definePageMeta({ layout: false });

const store = useEcaasStore();
const { pageId, title, index, searchModel, searchData } = useProductsPage("heatSource");

const { data: { value } } = await useFetch("/api/products", {
	query: {
		technologyType: heatSourceProductTypeMap[pageId as HeatSourceProductType],
	},
});

const { productData, pagination } = searchData(value?.data ?? []);

const selectProduct = (reference: string) => {
	store.$patch((state) => {

		const item = state.spaceHeatingNew.heatSource.data[index];

		if (item) {
			const data = item.data as HeatSourceData;
			
			if (data.typeOfHeatSource === "heatNetwork" && !data.isHeatNetworkInPcdb) {
				return;
			}

			(item.data as HeatSourceProduct).productReference = reference;
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
	<ProductSearch v-if="!!productData" :products="productData" :model="searchModel" />
	<GovProductsTable
		:products="pagination.getData()"
		:total-pages="pagination.totalPages"
		:on-select-product="selectProduct" />
	<GovButton secondary :href="`/space-heating-new/heat-source/${index}`" test-id="backToHeatSourceButton">
		Back to heat source
	</GovButton>
</template>