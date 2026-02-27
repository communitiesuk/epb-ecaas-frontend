<script setup lang="ts">
import type { PageId } from "~/data/pages/pages";
import { productTypeMap, typeOfHeatEmitter, type HeatEmittingProductType, type PcdbProduct } from "~/stores/ecaasStore.schema";
import { heatEmittingProductTypesDisplay } from "~/utils/display";
import { sentenceToLowerCase } from "~/utils/string";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const router = useRouter();
const { params } = useRoute();

const heatEmittingType = kebabToCamelCase(params.products as string);

if (!(heatEmittingType in productTypeMap)) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product type not found",
	});
}

const technologyType = productTypeMap[heatEmittingType as HeatEmittingProductType];
const pageId = `${heatEmittingType}Products` as PageId;
const productType = heatEmittingProductTypesDisplay[heatEmittingType as HeatEmittingProductType];

const index = Number(params.heatEmitter);

const { data: { value: data } } = await useFetch(`/api/products/${params.id}/details`, {
	query: {
		technologyType,
	},
});

const backUrl = getUrl(pageId)
	.replace(":heatEmitter", params.heatEmitter as string);

const selectProduct = () => {
	store.$patch((state) => {
		const item = state.spaceHeating.heatEmitters.data[index];

		if (item && data) {
			const product = item.data as PcdbProduct;
			product.productReference = data.id;
		}
	});

	navigateTo(getUrl("heatEmitters").replace(":heatEmitter", `${index}`));
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

	<ProductDetailsFanCoil v-if="!!data && heatEmittingType === typeOfHeatEmitter.fanCoil" :product="data!" />
	<ProductDetailsElectricStorageHeater v-if="!!data && heatEmittingType === typeOfHeatEmitter.electricStorageHeater" :product="data!" />
	<ProductDetailsInstantElectricHeater v-if="!!data && heatEmittingType === typeOfHeatEmitter.instantElectricHeater" :product="data!" />

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