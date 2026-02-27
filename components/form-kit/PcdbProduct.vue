<script setup lang="ts">
import type { FormKitFrameworkContext } from "@formkit/core";
import { showErrorState, getErrorMessage } from "#imports";
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

async function fetchProduct(reference: string) {
	const { data } = await useFetch(`/api/products/${reference}`);
	productData.value = data.value;
}

function appendItemIndexToUrl(url: string, index: number) {
	const lastUrlSegment = new RegExp("/[^/]*$");
	return url.replace(lastUrlSegment, `/${index}`);
}

const selectedProduct = ref<string | undefined>(selectedProductReference);

const productsPageUrl = ref(appendItemIndexToUrl(pageUrl, index) + "/" + camelToKebabCase(selectedProductType ?? ""));
const productData = ref<DisplayProduct | undefined | null>();

if (selectedProduct.value) {
	await fetchProduct(selectedProductReference);
}

watch(props.context, async ({ attrs: {
	"selected-product-reference": newProductReference,
	"selected-product-type": newProductType,
} }) => {
	productsPageUrl.value = appendItemIndexToUrl(pageUrl, index) + "/" + camelToKebabCase(newProductType ?? "");
	selectedProduct.value = newProductReference;

	if (newProductReference) {
		await fetchProduct(newProductReference);
		return;
	}

	productData.value = undefined;
});
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
			<GovButton v-show="!productData" class="govuk-button__margin-bottom" data-testId="chooseAProductButton" :href="productsPageUrl">
				Choose a product
			</GovButton>
			<div v-if="productData">
				<template v-if="!!productData.communityHeatNetworkName">
					<ul class="govuk-list" data-testId="pcdbHeatNetworkProductData">
						<li>Product reference: <span data-testid="productData_productReference" class="bold">{{ selectedProduct }}</span></li>
						<li>Heat network name: <span class="bold">{{ productData.communityHeatNetworkName }}</span></li>
					</ul>
				</template>
				<template v-else>
					<ul class="govuk-list" data-testId="pcdbProductData">
						<li>Product reference: <span data-testid="productData_productReference" class="bold">{{ selectedProduct }}</span></li>
						<li>Brand: <span class="bold">{{ productData.brandName }}</span></li>
						<li>Model: <span class="bold">{{ productData.modelName }}</span></li>
						<li>Model Qualifier: <span class="bold">{{ productData.modelQualifier ?? '-' }}</span></li>
					</ul>
				</template>
				<GovButton secondary data-testId="selectAProductButton" :href="productsPageUrl" class="govuk-button__margin-bottom">
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
