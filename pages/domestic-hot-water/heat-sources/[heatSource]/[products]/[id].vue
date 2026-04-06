<script setup lang="ts">
import type { PageId } from "~/data/pages/pages";
import { technologyGroups, type DisplayProduct, type TechnologyGroup } from "~/pcdb/pcdb.types";
import { productTypeMap, typeOfHeatSource } from "~/stores/ecaasStore.schema";
import { boilerTypes, heatSourceProductTypesDisplay } from "~/utils/display";
import { sentenceToLowerCase } from "~/utils/string";

definePageMeta({ layout: "one-column" });

const router = useRouter();
const { params } = useRoute();

const heatSourceType = kebabToCamelCase(params.products as string);

if (!(heatSourceType in productTypeMap) && !technologyGroups.includes(heatSourceType as TechnologyGroup)) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product type not found",
	});
}

const pageId = `${heatSourceType}Products` as PageId;
const heatSourceProductType = heatSourceType as (HeatSourceProductType | TechnologyGroup);
const productType = heatSourceProductTypesDisplay[heatSourceProductType];

const index = Number(params.heatSource);
const { data: { value: data } } = await useFetch(`/api/products/${params.id}/details`);

const { selectHotWaterHeatSourceProduct } = useSelectHeatSourceProduct(data ? [data as DisplayProduct] : [], heatSourceProductType);

const backUrl = getUrl(pageId)
	.replace(":heatSource", params.heatSource as string);

const selectProduct = async () => {
	await selectHotWaterHeatSourceProduct(
		data as DisplayProduct,
		(state) => state.domesticHotWater.heatSources.data,
		index,
	);

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

	<ProductDetailsHybridHeatPump v-if="!!data && data.technologyType === 'HybridHeatPump'" :product="data" />
	<ProductDetailsHotWaterHeatPump v-else-if="data?.technologyType === 'HotWaterOnlyHeatPump'" :product="data" />
	<ProductDetailsHeatPump v-else-if="!!data && technologyGroups.includes(data.technologyGroup as TechnologyGroup)" :product="data" />

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