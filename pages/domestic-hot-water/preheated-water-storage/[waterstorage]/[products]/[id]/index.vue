<script setup lang="ts">
import type { Product } from "~/pcdb/pcdb.types";
import { sentenceToLowerCase } from "~/utils/string";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const router = useRouter();
const route = useRoute();
const { params } = route;
const waterStorageType = kebabToCamelCase(params.products as string);

if (waterStorageType !== "smartHotWaterTank") {
	throw createError({ statusCode: 404, statusMessage: "Product type not found" });
}

const productType = waterStorageProductTypeDisplay.smartHotWaterTank;
const data = await useProductDetails(params.id as string);
const backUrl = route.path.replace(/\/[^/]*$/, "");

const selectProduct = () => {
	const index = Number(params.waterstorage);
	if (!data) {
		throw createError({ statusCode: 404, statusMessage: "Product not found" });
	}
	store.$patch((state) => {
		const item = state.domesticHotWater.preheatedWaterStorage.data[index];
		if (!item || item.data.typeOfWaterStorage !== "smartHotWaterTank") {
			throw createError({ statusCode: 404, statusMessage: "Smart preheated water tank not found" });
		}
		item.data = { ...item.data, productReference: data.id.toString() };
	});

	navigateTo(getUrl("preheatedWaterStorage"));
};
</script>

<template>
	<NuxtLink :href="backUrl" class="govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-5" data-testid="backLink" @click="router.back()">
		Back to {{ sentenceToLowerCase(productType(true)) }}
	</NuxtLink>
	<WaterStorageProductDetailsPage :product="(data as Product)" :water-storage-type="waterStorageType" />
	<div class="govuk-button-group">
		<GovButton test-id="selectProductButton" @click="selectProduct">
			Select {{ sentenceToLowerCase(productType(false)) }}
		</GovButton>
		<GovButton secondary :href="backUrl" test-id="backToWaterStorageButton" @click="router.back()">
			Back to {{ sentenceToLowerCase(productType(true)) }}
		</GovButton>
	</div>
</template>
