<script setup lang="ts">
import { page } from "~/data/pages/pages";
import { technologyGroups, type DisplayProduct, type TechnologyGroup } from "~/pcdb/pcdb.types";
import { productTypeMap } from "~/stores/ecaasStore.schema";

definePageMeta({ layout: false });

const { pageId, title, index, searchModel, searchData } = useProductsPage("heatSource");

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

const { selectHotWaterHeatSourceProduct } = useSelectHeatSourceProduct(value?.data ?? [], heatSourceProductType);

if (heatSourceProductType === "heatPump") {
	const hWOHPValue = (await useFetch("/api/products", {
		query: {
			technologyType: productTypeMap["hotWaterOnly"],
		},
	})).data.value;
	if (hWOHPValue && value) {
		value.data = value.data.concat(hWOHPValue.data);
	}
}

const { pagination } = searchData(value?.data ?? []);

const selectProduct = async (product: DisplayProduct) => {
	await selectHotWaterHeatSourceProduct(
		{ ...product, id: product.id.toString() },
		(state) => state.domesticHotWater.heatSources.data,
		index,
	);

	navigateTo(page("heatSources").url.replace(":heatSource", `${index}`));
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
				id="searchTerm"
				name="searchTerm"
				label="Search network name"
				placeholder="Enter network name"
				:value="searchModel.searchTerm"
			/>
		</ProductSearch>
		<HeatNetworkProductsTable
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
			:on-select-product="selectProduct" />
	</template>
	<GovButton secondary :href="`/domestic-hot-water/heat-sources/${index}`" test-id="backToHeatSourceButton">
		Back to heat source
	</GovButton>
</template>