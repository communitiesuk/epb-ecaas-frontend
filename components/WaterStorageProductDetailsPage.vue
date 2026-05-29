<script setup lang="ts">
import type { Product } from "~/pcdb/pcdb.types";
import { typeOfWaterStorage } from "~/stores/ecaasStore.schema";

const { product: data } = defineProps<{
	product: Product;
	waterStorageType: string;
}>();
</script>

<template>
	<Head>
		<Title>{{ data?.modelName }}</Title>
	</Head>

	<h1 class="govuk-heading-l govuk-!-margin-bottom-0">{{ data?.modelName }}</h1>
	<h2 class="govuk-caption-l govuk-!-margin-top-0">{{ data?.brandName }}</h2>

	<ProductDetailsSmartHotWaterTank v-if="!!data && waterStorageType === typeOfWaterStorage.smartHotWaterTank" :product="data!" />
</template>