<script setup lang="ts">
import { page } from "~/data/pages/pages";
import { productTypeMap, type HeatEmittingProductType, type PcdbProduct } from "~/stores/ecaasStore.schema";

definePageMeta({ layout: false });

const store = useEcaasStore();
const { pageId, title, index, searchModel, searchData } = useProductsPage("heatEmitter");

const { data: { value } } = await useFetch("/api/products", {
	query: {
		technologyType: productTypeMap[pageId as HeatEmittingProductType],
	},
});

const { pagination } = searchData(value?.data ?? []);

const selectProduct = (reference: string) => {
	store.$patch((state) => {
		const item = state.spaceHeating.heatEmitters.data[index];

		if (item) {
			(item.data as PcdbProduct).productReference = reference;
		}
	});

	navigateTo(page("heatEmitters").url.replace(":heatEmitter", `${index}`));
};
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<ProductSearch :model="searchModel" />
	<GovProductsTable
		:products="pagination.getData()"
		:total-pages="pagination.totalPages"
		:on-select-product="p => selectProduct(p.id)" />
	<GovButton secondary :href="`/space-heating/heat-emitting/${index}`" test-id="backToHeatEmittersButton">
		Back to heat emitters
	</GovButton>
</template>