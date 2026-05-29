<script setup lang="ts">
import type { FormKitFrameworkContext } from "@formkit/core";
import { showErrorState, getErrorMessage, isPackagedProduct, type HeatSourceData } from "#imports";
import type { AnyPcdbProduct } from "~/pcdb/pcdb.types";
import { isConvectorRadiatorProduct } from "~/utils/convectorRadiator";
import { isUnderFloorHeatingProduct } from "~/utils/underFloorHeating";

const store = useEcaasStore();

const props = defineProps<{
	context: FormKitFrameworkContext
}>();

const {
	label,
	help,
	id,
	attrs: {
		"selected-product-reference": selectedProductReference,
		"selected-sub-heat-network-name": selectedSubHeatNetworkName,
		"selected-product-type": selectedProductType,
		"heat-source": heatSource,
		"page-url": pageUrl,
		"page-index": index,
		"emitter-index": emitterIndex,
	},
	node: { props: { disabled } },
} = props.context;

async function fetchProduct(reference: string) {
	const response = await useFetch<AnyPcdbProduct>(`/api/products/${reference}`);
	productData.value = response?.data?.value;
}

function buildProductsPageUrl(url: string, index: number, productType: string, emitterIndex?: number) {
	const lastUrlSegment = new RegExp("/[^/]*$");
	const newPath = url.replace(lastUrlSegment, `/${index}`) + "/" + camelToKebabCase(productType ?? "");
	return emitterIndex != null ? `${newPath}?emitterIndex=${emitterIndex}` : newPath;
}

function buildProductDetailsPageUrl(url: string, productType: string, productId: string) {
	const lastUrlSegment = new RegExp("/[^/]*$");
	return url.replace(lastUrlSegment, `/${index}`) + "/" + camelToKebabCase(productType ?? "") + `/${productId}` + "/details";
}

const selectedProduct = ref<string | undefined>(selectedProductReference);
const selectedSubHeatNetwork = ref<string | undefined>(selectedSubHeatNetworkName as string | undefined);

const productsPageUrl = ref(buildProductsPageUrl(pageUrl, index, selectedProductType ?? "", emitterIndex));
const productDetailsPageUrl = ref(buildProductDetailsPageUrl(pageUrl, selectedProductType ?? "", selectedProductReference));
const productData = ref<AnyPcdbProduct | undefined | null>();

function hasModelDetails(
	product: AnyPcdbProduct,
): product is Extract<AnyPcdbProduct, { modelName: string; brandName: string; modelQualifier?: string | null }> {
	return "modelName" in product && "brandName" in product;
}

if (selectedProduct.value) {
	await fetchProduct(selectedProductReference);
}

watch(props.context, async ({ attrs: {
	"selected-product-reference": newProductReference,
	"selected-sub-heat-network-name": newSubHeatNetworkName,
	"selected-product-type": newProductType,
	"emitter-index": newEmitterIndex,
} }) => {
	productsPageUrl.value = buildProductsPageUrl(pageUrl, index, newProductType ?? "", newEmitterIndex as number | undefined);
	productDetailsPageUrl.value = buildProductDetailsPageUrl(pageUrl, newProductType ?? "", newProductReference);
	selectedProduct.value = newProductReference;
	selectedSubHeatNetwork.value = newSubHeatNetworkName as string | undefined;

	if (newProductReference) {
		await fetchProduct(newProductReference);
		return;
	}

	productData.value = undefined;
});

function getPackagedProductType() {
	const heatSourceData: HeatSourceData | undefined = heatSource;

	if (!heatSourceData) {
		return undefined;
	}

	if (!isPackagedProduct(heatSourceData)) {
		return "None";
	}

	const spaceHeatingBoilers = store.spaceHeating.heatSource.data.filter(x => x.data.typeOfHeatSource === "boiler").map(x => x.data.id);
	const dhwBoilers = store.domesticHotWater.heatSources.data.filter(x => !x.data.isExistingHeatSource && x.data.typeOfHeatSource === "boiler").map(x => x.data.id);
	const hotWaterCylinders = store.domesticHotWater.waterStorage.data.filter(x => x.data.typeOfWaterStorage === "hotWaterCylinder").map(x => x.data.id);

	const boilers = spaceHeatingBoilers.concat(dhwBoilers);

	if (heatSourceData.packageProductIds?.some(id => boilers.includes(id))) {
		return "Comes with boiler";
	}

	if (heatSourceData.packageProductIds?.some(id => hotWaterCylinders.includes(id))) {
		return "Comes with hot water cylinder";
	}
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
			<GovButton v-show="!productData" class="govuk-button__margin-bottom" data-testId="chooseAProductButton" :href="productsPageUrl">
				Choose a product
			</GovButton>
			<div v-if="productData">
				<template v-if="'communityHeatNetworkName' in productData && !!productData.communityHeatNetworkName">
					<ul class="govuk-list" data-testId="pcdbHeatNetworkProductData">
						<li>Product reference: <span data-testid="productData_productReference" class="bold">{{ selectedProduct }}</span></li>
						<li>Heat network name: <span class="bold">{{ productData.communityHeatNetworkName }}</span></li>
						<li>Subnetwork name: <span data-testid="productData_subHeatNetworkName" class="bold">{{ selectedSubHeatNetwork ?? '-' }}</span></li>
					</ul>
				</template>
				<template v-else>
					<ul class="govuk-list" data-testId="pcdbProductData">
						<li>Product reference: <span data-testid="productData_productReference" class="bold">{{ selectedProduct }}</span></li>
						<template v-if="isConvectorRadiatorProduct(productData)">
							<li>Type: <span class="bold">{{ productData.type ?? '-' }}</span></li>
							<li>Height: <span class="bold">{{ productData.height != null ? `${productData.height} mm` : '-' }}</span></li>
						</template>
						<template v-else-if="isUnderFloorHeatingProduct(productData)">
							<li>System Name: <span class="bold">{{ productData.systemName ?? '-' }}</span></li>
							<li>Floor Finish Compatibility: <span class="bold">{{ productData.floorFinishCompatibility ?? '-' }}</span></li>
							<li>Pipe Centres: <span class="bold">{{ productData.pipeCentres != null ? `${productData.pipeCentres} mm` : '-' }}</span></li>
						</template>
						<template v-else-if="hasModelDetails(productData)">
							<li>Brand: <span class="bold">{{ productData.brandName }}</span></li>
							<li>Model: <span class="bold">{{ productData.modelName }}</span></li>
							<li>Model Qualifier: <span class="bold">{{ productData.modelQualifier ?? '-' }}</span></li>
							<li>Packaged products: <span class="bold" data-testid="productData_packagedProducts">{{ getPackagedProductType() }}</span></li>
						</template>
					</ul>
				</template>
				<div class="govuk-!-margin-bottom-4">
					<NuxtLink :href="productDetailsPageUrl" class="govuk-link">More details</NuxtLink>
				</div>
				<GovButton
					v-if="!disabled"
					secondary
					data-testId="selectAProductButton" 
					:href="productsPageUrl"
					class="govuk-button__margin-bottom"
				>
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
