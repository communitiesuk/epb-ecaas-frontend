<script setup lang="ts">
import { page } from "~/data/pages/pages";
import { heatPumpProductTypesMap, technologyGroups, type DisplayProduct, type HeatPumpProduct, type TechnologyGroup } from "~/pcdb/pcdb.types";
import { productTypeMap } from "~/stores/ecaasStore.schema";
import { getHeatNetworkProduct } from "~/utils/getHeatNetworkProduct";

definePageMeta({ layout: false });

const store = useEcaasStore();
const { pageId, title, searchModel, searchData } = useProductsPage("heatSource");

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


// TODO refactor out
const selectProduct = (product: DisplayProduct) => {
	store.$patch((state) => {

		const item = state.domesticHotWater.heatSources.data[0];

		if (item) {
			const data = item.data as HeatSourceData;
			
			if (data.typeOfHeatSource === "heatNetwork") {
				if (!data.isHeatNetworkInPcdb) return;
				const heatNetwork = value?.data.find(x => x.id === product.id);
				if (heatNetwork) {
					getHeatNetworkProduct(heatNetwork).then((item) => {
						if (item) {
							if ("fifthGHeatNetwork" in item && item.fifthGHeatNetwork === 1) {
								data.isFifthGeneration = true;
							}
						}
					});
				}
			} 
			

			if (data.typeOfHeatSource === "boiler") {
				data.needsSpecifiedLocation = product.boilerLocation === "unknown";
				delete data.specifiedLocation;
			}

			if (data.typeOfHeatSource === "heatPump") {
				const heatPumpProduct = product as HeatPumpProduct;
				data.typeOfHeatPump = heatPumpProductTypesMap[heatPumpProduct.technologyType];
			}

			(item.data as PcdbProduct).productReference = product.id;
		}
	});

	navigateTo(page("heatSources").url);
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
		:on-select-product="selectProduct" />
	<GovButton secondary href="/domestic-hot-water/heat-sources" test-id="backToHeatSourceButton">
		Back to heat source
	</GovButton>
</template>