<script setup lang="ts">
import type { AnyPcdbProduct } from "~/pcdb/pcdb.types";
import { typeOfHeatEmitter } from "~/stores/ecaasStore.schema";
import { getRadiatorHeading, isConvectorRadiatorProduct } from "~/utils/convectorRadiator";
import { getUnderFloorHeatingHeading, isUnderFloorHeatingProduct, getUnderFloorHeatingSubtitle } from "~/utils/underFloorHeating";
import HemDefaultProductInset from "./HemDefaultProductInset.vue";

const { product: data } = defineProps<{
	product: AnyPcdbProduct;
	heatEmittingType: string
}>();

const { params } = useRoute();

const product = computed(() => data);
const radiatorProduct = computed(() => product.value && isConvectorRadiatorProduct(product.value) ? product.value : undefined);
const underFloorHeatingProduct = computed(() => product.value && isUnderFloorHeatingProduct(product.value) ? product.value : undefined);
const nonRadiatorProduct = computed(() => {
	if (!data) return undefined;
	if (isConvectorRadiatorProduct(data)) return undefined;
	if (isUnderFloorHeatingProduct(data)) return undefined;
	return data;
});

const productHeading = computed(() => {
	if (!data) {
		return "";
	}

	if (underFloorHeatingProduct.value) {
		return getUnderFloorHeatingHeading(underFloorHeatingProduct.value);
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
		return getUnderFloorHeatingSubtitle(underFloorHeatingProduct.value);
	}

	if (radiatorProduct.value) {
		return getRadiatorSubtitle(radiatorProduct.value);
	}

	if (nonRadiatorProduct.value?.brandName) {
		return nonRadiatorProduct.value.brandName;
	}

	return "";
});
</script>

<template>
	<Head>
		<Title>{{ productHeading }}</Title>
	</Head>

	<h1 class="govuk-heading-l govuk-!-margin-bottom-0">{{ productHeading }}</h1>
	<h2 class="govuk-caption-l govuk-!-margin-top-0">{{ productSubtitle }}</h2>

	<HemDefaultProductInset />

	<ProductDetailsFanCoil v-if="!!nonRadiatorProduct && heatEmittingType === 'fanCoil'" :product="nonRadiatorProduct" />
	<ProductDetailsConvectorRadiator v-if="!!radiatorProduct && heatEmittingType === 'radiator'" :product="radiatorProduct" />
	<ProductDetailsUnderFloorHeating v-if="!!underFloorHeatingProduct" :product="underFloorHeatingProduct"/>
	<ProductDetailsElectricStorageHeater v-if="!!nonRadiatorProduct && heatEmittingType === typeOfHeatEmitter.electricStorageHeater" :product="nonRadiatorProduct" />
</template>