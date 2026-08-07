<script setup lang="ts">
import HeatNetworkProductDetailsPage from "~/components/HeatNetworkProductDetailsPage.vue";
import type { Product } from "~/pcdb/pcdb.types";

definePageMeta({ layout: "one-column" });

const router = useRouter();
const { params } = useRoute();

const heatNetwork = kebabToCamelCase(params.products as string);

if (!(heatNetwork in productTypeMap)) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product type not found",
	});
}

const data = await useProductDetails(params.id as string);

const backUrl = getUrl("heatNetworks")
	.replace(":heatNetwork", params.heatNetwork as string);
</script>

<template>
	<NuxtLink :href="backUrl" class="govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-5" data-testid="backLink" @click="router.back()">
		Back to heat network
	</NuxtLink>

	<HeatNetworkProductDetailsPage :product="(data as Product)"/>

	<div class="govuk-button-group">
		<GovButton
			secondary
			:href="backUrl"
			test-id="backToHeatNetworkButton"
			@click="router.back()"
		>
			Back to heat network
		</GovButton>
	</div>
</template>