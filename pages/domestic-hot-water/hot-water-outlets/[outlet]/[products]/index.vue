<script setup lang="ts">
import { page } from "~/data/pages/pages";
import type { DisplayProduct } from "~/pcdb/pcdb.types";
import type { ShowerProductType } from "~/stores/ecaasStore.schema";

definePageMeta({ layout: false });

const store = useEcaasStore();
const { pageId, title, index, searchModel, searchData } = useProductsPage("outlet");

const showerProductType = pageId as ShowerProductType;

const { data: { value } } = await useFetch("/api/products", {
	query: {
		technologyType: productTypeMap[showerProductType],
	},
});

const { pagination } = searchData(value?.data ?? []);

const selectProduct = async (product: DisplayProduct) => {
	store.$patch(state => {
		const hotWaterOutletData = state.domesticHotWater.hotWaterOutlets.data[index]?.data;

		if (!hotWaterOutletData) {
			return;
		}

		if (hotWaterOutletData.typeOfHotWaterOutlet === "mixedShower") {
			const showerData = hotWaterOutletData as MixedShowerData;

			if (product.technologyType === "AirPoweredShowers" && showerData.isAirPressureShower) {
				showerData.airPressureShowerProductReference = product.id;
			}

			if (product.technologyType === "InstantaneousWwhrSystem" && showerData.wwhrs) {
				showerData.wwhrsProductReference = product.id;
			}
		}
	});

	navigateTo(page("hotWaterOutlets").url.replace(":outlet", `${index}`));
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
	<GovButton secondary :href="page('hotWaterOutlets').url.replace(':outlet', `${index}`)" test-id="backToHotWaterOutletButton">
		Back to hot water outlet
	</GovButton>
</template>