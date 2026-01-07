<script setup lang="ts">
definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const { pageId, title, index, searchModel, searchData } = useProductsPage("pump");

const { data: { value } } = await useFetch("/api/products", {
	query: {
		technologyType: pcdbTechnologyTypes[pageId as keyof typeof pcdbTechnologyTypes]
	}
});

const { productData, pagination } = searchData(value?.data ?? []);

const selectProduct = (reference: string) => {
	store.$patch((state) => {
		state.spaceHeating.heatGeneration.heatPump.data[index]!.data.productReference = reference;
	});

	navigateTo(getUrl("heatPump").replace(":pump", `${index}`));
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
		:onSelectProduct="selectProduct"
	/>
	<GovButton
		secondary
		:href="`/space-heating/heat-generation/heat-pump/${index}`"
		test-id="backToHeatPumpButton"
	>
		Back to heat pump
	</GovButton>
</template>