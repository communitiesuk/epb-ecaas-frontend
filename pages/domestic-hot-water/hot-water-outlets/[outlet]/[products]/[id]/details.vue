<script setup lang="ts">
import type { Product } from "~/pcdb/pcdb.types";

definePageMeta({ layout: "one-column" });

const router = useRouter();
const { params } = useRoute();

const showerProduct = kebabToCamelCase(params.products as string);

if (!(showerProduct in productTypeMap)) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product type not found",
	});
}

const data = await useProductDetails(params.id as string);

const backUrl = getUrl("hotWaterOutlets")
	.replace(":outlet", params.outlet as string);
</script>

<template>
	<NuxtLink :href="backUrl" class="govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-5" data-testid="backLink" @click="router.back()">
		Back to hot water outlet
	</NuxtLink>

	<HotWaterOutletProductDetailsPage :product="(data as Product)" />

	<div class="govuk-button-group">
		<GovButton
			secondary
			:href="backUrl"
			test-id="backToHotWaterOutletButton"
			@click="router.back()"
		>
			Back to hot water outlet
		</GovButton>
	</div>
</template>