<script setup lang="ts">
import WaterStorageProductDetailsPage from "~/components/WaterStorageProductDetailsPage.vue";
import type { PageId } from "~/data/pages/pages";
import type { WaterStorageProductType } from "~/stores/ecaasStore.schema";
import { sentenceToLowerCase } from "~/utils/string";
import type { Product } from "~/pcdb/pcdb.types";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const router = useRouter();
const { params } = useRoute();

const waterStorageType = kebabToCamelCase(params.products as string);

if (!(waterStorageType in productTypeMap)) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product type not found",
	});
}

const pageId = `${waterStorageType}Products` as PageId;
const productType = waterStorageProductTypeDisplay[waterStorageType as WaterStorageProductType];

const data = await useProductDetails(params.id as string);

const backUrl = getUrl(pageId)
	.replace(":waterstorage", params.waterstorage as string);

const selectProduct = () => {
	const index = Number(params.waterstorage);
	
	store.$patch((state) => {
		const item = state.domesticHotWater.waterStorage.data[index];

		if (item && data) {
			const product = item.data as SmartHotWaterTankData;
			product.productReference = data.id.toString();
		}
	});

	navigateTo(getUrl("waterStorage").replace(":waterstorage", `${index}`));
};
</script>

<template>
	<NuxtLink :href="backUrl" class="govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-5" data-testid="backLink" @click="router.back()">
		{{ productType ? `Back to ${sentenceToLowerCase(productType(true))}` : 'Back' }}
	</NuxtLink>

	<WaterStorageProductDetailsPage :product="(data as Product)" :water-storage-type="waterStorageType" />

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
			test-id="backToWaterStorageButton"
			@click="router.back()"
		>
			Back to {{ productType && sentenceToLowerCase(productType(true)) }}
		</GovButton>
	</div>
</template>