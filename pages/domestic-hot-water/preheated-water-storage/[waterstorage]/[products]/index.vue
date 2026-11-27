<script setup lang="ts">
import { productTypeMap, type WaterStorageProductType } from "#imports";
import type { DisplayProduct } from "~/pcdb/pcdb.types";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const { pageId, title, index, searchModel, searchData } = useProductsPage("waterstorage");

if (pageId !== "smartHotWaterTank") {
	throw createError({ statusCode: 404, statusMessage: "Product type not found" });
}

const { data: { value } } = await useFetch("/api/products", {
	query: {
		technologyType: productTypeMap[pageId as WaterStorageProductType],
	},
});

const { pagination } = searchData(value?.data ?? []);
const backUrl = getUrl("preheatedWaterStorage");

const selectProduct = (product: DisplayProduct) => {
	store.$patch((state) => {
		const item = state.domesticHotWater.preheatedWaterStorage.data[index];
		if (!item || item.data.typeOfWaterStorage !== "smartHotWaterTank") {
			throw createError({ statusCode: 404, statusMessage: "Smart preheated water tank not found" });
		}
		item.data = { ...item.data, productReference: product.id.toString() };
	});

	navigateTo(backUrl);
};
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<ProductSearch :model="searchModel" />
	<GovProductsTable
		:products="pagination.getData() ?? ['none']"
		:total-pages="pagination.totalPages"
		:on-select-product="selectProduct"
	/>
	<GovButton secondary :href="backUrl" test-id="backToWaterStorageButton">
		Back to preheated water storage
	</GovButton>
</template>
