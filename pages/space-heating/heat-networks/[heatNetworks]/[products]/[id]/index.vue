<script setup lang="ts">
import HeatNetworkProductDetailsPage from "~/components/HeatNetworkProductDetailsPage.vue";
import type { PageId } from "~/data/pages/pages";
import type { Product } from "~/pcdb/pcdb.types";
import type { HeatNetworkData, HeatNetworkProductType } from "~/stores/ecaasStore.schema";
import { heatNetworkProductTypeDisplay } from "~/utils/display";
import { sentenceToLowerCase } from "~/utils/string";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const router = useRouter();
const { params } = useRoute();

const heatNetworkType = kebabToCamelCase(params.products as string);

if (!(heatNetworkType in productTypeMap)) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product type not found",
	});
}

const pageId = `${heatNetworkType}Products1` as PageId;
const productType = heatNetworkProductTypeDisplay[heatNetworkType as HeatNetworkProductType];


const data = await useProductDetails(params.id as string);

const backUrl = getUrl(pageId)
	.replace(":heatNetwork", params.heatNetwork as string);

const selectProduct = () => {
	const index = Number(params.heatNetwork);
	store.$patch((state) => {
		const item = state.spaceHeating.heatNetworks.data[index];

		if (item && data) {
			const product = item.data as HeatNetworkData;
			product.productReference = data.id.toString();
		}
	});

	navigateTo(getUrl("heatNetworks").replace(":heatNetwork", `${index}`));
};
</script>

<template>
	<NuxtLink :href="backUrl" class="govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-5" data-testid="backLink" @click="router.back()">
		{{ productType ? `Back to ${sentenceToLowerCase(productType(true))}` : 'Back' }}
	</NuxtLink>

	<HeatNetworkProductDetailsPage :product="(data as Product)"/>

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
			test-id="backToHeatNetworkButton"
			@click="router.back()"
		>
			Back to {{ productType && sentenceToLowerCase(productType(true)) }}
		</GovButton>
	</div>
</template>