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
	<ProductSearch :model="searchModel" />
	<GovProductsTable
		:products="pagination.getData()"
		:total-pages="pagination.totalPages"
		:on-select-product="p => selectProduct(p.id.toString())" />
	<GovButton secondary :href="`/space-heating/heat-emitters/${index}`" test-id="backToHeatEmittersButton">
		Back to heat emitters
	</GovButton>
</template>