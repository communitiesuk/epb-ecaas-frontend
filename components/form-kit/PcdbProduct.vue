<script setup lang="ts">
import type { FormKitFrameworkContext } from "@formkit/core";
import { showErrorState, getErrorMessage } from "#imports";
import type { Product } from "~/pcdb/pcdb.types";
import { isConvectorRadiatorProduct, type AnyPcdbProduct } from "~/utils/convectorRadiator";

const props = defineProps<{
	context: FormKitFrameworkContext
}>();

const {
	label,
	help,
	id,
	attrs: {
		"selected-product-reference": selectedProductReference,
		"selected-sub-heat-network-id": selectedSubHeatNetworkId,
		"selected-product-type": selectedProductType,
		"page-url": pageUrl,
		"page-index": index,
		"emitter-index": emitterIndex,
	},
	node: { props: { disabled } },
} = props.context;

async function fetchProduct(reference: string, subHeatNetworkId?: string) {
	const response = await useFetch<AnyPcdbProduct>(`/api/products/${reference}`, {
		query: selectedProductType === "heatNetwork" && subHeatNetworkId
			? { testDataId: subHeatNetworkId }
			: undefined,
	});
	productData.value = response?.data?.value;
}

function buildProductsPageUrl(url: string, index: number, productType: string, emitterIndex?: number) {
	const lastUrlSegment = new RegExp("/[^/]*$");
	const newPath = url.replace(lastUrlSegment, `/${index}`) + "/" + camelToKebabCase(productType ?? "");
	return emitterIndex != null ? `${newPath}?emitterIndex=${emitterIndex}` : newPath;
}

const selectedProduct = ref<string | undefined>(selectedProductReference);

const productsPageUrl = ref(buildProductsPageUrl(pageUrl, index, selectedProductType ?? "", emitterIndex));
const productData = ref<AnyPcdbProduct | undefined | null>();

function getHeatNetworkSubnetworkName(product: AnyPcdbProduct | undefined | null): string | undefined {
	if (!product || !("communityHeatNetworkName" in product)) {
		return undefined;
	}

	const maybeHeatNetwork = product as unknown as Record<string, unknown>;

	if (typeof maybeHeatNetwork.subheatNetworkName === "string" && maybeHeatNetwork.subheatNetworkName) {
		return maybeHeatNetwork.subheatNetworkName;
	}

	if (maybeHeatNetwork.testData && typeof maybeHeatNetwork.testData === "object") {
		const subheatNetworkName = (maybeHeatNetwork.testData as Record<string, unknown>).subheatNetworkName;
		if (typeof subheatNetworkName === "string" && subheatNetworkName) {
			return subheatNetworkName;
		}
	}

	return undefined;
}

const heatNetworkSubnetworkName = computed(() => getHeatNetworkSubnetworkName(productData.value));

function hasModelDetails(product: Product): product is Product & { brandName: string; modelName: string; modelQualifier?: string | null } {
	return "modelName" in product;
}

function productReferenceForDetails(product: AnyPcdbProduct): string {
	return isConvectorRadiatorProduct(product) ? `${product.ID}` : product.id;
}

if (selectedProduct.value) {
	await fetchProduct(selectedProductReference, selectedSubHeatNetworkId);
}

watch(props.context, async ({ attrs: {
	"selected-product-reference": newProductReference,
	"selected-sub-heat-network-id": newSubHeatNetworkId,
	"selected-product-type": newProductType,
	"emitter-index": newEmitterIndex,
} }) => {
	productsPageUrl.value = buildProductsPageUrl(pageUrl, index, newProductType ?? "", newEmitterIndex as number | undefined);
	selectedProduct.value = newProductReference;

	if (newProductReference) {
		await fetchProduct(newProductReference, newSubHeatNetworkId as string | undefined);
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
				<template v-if="'communityHeatNetworkName' in productData && !!productData.communityHeatNetworkName">
					<ul class="govuk-list" data-testId="pcdbHeatNetworkProductData">
						<li>Product reference: <span data-testid="productData_productReference" class="bold">{{ selectedProduct }}</span></li>
						<li>Heat network name: <span class="bold">{{ productData.communityHeatNetworkName }}</span></li>
						<li>Subnetwork name: <span data-testid="productData_subHeatNetworkName" class="bold">{{ heatNetworkSubnetworkName ?? '-' }}</span></li>
					</ul>
				</template>
				<template v-else>
					<ul class="govuk-list" data-testId="pcdbProductData">
						<li>Product reference: <span data-testid="productData_productReference" class="bold">{{ selectedProduct }}</span></li>
						<template v-if="isConvectorRadiatorProduct(productData)">
							<li>Type: <span class="bold">{{ productData.type ?? '-' }}</span></li>
							<li>Height: <span class="bold">{{ productData.height != null ? `${productData.height} mm` : '-' }}</span></li>
						</template>
						<template v-else-if="hasModelDetails(productData)">
							<li>Brand: <span class="bold">{{ productData.brandName }}</span></li>
							<li>Model: <span class="bold">{{ productData.modelName }}</span></li>
							<li>Model Qualifier: <span class="bold">{{ productData.modelQualifier ?? '-' }}</span></li>
						</template>
					</ul>
				</template>
				<GovButton
					v-if="!disabled"
					secondary
					data-testId="selectAProductButton" 
					:href="productsPageUrl"
					class="govuk-button__margin-bottom"
				>
					Select a different product
				</GovButton>
				<NuxtLink v-if="disabled" :href="`${productsPageUrl}/${productReferenceForDetails(productData)}`" class="govuk-link">More details</NuxtLink>
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
