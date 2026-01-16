<script setup lang="ts">
definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const { pageId, title, index, searchModel, searchData } = useProductsPage("waterstorage");

const { data: { value } } = await useFetch("/api/products", {
	query: {
		technologyType: pcdbTechnologyTypes[pageId as keyof typeof pcdbTechnologyTypes]
	}
});

const { productData, pagination } = searchData(value?.data ?? []);

const selectProduct = (reference: string) => {
	store.$patch((state) => {
		(state.domesticHotWaterNew.waterStorage.data[index]!.data as SmartHotWaterTankDataNew).productReference = reference;
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
		:onSelectProduct="selectProduct"
	/>
	<GovButton
		secondary
		:href="`/domestic-hot-water-new/water-storage/${index}`"
		test-id="backToWaterStorageButton"
	>
		Back to water storage
	</GovButton>
</template>