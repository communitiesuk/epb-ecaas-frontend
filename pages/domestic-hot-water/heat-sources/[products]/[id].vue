<script setup lang="ts">
import type { PageId } from "~/data/pages/pages";
import { heatPumpProductTypesMap, technologyGroups, type HotWaterOnlyHeatPumpProduct, type TechnologyGroup } from "~/pcdb/pcdb.types";
import { productTypeMap, typeOfHeatSource, type HeatSourceData, type PcdbProduct } from "~/stores/ecaasStore.schema";
import { boilerTypes, heatSourceProductTypesDisplay } from "~/utils/display";
import { sentenceToLowerCase } from "~/utils/string";

definePageMeta({ layout: "one-column" });

const store = useEcaasStore();
const router = useRouter();
const { params } = useRoute();

const heatSourceType = kebabToCamelCase(params.products as string);

if (!(heatSourceType in productTypeMap) && !technologyGroups.includes(heatSourceType as TechnologyGroup)) {
	throw createError({
		statusCode: 404,
		statusMessage: "Product type not found",
	});
}

const pageId = `${heatSourceType}DHWProducts` as PageId;
const productType = heatSourceProductTypesDisplay[heatSourceType as HeatSourceProductType];

const { data: { value: data } } = await useFetch(`/api/products/${params.id}/details`);


const backUrl = getUrl(pageId);

// TODO refactor out
const selectProduct = () => {
	store.$patch((state) => {
		const item = state.domesticHotWater.heatSources.data[0];
		if (item && data) {
			const heatSourceData = item?.data as HeatSourceData;

			if (heatSourceData.typeOfHeatSource === "boiler" && (data?.technologyType === "CombiBoiler" || data?.technologyType === "RegularBoiler")) {
				heatSourceData.needsSpecifiedLocation = data.boilerLocation === "unknown";
				delete heatSourceData.specifiedLocation;
			}

			if (heatSourceData.typeOfHeatSource === "heatPump" && data.technologyType === "HotWaterOnlyHeatPump") {
				const hotWaterOnlyHeatPumpProduct = data as HotWaterOnlyHeatPumpProduct;
				heatSourceData.typeOfHeatPump = heatPumpProductTypesMap[hotWaterOnlyHeatPumpProduct.technologyType];
			}

			if (heatSourceData.typeOfHeatSource === "heatNetwork") {

				if (!heatSourceData.isHeatNetworkInPcdb) return;
				if ("fifthGHeatNetwork" in data && data.fifthGHeatNetwork === 1) {
					heatSourceData.isFifthGeneration = true;
				}
			}

			const product = item.data as PcdbProduct;
			product.productReference = data.id;
		
		}
	});

	navigateTo(getUrl("heatSources"));
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

	<ProductDetailsHybridHeatPump v-if="!!data && data.technologyType === 'HybridHeatPump'" :product="data" />
	<ProductDetailsHotWaterHeatPump v-else-if="data?.technologyType === 'HotWaterOnlyHeatPump'" :product="data" />
	<ProductDetailsHeatPump v-else-if="!!data && technologyGroups.includes(data.technologyGroup as TechnologyGroup)" :product="data" />

	<ProductDetailsBoiler v-if="!!data && heatSourceType in boilerTypes" :product="data!"/>
	<ProductDetailsHeatBatteryPCM v-if="!!data && heatSourceType === typeOfHeatSource.heatBatteryPcm" :product="data!" />
	<ProductDetailsHeatBatteryDryCore v-if="!!data && heatSourceType === typeOfHeatSource.heatBatteryDryCore" :product="data!" />

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