<script setup lang="ts">
import type { PageId } from "~/data/pages/pages";
import type { AnyPcdbProduct } from "~/pcdb/pcdb.types";
import { productTypeMap, typeOfHeatEmitter, type HeatEmittingProductType, type PcdbProduct } from "~/stores/ecaasStore.schema";
import { heatEmittingProductTypesDisplay } from "~/utils/display";
import { sentenceToLowerCase } from "~/utils/string";
import { getRadiatorHeading, isConvectorRadiatorProduct } from "~/utils/convectorRadiator";
import { getUnderfloorHeatingHeading, isUnderfloorHeatingProduct } from "~/utils/underFloorHeating";

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

const { data: { value: data } } = await useFetch<AnyPcdbProduct>(`/api/products/${params.id}/details`, {
	query: {
		technologyType,
	},
});

const product = computed(() => data);
const radiatorProduct = computed(() => product.value && isConvectorRadiatorProduct(product.value) ? product.value : undefined);
const underFloorHeatingProduct = computed(() => product.value && isUnderfloorHeatingProduct(product.value) ? product.value : undefined);
const nonRadiatorProduct = computed(() => {
	if (!data) return undefined;
	if (isConvectorRadiatorProduct(data)) return undefined;
	if (isUnderfloorHeatingProduct(data)) return undefined;
	return data;
});

const productHeading = computed(() => {
	if (!data) {
		return "";
	}

	if (underFloorHeatingProduct.value) {
		return getUnderfloorHeatingHeading(underFloorHeatingProduct.value);
	}

	if (nonRadiatorProduct.value?.modelName) {
		return nonRadiatorProduct.value.modelName;
	}

	if (radiatorProduct.value) {
		return getRadiatorHeading(radiatorProduct.value);
	}


	return `Product ${params.id}`;
});

const productSubtitle = computed(() => {
	if (!data) {
		return "";
	}

	if (underFloorHeatingProduct.value) {
		return getUnderfloorHeatingSubtitle(underFloorHeatingProduct.value);
	}

	if (radiatorProduct.value) {
		return getRadiatorSubtitle(radiatorProduct.value);
	}

	if (nonRadiatorProduct.value?.brandName) {
		return nonRadiatorProduct.value.brandName;
	}

	return "";
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
	<h2 class="govuk-caption-l govuk-!-margin-top-0">{{ productSubtitle }}</h2>

	<ProductDetailsFanCoil v-if="!!nonRadiatorProduct && heatEmittingType === 'fanCoil'" :product="nonRadiatorProduct" />
	<ProductDetailsConvectorRadiator v-if="!!radiatorProduct && heatEmittingType === 'radiator'" :product="radiatorProduct" />
	<ProductDetailsUnderFloorHeating v-if="!!underFloorHeatingProduct" :product="underFloorHeatingProduct"/>
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