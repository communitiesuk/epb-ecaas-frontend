<script setup lang="ts">
import { page } from "~/data/pages/pages";
import { productTypeMap, type MechanicalVentilationProductType, type PcdbProduct } from "~/stores/ecaasStore.schema";

definePageMeta({ layout: false });

const store = useEcaasStore();
const { pageId, title, index, searchModel, searchData } = useProductsPage("mechanical");
const heatSourceProductType = pageId as MechanicalVentilationProductType;

const { data: { value } } = await useFetch("/api/products", {
	query: {
		technologyType: productTypeMap[heatSourceProductType],
	},
});

const { pagination } = searchData(value?.data ?? []);

const selectProduct = (reference: string) => {
	store.$patch((state) => {

		const item = state.infiltrationAndVentilation.mechanicalVentilation.data[index];

		if (item) {
			(item.data as PcdbProduct).productReference = reference;
		}
	});

	navigateTo(page("mechanicalVentilationEdit").url.replace(":mechanical", `${index}`));
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
	<GovButton secondary :href="`/infiltration-and-ventilation/mechanical-ventilation/${index}`" test-id="backToMechanicalVentilationButton">
		Back to mechanical ventilation
	</GovButton>
</template>