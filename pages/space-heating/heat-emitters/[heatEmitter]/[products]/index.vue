<script setup lang="ts">
import { page } from "~/data/pages/pages";
import type { DisplayProduct } from "~/pcdb/pcdb.types";
import { productTypeMap, type HeatEmittingProductType, type PcdbProduct } from "~/stores/ecaasStore.schema";

definePageMeta({ layout: false });

const store = useEcaasStore();
const route = useRoute();
const { pageId, title, index, searchModel, searchData } = useProductsPage("heatEmitter");
const emitterIndex = route.query.emitterIndex != null ? Number(route.query.emitterIndex) : null;

const { data: { value } } = await useFetch("/api/products", {
	query: {
		technologyType: productTypeMap[pageId as HeatEmittingProductType],
	},
});

const products = ref<DisplayProduct[]>(value?.data ?? []);

const searchTerms = computed(() => {
	switch (pageId) {
		case "radiator":
			return {
				label: "Search type or height",
				placeholder: "Enter type or height",
			};
		case "underFloorHeating":	
			return {
				label: "Search system or spacing",
				placeholder: "Enter system or spacing",
			};
		default:
			return {
				label: "Search brand or model",
				placeholder: "Enter brand or model",
			};
	}
});

const searchOptions = computed(() => {
	switch (pageId) {
		case "radiator":
			return {
				modelAndBrand: "Type and height",
				productId: "Product ID",
			};
		case "underFloorHeating":
			return {
				modelAndBrand: "System and spacing",
				productId: "Product ID",
			};
		default:
			return {
				modelAndBrand: "Brand and model",
				productId: "Product ID",
			};
	}
});


const { pagination } = searchData(products.value);

const selectProduct = (reference: string) => {
	store.$patch((state) => {
		const item = state.spaceHeating.heatEmitters.data[index];

		if (item && emitterIndex != null) {
			const emitters = (item.data as { emitters: Record<string, unknown>[] }).emitters;
			const emitter = emitters[emitterIndex];
			if (emitter) {
				emitter.productReference = reference.toString();
			}
		} else if (item) {
			(item.data as PcdbProduct).productReference = reference.toString();;
		}
	});

	const returnUrl = emitterIndex != null
		? `${page("heatEmitters").url.replace(":heatEmitter", `${index}`)}?emitterIndex=${emitterIndex}`
		: page("heatEmitters").url.replace(":heatEmitter", `${index}`);

	navigateTo(returnUrl);
};
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<ProductSearch
		:model="searchModel"
		:search-options="searchOptions"
		:search-term-label="searchTerms.label"
		:search-term-placeholder="searchTerms.placeholder"
	/>
	<GovProductsTable
		:products="pagination.getData()"
		:total-pages="pagination.totalPages"
		:on-select-product="p => selectProduct(p.id.toString())" />
	<GovButton secondary :href="`/space-heating/heat-emitters/${index}`" test-id="backToHeatEmittersButton">
		Back to heat emitters
	</GovButton>
</template>