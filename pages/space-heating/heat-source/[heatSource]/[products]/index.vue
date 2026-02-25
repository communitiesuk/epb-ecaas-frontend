<script setup lang="ts">
import { page } from "~/data/pages/pages";
import type { DisplayProduct } from "~/pcdb/pcdb.types";
import { productTypeMap, type PcdbProduct } from "~/stores/ecaasStore.schema";

definePageMeta({ layout: false });

const store = useEcaasStore();
const route = useRoute();
const pageId = kebabToCamelCase(route.params.products as string);

const heatSourceProductType = pageId as HeatSourceProductType;

const { data: { value } } = await useFetch("/api/products", {
	query: {
		technologyType: productTypeMap[heatSourceProductType],
	},
});

const { title, index, searchModel, searchData } = useProductsPage("heatSource");

const { pagination } = searchData(value?.data ?? []);

const selectProduct = (product: DisplayProduct) => {
	store.$patch((state) => {

		const item = state.spaceHeating.heatSource.data[index];

		if (item) {
			const data = item.data as HeatSourceData;

			if (data.typeOfHeatSource === "heatNetwork" &&
				data.usesHeatInterfaceUnits &&
				heatSourceProductType === "heatInterfaceUnit"
			) {
				data.heatInterfaceUnitProductReference = product.id;
				return;
			}
			
			if (data.typeOfHeatSource === "heatNetwork" && !data.isHeatNetworkInPcdb) {
				return;
			}
			
			if (data.typeOfHeatSource === "boiler") {
				if (product.boilerLocation === "internal") {
					data.locationOfBoiler = "heatedSpace";
					data.locationFromPcdb = true;
				} else {
					data.locationFromPcdb = false;
				}
			}

			(item.data as PcdbProduct).productReference = product.id;
		}
	});

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
				productId: 'Product ID',
				networkName: 'Network name'
			}"
		/>
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