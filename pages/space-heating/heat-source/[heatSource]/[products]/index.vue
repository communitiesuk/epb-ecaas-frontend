<script setup lang="ts">
import { useSelectHeatSourceProduct } from "~/composables/selectProduct";
import { page } from "~/data/pages/pages";
import { EcaasError } from "~/errors.types";
import { technologyGroups, type DisplayProduct, type TechnologyGroup } from "~/pcdb/pcdb.types";
import { productTypeMap, type EcaasForm, type HeatSourceData, type HeatSourceProductType } from "~/stores/ecaasStore.schema";

definePageMeta({ layout: false });

const store = useEcaasStore();
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

const heatNetwork = computed(() =>
	store.spaceHeating.heatNetworks.data[index]?.data,
);


const filteredProducts = computed(() => {
	const products = value?.data ?? [];

	const requiresBoosterHeatPump =
		heatNetwork.value?.typeOfHeatNetwork === "communalHeatNetwork" &&
		heatNetwork.value?.boosterHeatPump === true;


	if (requiresBoosterHeatPump) {
		return products.filter(
			product => product.technologyType === "BoosterHeatPump",
		);
	}

	return products;
});

const { pagination } = searchData(filteredProducts.value);

const selectProduct = async (product: DisplayProduct) => {
	const redirectUrl = page("heatSource").url.replace(":heatSource", `${index}`);

	try {
		await selectHeatSourceProduct(
			{ ...product, id: product.id.toString() },
			(state) => state.spaceHeating.heatSource.data as EcaasForm<HeatSourceData>[],
			index,
		);

		navigateTo(redirectUrl);
	} catch (error) {
		if (error instanceof EcaasError && error.name === "DHW_HEAT_SOURCE_CONFLICT") {
			navigateTo(`${redirectUrl}?error=${error.name}`);
		}
	}
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
		:on-select-product="selectProduct"
	/>
	<GovButton secondary :href="`/space-heating/heat-source/${index}`" test-id="backToHeatSourceButton">
		Back to heat source
	</GovButton>
</template>