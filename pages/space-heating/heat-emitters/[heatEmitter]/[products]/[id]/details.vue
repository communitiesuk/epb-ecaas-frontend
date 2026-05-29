<script setup lang="ts">
import type { AnyPcdbProduct } from "~/pcdb/pcdb.types";

definePageMeta({ layout: "one-column" });

const router = useRouter();
const { params, query } = useRoute();

const heatEmittingType = kebabToCamelCase(params.products as string);

if (!(heatEmittingType in productTypeMap)) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product type not found",
	});
}

const data = await useProductDetails(params.id as string, query?.testDataId as string);

const backUrl = getUrl("heatEmitters")
	.replace(":heatEmitter", params.heatEmitter as string);
</script>

<template>
	<NuxtLink :href="backUrl" class="govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-5" data-testid="backLink" @click="router.back()">
		Back to heat emitter
	</NuxtLink>

	<HeatEmitterProductDetailsPage :product="(data as AnyPcdbProduct)" :heat-emitting-type="heatEmittingType" />

	<div class="govuk-button-group">
		<GovButton
			secondary
			:href="backUrl"
			test-id="backToHeatEmitterButton"
			@click="router.back()"
		>
			Back to heat emitter
		</GovButton>
	</div>
</template>