<script setup lang="ts">
import type { PageId } from "~/data/pages/pages";
import { technologyGroups, type DisplayProduct, type Product, type TechnologyGroup } from "~/pcdb/pcdb.types";
import type { EcaasForm, HeatSourceData, HeatSourceProductType } from "~/stores/ecaasStore.schema";
import { heatSourceProductTypesDisplay } from "~/utils/display";
import { sentenceToLowerCase } from "~/utils/string";

definePageMeta({ layout: "one-column" });

const router = useRouter();
const { params, query } = useRoute();

const heatSourceType = kebabToCamelCase(params.products as string);

if (!(heatSourceType in productTypeMap) && !technologyGroups.includes(heatSourceType as TechnologyGroup)) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product type not found",
	});
}

const pageId = `${heatSourceType}Products` as PageId;
const heatSourceProductType = heatSourceType as (HeatSourceProductType | TechnologyGroup);
const productType = heatSourceProductTypesDisplay[heatSourceProductType];

const data = await useProductDetails(params.id! as string, query?.testDataId as string);

const { selectHeatSourceProduct } = useSelectHeatSourceProduct(data ? [data as DisplayProduct] : [], heatSourceProductType);

const backUrl = getUrl(pageId)
	.replace(":heatSource", params.heatSource as string);

const selectProduct = async () => {
	const index = Number(params.heatSource);
	
	await selectHeatSourceProduct(
		{ ...data, id: data?.id.toString() } as DisplayProduct,
		(state) => state.spaceHeating.heatSource.data as EcaasForm<HeatSourceData>[],
		index,
	);

	navigateTo(getUrl("heatSource").replace(":heatSource", `${index}`));
};
</script>

<template>
	<NuxtLink :href="backUrl" class="govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-5" data-testid="backLink" @click="router.back()">
		{{ productType ? `Back to ${sentenceToLowerCase(productType(true))}` : 'Back' }}
	</NuxtLink>

	<ProductDetailsPage :product="(data as Product)" :heat-source-type="heatSourceType" />

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