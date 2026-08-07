<script setup lang="ts">
import type { Product } from "~/pcdb/pcdb.types";

const { product: data } = defineProps<{
	product: Product;
}>();

const isHeatNetwork = computed(() => data?.technologyType === "HeatNetworks");
const title = isHeatNetwork.value ? (data as { communityHeatNetworkName?: string })?.communityHeatNetworkName : data?.modelName;
const subtitle = isHeatNetwork.value ? (data as { testData: { subheatNetworkName?: string } })?.testData?.subheatNetworkName : data?.brandName;
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>

	<h1 class="govuk-heading-l govuk-!-margin-bottom-0">{{ title }}</h1>
	<h2 class="govuk-caption-l govuk-!-margin-top-0">{{ subtitle }}</h2>

	<ProductDetailsHeatNetworks v-if="!!data" :product="data!" />
</template>