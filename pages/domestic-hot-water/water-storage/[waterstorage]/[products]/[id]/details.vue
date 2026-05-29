<script setup lang="ts">
import type { Product } from "~/pcdb/pcdb.types";

definePageMeta({ layout: "one-column" });

const router = useRouter();
const { params } = useRoute();

const waterStorageType = kebabToCamelCase(params.products as string);

if (!(waterStorageType in productTypeMap)) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product type not found",
	});
}

const data = await useProductDetails(params.id as string);

const backUrl = getUrl("waterStorage")
	.replace(":waterstorage", params.waterstorage as string);
</script>

<template>
	<NuxtLink :href="backUrl" class="govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-5" data-testid="backLink" @click="router.back()">
		Back to water storage
	</NuxtLink>

	<WaterStorageProductDetailsPage :product="(data as Product)" :water-storage-type="waterStorageType" />

	<div class="govuk-button-group">
		<GovButton
			secondary
			:href="backUrl"
			test-id="backToHeatSourceButton"
			@click="router.back()"
		>
			Back to water storage
		</GovButton>
	</div>
</template>