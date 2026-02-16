<script setup lang="ts">
import type { PageId } from "~/data/pages/pages";
import { productTypeMap, typeOfHeatSource, type HeatSourceData, type PcdbProduct } from "~/stores/ecaasStore.schema";
import { boilerTypes, heatPumpTypes, heatSourceProductTypesDisplay } from "~/utils/display";
import { sentenceToLowerCase } from "~/utils/string";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const router = useRouter();
const { params } = useRoute();

const heatSourceType = kebabToCamelCase(params.products as string);

if (!(heatSourceType in productTypeMap)) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product type not found",
	});
}

const technologyType = productTypeMap[heatSourceType as HeatSourceProductType];
const pageId = `${heatSourceType}Products` as PageId;
const productType = heatSourceProductTypesDisplay[heatSourceType as HeatSourceProductType];

const index = Number(params.heatSource);

const { data: { value: data } } = await useFetch(`/api/products/${params.id}/details`, {
	query: {
		technologyType,
	},
});

const backUrl = getUrl(pageId)
	.replace(":heatSource", params.heatSource as string);

const selectProduct = () => {
	store.$patch((state) => {
		const item = state.domesticHotWater.heatSources.data[index];
		const heatSourceData = item?.data as HeatSourceData;

		if (heatSourceData.typeOfHeatSource === "boiler" && (data?.technologyType === "CombiBoiler" || data?.technologyType === "RegularBoiler")) {
			if (data.boilerLocation === "internal") {
				heatSourceData.locationOfBoiler = "heatedSpace";
				heatSourceData.locationFromPcdb = true;
			} else {
				heatSourceData.locationFromPcdb = false;
			}
		}

		if (item && data) {
			const product = item.data as PcdbProduct;
			product.productReference = data.id;
		}
	});

	navigateTo(getUrl("heatSources").replace(":heatSource", `${index}`));
};
</script>

<template>
	<Head>
		<Title>{{ data?.modelName }}</Title>
	</Head>

	<NuxtLink :href="backUrl" class="govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-5" data-testid="backLink" @click="router.back()">
		{{ productType ? `Back to ${sentenceToLowerCase(productType(true))}` : 'Back' }}
	</NuxtLink>

	<h1 class="govuk-heading-l govuk-!-margin-bottom-0">{{ data?.modelName }}</h1>
	<h2 class="govuk-caption-l govuk-!-margin-top-0">{{ data?.brandName }}</h2>

	<ProductDetailsHeatPump v-if="!!data && heatSourceType in heatPumpTypes" :product="data!" />
	<ProductDetailsBoiler v-if="!!data && heatSourceType in boilerTypes" :product="data!"/>
	<ProductDetailsHeatBatteryPCM v-if="!!data && heatSourceType === typeOfHeatSource.heatBatteryPcm" :product="data!" />
	<ProductDetailsHeatBatteryDryCore v-if="!!data && heatSourceType === typeOfHeatSource.heatBatteryDryCore" :product="data!" />

	<div class="govuk-button-group">
		<GovButton
			test-id="selectProductButton"
			@click="selectProduct"
		>
			Select {{ productType && sentenceToLowerCase(productType(false)) }}
		</GovButton>
		<GovButton
			secondary
			:href="backUrl"
			test-id="backToHeatPumpButton"
			@click="router.back()"
		>
			Back to {{ productType && sentenceToLowerCase(productType(true)) }}
		</GovButton>
	</div>
</template>