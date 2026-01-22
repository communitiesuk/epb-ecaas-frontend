<script setup lang="ts">
import type { PageId } from "~/data/pages/pages";
import { typeOfHeatSource } from "~/stores/ecaasStore.schema";
import { boilerTypes, heatPumpTypes, heatSourceProductTypesDisplay } from "~/utils/display";
import { sentenceToLowerCase } from "~/utils/string";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const router = useRouter();
const { params } = useRoute();

const heatSourceType = kebabToCamelCase(params.products as string);

if (!(heatSourceType in heatSourceProductTypeMap)) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product type not found",
	});
}

const technologyType = heatSourceProductTypeMap[heatSourceType as HeatSourceProductType];
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
		const item = state.spaceHeatingNew.heatSource.data[index];

		if (item && data) {
			const product = item.data as HeatSourceProduct;
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