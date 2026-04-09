<script setup lang="ts">
import type { PageId } from "~/data/pages/pages";
import type { ConvectorRadiatorProduct, Product } from "~/pcdb/pcdb.types";
import { productTypeMap, typeOfHeatEmitter, type HeatEmittingProductType, type PcdbProduct } from "~/stores/ecaasStore.schema";
import { heatEmittingProductTypesDisplay } from "~/utils/display";
import { sentenceToLowerCase } from "~/utils/string";
import { getRadiatorHeading, isConvectorRadiatorProduct } from "~/utils/convectorRadiator";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const router = useRouter();
const { params, query } = useRoute();
const emitterIndex = query.emitterIndex != null ? Number(query.emitterIndex) : null;

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

const { data: { value: data } } = await useFetch<Product | ConvectorRadiatorProduct>(`/api/products/${params.id}/details`, {
	query: {
		technologyType,
	},
});

const radiatorProduct = computed(() => data && isConvectorRadiatorProduct(data) ? data : undefined);
const nonRadiatorProduct = computed(() => data && !isConvectorRadiatorProduct(data) ? data : undefined);

const productHeading = computed(() => {
	if (!data) {
		return "";
	}

	if (nonRadiatorProduct.value?.modelName) {
		return nonRadiatorProduct.value.modelName;
	}

	if (radiatorProduct.value) {
		return getRadiatorHeading(radiatorProduct.value);
	}

	return `Product ${params.id}`;
});

const backUrl = getUrl(pageId)
	.replace(":heatEmitter", params.heatEmitter as string);

const selectProduct = () => {
	store.$patch((state) => {
		const selectedReference = String(params.id);
		const item = state.spaceHeating.heatEmitters.data[index];

		if (item && data && emitterIndex != null) {
			const emitters = (item.data as { emitters: Record<string, unknown>[] }).emitters;
			const emitter = emitters[emitterIndex];
			if (emitter) {
				emitter.productReference = selectedReference;
			}
		} else if (item && data) {
			const product = item.data as PcdbProduct;
			product.productReference = selectedReference;
		}
	});

	const returnUrl = emitterIndex != null
		? `${getUrl("heatEmitters").replace(":heatEmitter", `${index}`)}?emitterIndex=${emitterIndex}`
		: getUrl("heatEmitters").replace(":heatEmitter", `${index}`);

	navigateTo(returnUrl);
};
</script>

<template>
	<Head>
		<Title>{{ productHeading }}</Title>
	</Head>

	<NuxtLink :href="backUrl" class="govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-5" data-testid="backLink" @click="router.back()">
		{{ productType ? `Back to ${sentenceToLowerCase(productType(true))}` : 'Back' }}
	</NuxtLink>

	<h1 class="govuk-heading-l govuk-!-margin-bottom-0">{{ productHeading }}</h1>
	<h2 v-if="nonRadiatorProduct?.brandName" class="govuk-caption-l govuk-!-margin-top-0">{{ nonRadiatorProduct.brandName }}</h2>

	<ProductDetailsFanCoil v-if="!!nonRadiatorProduct && heatEmittingType === 'fanCoil'" :product="nonRadiatorProduct" />
	<ProductDetailsConvectorRadiator v-if="!!radiatorProduct && heatEmittingType === 'radiator'" :product="radiatorProduct" />
	<ProductDetailsElectricStorageHeater v-if="!!nonRadiatorProduct && heatEmittingType === typeOfHeatEmitter.electricStorageHeater" :product="nonRadiatorProduct" />

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