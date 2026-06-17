<script setup lang="ts">
import type { PageId } from "~/data/pages/pages";
import type { ShowerProductType } from "~/stores/ecaasStore.schema";
import { showerProductTypesDisplay } from "~/utils/display";
import { sentenceToLowerCase } from "~/utils/string";
import type { Product } from "~/pcdb/pcdb.types";

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

const data = await useProductDetails(params.id as string);

const backUrl = getUrl(pageId).replace(":outlet", params.outlet as string);

const selectProduct = async () => {
	const index = Number(params.outlet);

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
	<NuxtLink :href="backUrl" class="govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-5" data-testid="backLink" @click="router.back()">
		{{ productType ? `Back to ${sentenceToLowerCase(productType(true))}` : 'Back' }}
	</NuxtLink>

	<HotWaterOutletProductDetailsPage :product="(data as Product)" />

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