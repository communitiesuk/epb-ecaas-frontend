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

const heatSourceProductType = heatSourceType as HeatSourceProductType;

const technologyType = productTypeMap[heatSourceProductType];
const pageId = `${heatSourceType}Products` as PageId;
const productType = heatSourceProductTypesDisplay[heatSourceProductType];

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
		const item = state.spaceHeating.heatSource.data[index];

		if (item && data) {
			const heatSourceData = item.data as HeatSourceData;

			if (heatSourceData.typeOfHeatSource === "heatNetwork" &&
				heatSourceData.usesHeatInterfaceUnits &&
				heatSourceProductType === "heatInterfaceUnit"
			) {
				heatSourceData.heatInterfaceUnitProductReference = data.id;
				return;
			}

			const product = item.data as PcdbProduct;
			product.productReference = data.id;
		}
	});

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

	<ProductDetailsHeatPump v-if="!!data && heatSourceType in heatPumpTypes" :product="data!" />
	<ProductDetailsBoiler v-if="!!data && heatSourceType in boilerTypes" :product="data!"/>
	<ProductDetailsHeatBatteryPCM v-if="!!data && heatSourceType === typeOfHeatSource.heatBatteryPcm" :product="data!" />
	<ProductDetailsHeatBatteryDryCore v-if="!!data && heatSourceType === typeOfHeatSource.heatBatteryDryCore" :product="data!" />
	<ProductDetailsHeatInterfaceUnit v-if="!!data && heatSourceType === typeOfHeatSource.heatInterfaceUnit" :product="data!" />

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