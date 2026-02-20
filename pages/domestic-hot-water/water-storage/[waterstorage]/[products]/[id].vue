<script setup lang="ts">
import type { PageId } from "~/data/pages/pages";
import { productTypeMap, typeOfWaterStorage, type WaterStorageProductType } from "~/stores/ecaasStore.schema";
import { sentenceToLowerCase } from "~/utils/string";

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

const technologyType = productTypeMap[waterStorageType as WaterStorageProductType];
const pageId = `${waterStorageType}Products` as PageId;
const productType = waterStorageProductTypeDisplay[waterStorageType as WaterStorageProductType];

const index = Number(params.waterstorage);

const { data: { value: data } } = await useFetch(`/api/products/${params.id}/details`, {
	query: {
		technologyType,
	},
});

const backUrl = getUrl(pageId)
	.replace(":waterstorage", params.waterstorage as string);

const selectProduct = () => {
	store.$patch((state) => {
		const item = state.domesticHotWater.waterStorage.data[index];

		if (item && data) {
			const product = item.data as SmartHotWaterTankData;
			product.productReference = data.id;
		}
	});

	navigateTo(getUrl("waterStorage").replace(":waterstorage", `${index}`));
};
</script>

<template>
	<Head>
		<Title>{{ data?.modelName }}</Title>
	</Head>

	<NuxtLink :href="backUrl" class="govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-5" data-testid="backLink" @click="router.back()">
		{{ productType ? `Back to ${sentenceToLowerCase(productType(true))}` : 'Back' }}
	</NuxtLink>

	<h1 class="govuk-heading-l govuk-!-margin-bottom-0">{{ data?.modelName }}</h1>
	<h2 class="govuk-caption-l govuk-!-margin-top-0">{{ data?.brandName }}</h2>

	<ProductDetailsSmartHotWaterTank v-if="!!data && waterStorageType === typeOfWaterStorage.smartHotWaterTank" :product="data!" />

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