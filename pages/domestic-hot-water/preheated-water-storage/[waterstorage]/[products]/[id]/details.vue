<script setup lang="ts">
import type { Product } from "~/pcdb/pcdb.types";

definePageMeta({ layout: "one-column" });

const router = useRouter();
const { params } = useRoute();
const waterStorageType = kebabToCamelCase(params.products as string);

if (waterStorageType !== "smartHotWaterTank") {
	throw createError({ statusCode: 404, statusMessage: "Product type not found" });
}

const data = await useProductDetails(params.id as string);
const backUrl = getUrl("preheatedWaterStorage");
</script>

<template>
	<NuxtLink :href="backUrl" class="govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-5" data-testid="backLink" @click="router.back()">
		Back to preheated water storage
	</NuxtLink>
	<WaterStorageProductDetailsPage :product="(data as Product)" :water-storage-type="waterStorageType" />
	<div class="govuk-button-group">
		<GovButton secondary :href="backUrl" test-id="backToWaterStorageButton" @click="router.back()">
			Back to preheated water storage
		</GovButton>
	</div>
</template>
