<script setup lang="ts">
import { page } from "~/data/pages/pages";
import type { DisplayProduct } from "~/pcdb/pcdb.types";
import type { WwhrsProductType } from "~/stores/ecaasStore.schema";

definePageMeta({ layout: false });

const store = useEcaasStore();
const { pageId, title, index, searchModel, searchData } = useProductsPage("system");

const wwhrsProductType = pageId as WwhrsProductType;

const { data: { value } } = await useFetch("/api/products", {
	query: {
		technologyType: productTypeMap[wwhrsProductType],
	},
});

const { pagination } = searchData(value?.data ?? []);

const selectProduct = async (product: DisplayProduct) => {
	store.$patch(state => {
		const wwhrsData = state.domesticHotWater.wwhrs.data[index]?.data;

		if (!wwhrsData) {
			return;
		}

		wwhrsData.productReference = product.id;
	});

	navigateTo(page("wwhrs").url.replace(":system", `${index}`));
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
		:on-select-product="selectProduct" />
	<GovButton secondary :href="page('wwhrs').url.replace(':system', `${index}`)" test-id="backToWwhrsButton">
		Back to WWHRS
	</GovButton>
</template>