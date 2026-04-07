<script setup lang="ts">
import type { PageId } from "~/data/pages/pages";
import { technologyGroups, type DisplayProduct, type TechnologyGroup } from "~/pcdb/pcdb.types";
import { productTypeMap, typeOfHeatSource, type EcaasForm, type HeatSourceData, type HeatSourceProductType } from "~/stores/ecaasStore.schema";
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

const { selectHeatSourceProduct } = useSelectHeatSourceProduct(data ? [data as DisplayProduct] : [], heatSourceProductType);

const backUrl = getUrl(pageId)
	.replace(":heatSource", params.heatSource as string);

const selectProduct = async () => {
	await selectHeatSourceProduct(
		{ ...data, id: data?.id.toString() } as DisplayProduct,
		(state) => state.spaceHeating.heatSource.data as EcaasForm<HeatSourceData>[],
		index,
	);

	navigateTo(getUrl("heatSource").replace(":heatSource", `${index}`));
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
	<ProductDetailsHeatPump v-else-if="!!data && technologyGroups.includes(data.technologyGroup as TechnologyGroup)" :product="data!" />

	<ProductDetailsBoiler v-if="!!data && heatSourceType in boilerTypes" :product="data!"/>
	<ProductDetailsHeatBatteryPCM v-if="!!data && heatSourceType === typeOfHeatSource.heatBatteryPcm" :product="data!" />
	<ProductDetailsHeatBatteryDryCore v-if="!!data && heatSourceType === typeOfHeatSource.heatBatteryDryCore" :product="data!" />
	<ProductDetailsHeatInterfaceUnit v-if="!!data && heatSourceType === typeOfHeatSource.heatInterfaceUnit" :product="data!" />
	<ProductDetailsHeatNetworks v-if="!!data && heatSourceType === typeOfHeatSource.heatNetwork" :product="data!" />

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