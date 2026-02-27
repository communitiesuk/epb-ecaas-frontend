<script setup lang="ts">
import { productTypeMap, type WaterStorageProductType } from "#imports";
import type { DisplayProduct } from "~/pcdb/pcdb.types";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const { pageId, title, index, searchModel, searchData } = useProductsPage("waterstorage");

const { data: { value } } = await useFetch("/api/products", {
	query: {
		technologyType: productTypeMap[pageId as WaterStorageProductType],
	},
});

const { pagination } = searchData(value?.data ?? []);

const selectProduct = (product: DisplayProduct) => {
	store.$patch((state) => {
		(state.domesticHotWater.waterStorage.data[index]!.data as SmartHotWaterTankData).productReference = product.id;
	});

	navigateTo(getUrl("waterStorage").replace(":waterstorage", `${index}`));
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
		:on-select-product="p => selectProduct(p.id)"
	/>
	<GovButton
		secondary
		:href="`/domestic-hot-water/water-storage/${index}`"
		test-id="backToWaterStorageButton"
	>
		Back to water storage
	</GovButton>
</template>