<script setup lang="ts">
import type { FormKitFrameworkContext } from "@formkit/core";
import { showErrorState, getErrorMessage, isPackagedProduct, type HeatSourceData, hasModelDetails } from "#imports";
import type { AnyPcdbProduct } from "~/pcdb/pcdb.types";
import { isConvectorRadiatorProduct } from "~/utils/convectorRadiator";
import { heatPumpTypes } from "~/utils/display";
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
		"on-product-loaded": onProductLoaded,
		"on-choose-product": onChooseProduct,
	},
	node: { props: { disabled } },
} = props.context;

async function fetchProduct(reference: string) {
	const response = await useFetch<AnyPcdbProduct>(`/api/products/${reference}`);
	productData.value = response?.data?.value;
	onProductLoaded?.(productData.value);
}

function buildProductsPageUrl(url: string, index: number | undefined, productType: string, emitterIndex?: number) {
	const lastUrlSegment = new RegExp("/[^/]*$");
	const indexSegment = index !== undefined ? `/${index}` : "";
	const newPath = url.replace(lastUrlSegment, indexSegment) + "/" + camelToKebabCase(productType ?? "");
	const params = new URLSearchParams();

	if (emitterIndex != null) {
		params.set("emitterIndex", `${emitterIndex}`);
	}

	if (productType === "radiator") {
		params.set("sort", "type");
		params.set("order", "asc");
	}

	const query = params.toString();
	return query ? `${newPath}?${query}` : newPath;
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
const isHeatPumpSummary = computed(() => isHeatPump(heatSource));
const isBoilerSummary = computed(() => heatSource?.typeOfHeatSource === "boiler");
const isMechanicalVentilationSummary = computed(() => ["mvhr", "centralisedContinuousMev", "decentralisedContinuousMev"].includes(selectedProductType ?? ""));

function getPackagedProductType() {
	if (isBoilerSummary.value) {
		return isPackagedWithHeatPump() ? "Comes with heat pump" : "None";
	}

	if (isMechanicalVentilationSummary.value) {
		return isPackagedWithHeatPump() ? "Integrated with heat pump" : "None";
	}

	if (!isHeatPumpSummary.value) {
		return undefined;
	}

	const sourceData = heatSource as { packageProductIds?: string[] } | undefined;
	const packagedIds = sourceData?.packageProductIds ?? [];

	if (!isPackagedProduct(sourceData)) {
		return "None";
	}

	const hasBoiler = isPackagedWithBoiler(packagedIds);
	const hasWaterCylinder = isPackagedWithWaterCylinder(packagedIds);

	const packagedMechanicalVent = store.infiltrationAndVentilation.mechanicalVentilation.data
		.find((x) => {
			const mechanicalVentId = x.data.id;
			return mechanicalVentId != null && packagedIds.includes(mechanicalVentId);
		});
	
	const hasMechanicalVent = !!packagedMechanicalVent;

	if (hasBoiler || hasWaterCylinder || hasMechanicalVent) {
		const packagedItems: string[] = [];

		if (hasBoiler) {
			packagedItems.push("boiler");
		}

		if (hasWaterCylinder) {
			packagedItems.push("water cylinder");
		}

		if (hasMechanicalVent) {
			packagedItems.push("vent");
		}

		if (packagedItems.length === 1 && packagedItems[0] === "vent") {
			if (packagedMechanicalVent?.data.typeOfMechanicalVentilationOptions === "MVHR") {
				return "Integrated MVHR";
			}

			return "Integrated MEV";
		}

		return `Comes with ${formatPackagedItems(packagedItems)}`;
	}

	return "None";
}

function formatPackagedItems(items: string[]) {
	if (items.length <= 1) {
		return items[0] ?? "";
	}

	if (items.length === 2) {
		return `${items[0]} and ${items[1]}`;
	}

	return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function isPackagedWithBoiler(packagedIds: string[]) {
	const boilerIds = getBoilerIds();
	return packagedIds.some(id => boilerIds.includes(id));
}

function isPackagedWithWaterCylinder(packagedIds: string[]) {
	const waterCylinderIds = getWaterCylinderIds();
	return packagedIds.some(id => waterCylinderIds.includes(id));
}

function isHeatPump(heatSource: { typeOfHeatSource?: string } | undefined): heatSource is HeatSourceData {
	return heatSource?.typeOfHeatSource === "heatPump";
}


function getHeatPumpType() {
	const sourceData = heatSource as { typeOfHeatSource?: string; typeOfHeatPump?: keyof typeof heatPumpTypes } | undefined;

	if (!isHeatPump(sourceData)) {
		return undefined;
	}


	return sourceData.typeOfHeatPump ? heatPumpTypes[sourceData.typeOfHeatPump] : "-";
}

function getBoilerIds() {
	const { spaceHeating: { heatSource: spaceHeatingHeatSource }, domesticHotWater: { heatSources: domesticHotWaterHeatSources } } = store;
	return [
		...spaceHeatingHeatSource.data.filter(x => x.data.typeOfHeatSource === "boiler"),
		...domesticHotWaterHeatSources.data.filter(x => (x.data as { typeOfHeatSource?: string })?.typeOfHeatSource === "boiler"),
	].map(x => x.data.id);
}

function getWaterCylinderIds() {
	const { waterStorage, preheatedWaterStorage } = store.domesticHotWater;
	const cylinders = [...waterStorage.data, ...preheatedWaterStorage.data];

	return cylinders
		.filter(x => x.data.typeOfWaterStorage === "hotWaterCylinder")
		.map(x => x.data.id);
}

function isPackagedWithHeatPump() {
	const associatedItemId = (heatSource as { id?: string } | undefined)?.id ?? selectedProductReference;

	if (!associatedItemId) {
		return false;
	}
	const { spaceHeating: { heatSource: spaceHeatingHeatSource }, domesticHotWater: { heatSources: domesticHotWaterHeatSources } } = store;

	const isPackagedWithSpaceHeatingHeatPump = spaceHeatingHeatSource.data.some(({ data }) => {
		if (!isHeatPump(data) || !isPackagedProduct(data)) {
			return false;
		}
		return (data.packageProductIds ?? []).includes(associatedItemId);
	});

	if (isPackagedWithSpaceHeatingHeatPump) {
		return true;
	}

	const isPackagedWithDomesticHotWaterHeatPump = domesticHotWaterHeatSources.data.some(({ data }) => {
		if (!isPackagedProduct(data)) {
			return false;
		}

		return (data.packageProductIds ?? []).includes(associatedItemId);
	});

	return isPackagedWithDomesticHotWaterHeatPump;
}

function handleChooseProduct(event: Event) {
	event.preventDefault();
	onChooseProduct?.();
	navigateTo(productsPageUrl.value);
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
			<GovButton
				v-show="!productData"
				class="govuk-button__margin-bottom"
				data-testId="chooseAProductButton"
				@click="handleChooseProduct">
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
							<li v-if="isHeatPumpSummary">Heat pump type: <span class="bold" data-testid="productData_heatPumpType">{{ getHeatPumpType() }}</span></li>
							<li v-if="isHeatPumpSummary || isBoilerSummary || isMechanicalVentilationSummary">Packaged products: <span class="bold" data-testid="productData_packagedProducts">{{ getPackagedProductType() }}</span></li>
						</template>
					</ul>
				</template>
				<div class="govuk-!-margin-bottom-4">
					<NuxtLink :href="productDetailsPageUrl" class="govuk-link more-details-link">More details</NuxtLink>
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
.more-details-link {
	font-size: 1.1875rem;
	line-height: 1.3157894737;
}
</style>
