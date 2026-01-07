<script setup lang="ts">
import type { FormKitFrameworkContext } from "@formkit/core";
import { showErrorState, getErrorMessage } from "#imports";
import hyphenate from "~/utils/hyphenate";
import type { DisplayProduct } from "~/pcdb/pcdb.types";

const props = defineProps<{
	context: FormKitFrameworkContext
}>();

const {
	label,
	help,
	id,
	attrs: {
		"selected-product-reference": selectedProductReference,
		"selected-product-type": selectedProductType,
		"page-url": pageUrl,
		"page-index": index,
	},
} = props.context;

function appendItemIndexToUrl(url: string, index: number) {
	const lastUrlSegment = new RegExp("/[^/]*$");
	return url.replace(lastUrlSegment, `/${index}`);
}

const productsPageUrl = appendItemIndexToUrl(pageUrl, index) + "/" + hyphenate(selectedProductType);
let productData: DisplayProduct | undefined | null;

if (selectedProductReference) {
	const { data } = await useFetch(`/api/products/${selectedProductReference}`);
	productData = data.value;
}
</script>

<template>
	<div class="govuk-form-group">
		<div :data-testid="id" :class="`govuk-form-group ${showErrorState(props.context) ? 'govuk-form-group--error' : ''}`">
			<label class="govuk-label govuk-label--m">
				{{ label }}
			</label>
			<div v-if="help" :id="`${id}_hint`" class="govuk-hint">{{ help }}</div>
			<p v-if="props.context.state.invalid" class="govuk-error-message" :data-testid="`${id}_error`">
				<span class="govuk-visually-hidden">Error:</span> {{ getErrorMessage(props.context) }}
			</p>
			<GovButton class="govuk-button__margin-bottom" v-show="!productData" data-testId="chooseAProductButton" :href="productsPageUrl">
				Choose a product
			</GovButton>
			<div v-if="productData">
				<ul class="govuk-list">
					<li>Product reference: <span class="bold">{{ selectedProductReference }}</span></li>
					<li>Brand: <span class="bold">{{ productData?.brandName }}</span></li>
					<li>Model: <span class="bold">{{ productData?.modelName }}</span></li>
					<li>Model Qualifier: <span class="bold">{{ productData?.modelQualifier ?? '-' }}</span></li>
				</ul>
				<GovButton secondary data-testId="selectAProductButton" :href="productsPageUrl">
					Select a different product
				</GovButton>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
govuk-list {
	line-height: 1.2;
}
.govuk-button__margin-bottom {
	margin-bottom: 0px;
}
.bold {
	font-weight: bold;
}
</style>
