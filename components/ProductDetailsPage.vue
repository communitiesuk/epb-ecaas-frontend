<script setup lang="ts">
import { technologyGroups, type Product, type TechnologyGroup } from "~/pcdb/pcdb.types";
import { typeOfHeatSource } from "~/stores/ecaasStore.schema";
import { boilerTypes } from "~/utils/display";

const { product: data } = defineProps<{
	product: Product;
	heatSourceType: string;
}>();

const isHeatNetwork = computed(() => data?.technologyType === "HeatNetworks");
const title = isHeatNetwork.value ? (data as { communityHeatNetworkName?: string })?.communityHeatNetworkName : data?.modelName;
const subtitle = isHeatNetwork.value ? (data as { testData: { subheatNetworkName?: string } })?.testData?.subheatNetworkName : data?.brandName;
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>

	<h1 class="govuk-heading-l govuk-!-margin-bottom-0">{{ title }}</h1>
	<h2 class="govuk-caption-l govuk-!-margin-top-0">{{ subtitle }}</h2>

	<ProductDetailsHybridHeatPump v-if="!!data && data.technologyType === 'HybridHeatPump'" :product="data" />
	<ProductDetailsHotWaterHeatPump v-else-if="data?.technologyType === 'HotWaterOnlyHeatPump'" :product="data" />
	<ProductDetailsHeatPump v-else-if="!!data && 'technologyGroup' in data && technologyGroups.includes(data.technologyGroup as TechnologyGroup)" :product="data" />

	<ProductDetailsBoiler v-if="!!data && heatSourceType in boilerTypes" :product="data!"/>
	<ProductDetailsHeatBatteryPCM v-if="!!data && heatSourceType === typeOfHeatSource.heatBatteryPcm" :product="data!" />
	<ProductDetailsHeatBatteryDryCore v-if="!!data && heatSourceType === typeOfHeatSource.heatBatteryDryCore" :product="data!" />
	<ProductDetailsHeatInterfaceUnit v-if="!!data && heatSourceType === typeOfHeatSource.heatInterfaceUnit" :product="data!" />
	<ProductDetailsHeatNetworks v-if="!!data && heatSourceType === typeOfHeatSource.heatNetwork" :product="data!" />
</template>