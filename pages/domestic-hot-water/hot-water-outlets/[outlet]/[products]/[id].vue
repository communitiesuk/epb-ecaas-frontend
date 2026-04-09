<script setup lang="ts">
import type { PageId } from "~/data/pages/pages";
import type { ShowerProductType } from "~/stores/ecaasStore.schema";
import { showerProductTypesDisplay } from "~/utils/display";
import { sentenceToLowerCase } from "~/utils/string";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const router = useRouter();
const { params } = useRoute();

const showerProduct = kebabToCamelCase(params.products as string);

if (!(showerProduct in productTypeMap)) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product type not found",
	});
}

const pageId = `${showerProduct}Products` as PageId;
const showerProductType = showerProduct as ShowerProductType;
const productType = showerProductTypesDisplay[showerProductType];

const index = Number(params.outlet);
const { data: { value: data } } = await useFetch(`/api/products/${params.id}/details`);

const backUrl = getUrl(pageId).replace(":outlet", params.outlet as string);

const selectProduct = async () => {
	store.$patch(state => {
		const hotWaterOutletData = state.domesticHotWater.hotWaterOutlets.data[index]?.data;

		if (!hotWaterOutletData) {
			return;
		}

		if (hotWaterOutletData.typeOfHotWaterOutlet === "mixedShower") {
			const showerData = hotWaterOutletData as MixedShowerData;

			if (data?.technologyType === "AirPoweredShowers" && showerData.isAirPressureShower) {
				showerData.airPressureShowerProductReference = data.id;
			}

			if (data?.technologyType === "InstantaneousWwhrSystem" && showerData.wwhrs) {
				showerData.wwhrsProductReference = data.id;
			}
		}
	});

	navigateTo(getUrl("hotWaterOutlets").replace(":outlet", `${index}`));
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

	<ProductDetailsAirPressureShower v-if="!!data && data.technologyType === 'AirPoweredShowers'" :product="data" />
	<ProductDetailsWwhrs v-if="!!data && data.technologyType === 'InstantaneousWwhrSystem'" :product="data" />

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
			test-id="backToHotWaterOutletButton"
			@click="router.back()"
		>
			Back to {{ productType && sentenceToLowerCase(productType(true)) }}
		</GovButton>
	</div>
</template>