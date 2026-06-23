<script setup lang="ts">
import type { PageId } from "~/data/pages/pages";
import { wwhrsProductTypeDisplay } from "~/utils/display";
import { sentenceToLowerCase } from "~/utils/string";
import type { Product } from "~/pcdb/pcdb.types";
import WwhrsProductDetailsPage from "~/components/WwhrsProductDetailsPage.vue";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const router = useRouter();
const { params } = useRoute();

const wwhrsProduct = kebabToCamelCase(params.products as string);

if (!(wwhrsProduct in productTypeMap)) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product type not found",
	});
}

const pageId = `${wwhrsProduct}Products` as PageId;
const productType = wwhrsProductTypeDisplay["wwhrs"];

const data = await useProductDetails(params.id as string);

const backUrl = getUrl(pageId).replace(":system", params.system as string);

const selectProduct = async () => {
	const index = Number(params.system);

	store.$patch(state => {
		const wwhrsData = state.domesticHotWater.wwhrs.data[index]?.data;

		if (!wwhrsData) {
			return;
		}

		wwhrsData.productReference = data?.id;
	});

	navigateTo(getUrl("wwhrs").replace(":system", `${index}`));
};
</script>

<template>
	<NuxtLink :href="backUrl" class="govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-5" data-testid="backLink" @click="router.back()">
		{{ productType ? `Back to ${sentenceToLowerCase(productType(true))}` : 'Back' }}
	</NuxtLink>

	<WwhrsProductDetailsPage :product="(data as Product)" />

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
			test-id="backToWwhrsButton"
			@click="router.back()"
		>
			Back to {{ productType && sentenceToLowerCase(productType(true)) }}
		</GovButton>
	</div>
</template>