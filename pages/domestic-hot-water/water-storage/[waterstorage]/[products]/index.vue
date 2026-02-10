<script setup lang="ts">
import { productTypeMap, type WaterStorageProductType } from "#imports";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const { pageId, title, index, searchModel, searchData } = useProductsPage("waterstorage");

const { data: { value } } = await useFetch("/api/products", {
	query: {
		technologyType: productTypeMap[pageId as WaterStorageProductType],
	},
});

const { productData, pagination } = searchData(value?.data ?? []);

const selectProduct = (reference: string) => {
	store.$patch((state) => {
		(state.domesticHotWater.waterStorage.data[index]!.data as SmartHotWaterTankDataNew).productReference = reference;
	});

	navigateTo(getUrl("waterStorage").replace(":waterstorage", `${index}`));
};
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<ProductSearch :products="productData" :model="searchModel" />
	<GovProductsTable
		:products="pagination.getData() ?? ['none']"
		:total-pages="pagination.totalPages"
		:on-select-product="selectProduct"
	/>
	<GovButton
		secondary
		:href="`/domestic-hot-water/water-storage/${index}`"
		test-id="backToWaterStorageButton"
	>
		Back to water storage
	</GovButton>
</template>