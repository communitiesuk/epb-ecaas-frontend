<script setup lang="ts">
import type { Product } from "~/pcdb/pcdb.types";
import { wwhrsProductTypeDisplay } from "~/utils/display";
import { sentenceToLowerCase } from "~/utils/string";

definePageMeta({ layout: "one-column" });

const router = useRouter();
const { params } = useRoute();

const wwhrsProduct = kebabToCamelCase(params.products as string);

if (!(wwhrsProduct in productTypeMap)) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product type not found",
	});
}

const data = await useProductDetails(params.id as string);

const backUrl = getUrl("wwhrs")
	.replace(":system", params.outlet as string);
</script>

<template>
	<NuxtLink :href="backUrl" class="govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-5" data-testid="backLink" @click="router.back()">
		Back to {{ sentenceToLowerCase(wwhrsProductTypeDisplay["wwhrs"](false)) }}
	</NuxtLink>

	<WwhrsProductDetailsPage :product="(data as Product)" />

	<div class="govuk-button-group">
		<GovButton
			secondary
			:href="backUrl"
			test-id="backToWwhrsButton"
			@click="router.back()"
		>
			Back to {{ sentenceToLowerCase(wwhrsProductTypeDisplay["wwhrs"](false)) }}
		</GovButton>
	</div>
</template>