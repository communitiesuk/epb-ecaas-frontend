<script setup lang="ts">
import type { Product } from "~/pcdb/pcdb.types";

const { product: data } = defineProps<{ product: Product }>();
</script>

<template>
	<Head>
		<Title>{{ data?.modelName }}</Title>
	</Head>

	<h1 class="govuk-heading-l govuk-!-margin-bottom-0">{{ data?.modelName }}</h1>
	<h2 class="govuk-caption-l govuk-!-margin-top-0">{{ data?.brandName }}</h2>

	<ProductDetailsAirPressureShower v-if="!!data && data.technologyType === 'AirPoweredShowers'" :product="data" />
	<ProductDetailsWwhrs v-if="!!data && data.technologyType === 'InstantaneousWwhrSystem'" :product="data" />
</template>