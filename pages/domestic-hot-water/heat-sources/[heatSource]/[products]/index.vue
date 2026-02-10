<script setup lang="ts">
import { page } from "~/data/pages/pages";
import { productTypeMap } from "~/stores/ecaasStore.schema";

definePageMeta({ layout: false });

const store = useEcaasStore();
const { pageId, title, index, searchModel, searchData } = useProductsPage("heatSource");

const { data: { value } } = await useFetch("/api/products", {
	query: {
		technologyType: productTypeMap[pageId as HeatSourceProductType],
	},
});

const { productData, pagination } = searchData(value?.data ?? []);

const selectProduct = (reference: string) => {
	store.$patch((state) => {

		const item = state.domesticHotWater.heatSources.data[index];

		if (item) {
			const data = item.data as HeatSourceData;
			
			if (data.typeOfHeatSource === "heatNetwork" && !data.isHeatNetworkInPcdb) {
				return;
			}

			(item.data as PcdbProduct).productReference = reference;
		}
	});

	navigateTo(page("heatSources").url.replace(":heatSource", `${index}`));
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
	<GovButton secondary :href="`/domestic-hot-water/heat-sources/${index}`" test-id="backToHeatSourceButton">
		Back to heat source
	</GovButton>
</template>