<script setup lang="ts">
import { useSelectHeatSourceProduct } from "~/composables/selectProduct";
import { page } from "~/data/pages/pages";
import { technologyGroups, type DisplayProduct, type TechnologyGroup } from "~/pcdb/pcdb.types";
import { productTypeMap, type EcaasForm, type HeatSourceData, type HeatSourceProductType } from "~/stores/ecaasStore.schema";

definePageMeta({ layout: false });

const route = useRoute();
const pageId = kebabToCamelCase(route.params.products as string);

const heatSourceProductType = pageId as (HeatSourceProductType | TechnologyGroup);

const { data: { value } } = await useFetch("/api/products", {
	query: {
		...(technologyGroups.includes(heatSourceProductType as TechnologyGroup) ? {
			technologyGroup: heatSourceProductType,
		} : {
			technologyType: productTypeMap[heatSourceProductType as HeatSourceProductType],
		}),
	},
});

const { title, index, searchModel, searchData } = useProductsPage("heatSource");
const { selectHeatSourceProduct } = useSelectHeatSourceProduct(value?.data ?? [], heatSourceProductType);

const { pagination } = searchData(value?.data ?? []);

const selectProduct = async (product: DisplayProduct) => {
	await selectHeatSourceProduct(
		product,
		(state) => state.spaceHeating.heatSource.data as EcaasForm<HeatSourceData>[],
		index,
	);

	navigateTo(page("heatSource").url.replace(":heatSource", `${index}`));
};
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<template v-if="heatSourceProductType === 'heatNetwork'">
		<ProductSearch
			:model="searchModel"
			:search-options="{
				networkName: 'Network name',
				productId: 'Product ID',
			}"
		>
			<FieldsProductSearch
				v-if="searchModel.searchOption !== 'productId'"
				id="searchTerm"
				name="searchTerm"
				label="Search network name"
				placeholder="Enter network name"
				:value="searchModel.searchTerm"
			/>
		</ProductSearch>
		<HeatNetworkProductsTable
			v-if="heatSourceProductType === 'heatNetwork'"
			:products="pagination.getData()"
			:total-pages="pagination.totalPages"
			:on-select-product="selectProduct"
		/>
	</template>
	<template v-else>
		<ProductSearch :model="searchModel" />
		<GovProductsTable
			:products="pagination.getData()"
			:total-pages="pagination.totalPages"
			:on-select-product="selectProduct"
		/>
	</template>
	<GovButton secondary :href="`/space-heating/heat-source/${index}`" test-id="backToHeatSourceButton">
		Back to heat source
	</GovButton>
</template>