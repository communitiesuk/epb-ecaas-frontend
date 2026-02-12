<script setup lang="ts">
import type { PageId } from "~/data/pages/pages";
import { productTypeMap, typeOfMechanicalVentilation, type MechanicalVentilationProductType, type PcdbProduct } from "~/stores/ecaasStore.schema";
import { mechanicalVentilationProductTypesDisplay } from "~/utils/display";
import { sentenceToLowerCase } from "~/utils/string";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const router = useRouter();
const { params } = useRoute();

const mechanicalVentilationType = kebabToCamelCase(params.products as string);

if (!(mechanicalVentilationType in productTypeMap)) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product type not found",
	});
}

const mechanicalVentilationProductType = mechanicalVentilationType as MechanicalVentilationProductType;

const technologyType = productTypeMap[mechanicalVentilationProductType];
const pageId = `${mechanicalVentilationType}Products` as PageId;
const productType = mechanicalVentilationProductTypesDisplay[mechanicalVentilationProductType];

const index = Number(params.mechanical);

const { data: { value: data } } = await useFetch(`/api/products/${params.id}/details`, {
	query: {
		technologyType,
	},
});

const backUrl = getUrl(pageId)
	.replace(":mechanical", params.mechanical as string);

const selectProduct = () => {
	store.$patch((state) => {
		const item = state.infiltrationAndVentilation.mechanicalVentilation.data[index];

		if (item && data) {
			const product = item.data as PcdbProduct;
			product.productReference = data.id;
		}
	});

	navigateTo(getUrl("mechanicalVentilationEdit").replace(":mechanical", `${index}`));
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

	<ProductDetailsMvhr v-if="!!data && mechanicalVentilationType === typeOfMechanicalVentilation.mvhr" :product="data!" />
	<ProductDetailsContinuousMev v-if="!!data && mechanicalVentilationType === typeOfMechanicalVentilation.centralisedContinuousMev" :product="data!" />
	<ProductDetailsContinuousMev v-if="!!data && mechanicalVentilationType === typeOfMechanicalVentilation.decentralisedContinuousMev" :product="data!" />

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
			test-id="backToHeatPumpButton"
			@click="router.back()"
		>
			Back to {{ productType && sentenceToLowerCase(productType(true)) }}
		</GovButton>
	</div>
</template>