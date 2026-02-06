<script setup lang="ts">
import { page } from "~/data/pages/pages";
import { productTypeMap, type PcdbProduct } from "~/stores/ecaasStore.schema";

definePageMeta({ layout: false });

const store = useEcaasStore();
const { pageId, title, index, searchModel, searchData } = useProductsPage("heatSource");
const heatSourceProductType = pageId as HeatSourceProductType;

const { data: { value } } = await useFetch("/api/products", {
	query: {
		technologyType: productTypeMap[heatSourceProductType],
	},
});

const { productData, pagination } = searchData(value?.data ?? []);

const selectProduct = (reference: string) => {
	store.$patch((state) => {

		const item = state.spaceHeating.heatSource.data[index];

		if (item) {
			const data = item.data as HeatSourceData;

			if (data.typeOfHeatSource === "heatNetwork" &&
				data.usesHeatInterfaceUnits &&
				heatSourceProductType === "heatInterfaceUnit"
			) {
				data.heatInterfaceUnitProductReference = reference;
				return;
			}
			
			if (data.typeOfHeatSource === "heatNetwork" && !data.isHeatNetworkInPcdb) {
				return;
			}

			(item.data as PcdbProduct).productReference = reference;
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
	<GovButton secondary :href="`/space-heating/heat-source/${index}`" test-id="backToHeatSourceButton">
		Back to heat source
	</GovButton>
</template>