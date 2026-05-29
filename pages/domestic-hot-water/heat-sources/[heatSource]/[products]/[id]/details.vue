<script setup lang="ts">
import { technologyGroups, type Product, type TechnologyGroup } from "~/pcdb/pcdb.types";

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

const data = await useProductDetails(params.id as string, query?.testDataId as string);

const backUrl = getUrl("heatSources")
	.replace(":heatSource", params.heatSource as string);
</script>

<template>
	<NuxtLink :href="backUrl" class="govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-5" data-testid="backLink" @click="router.back()">
		Back to heat source
	</NuxtLink>

	<ProductDetailsPage :product="(data as Product)" :heat-source-type="heatSourceType" />

	<div class="govuk-button-group">
		<GovButton
			secondary
			:href="backUrl"
			test-id="backToHeatSourceButton"
			@click="router.back()"
		>
			Back to heat source
		</GovButton>
	</div>
</template>