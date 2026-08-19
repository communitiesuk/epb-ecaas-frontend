<script setup lang="ts">
import { heatBatteryTypes, uniqueName } from "#imports";
import { celsius } from "~/utils/units/temperature";
import type { AnyPcdbProduct } from "~/pcdb/pcdb.types";

const route = useRoute();
const store = useEcaasStore();

type HeatBatterySectionPage = "space heating" | "domestic hot water";

const props = defineProps<{
	model: Extract<HeatSourceData, { "typeOfHeatSource": "heatBattery" }>;
	index: number;
	page: HeatBatterySectionPage;
	onIncompatibleEnergySource?: (value: boolean, fuel?: string) => void;
	onProductLoaded?: (product: AnyPcdbProduct) => void;
}>();

const fuel = ref<string | undefined>();

const heatSources = getCombinedHeatSources(store);

const emit = defineEmits(["update-heat-battery-model"]);

const handleProductLoaded = (product: AnyPcdbProduct) => {
	if (product.technologyType === "HeatBatteryPCM" || product.technologyType === "HeatBatteryDryCore") {
		fuel.value = product.fuel ?? "";
	}

	props.onProductLoaded?.(product);
};
</script>

<template>
	<FormKit
		id="typeOfHeatBattery"
		type="govRadios"
		label="Type of heat battery"
		:options="heatBatteryTypes"
		name="typeOfHeatBattery"
		validation="required"
		@click="emit('update-heat-battery-model', 'typeOfHeatBattery')" />
	<div v-show="model.typeOfHeatBattery">
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			:validation-rules="{ uniqueName: uniqueName(heatSources, { id: model.id }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name in domestic hot water or space heating already exists. Please enter a unique name.'
			}" />
		<ClientOnly>
			<FieldsSelectPcdbProduct
				id="selectHeatBattery"
				label="Select a heat battery"
				help="Select the heat battery type from the PCDB using the button below."
				:selected-product-reference="model.productReference"
				:selected-product-type="model.typeOfHeatBattery"
				:page-url="route.fullPath"
				:page-index="index"
				:on-incompatible-energy-source="onIncompatibleEnergySource"
				@product-loaded="handleProductLoaded"
			/>
		</ClientOnly>
		<FormKit
			id="maxFlowTemp"
			name="maxFlowTemp"
			label="Maximum flow temperature"
			:help="`Enter the highest temperature that the battery is allowed to operate at for ${page}`"
			type="govInputWithUnit"
			:unit="celsius"
			validation="required"
			:data-field="page == 'domestic hot water' ? 'HotWaterSource.*.HeatSource.*.temp_flow_limit_upper' :  'SpaceHeatSystem.*HeatSource.temp_flow_limit_upper'"
		/>
		<FormKit
			id="numberOfUnits"
			type="govInputInt"
			name="numberOfUnits"
			label="Number of units"
			help="Enter the number of heat battery units with this specification"
			validation="required | isInteger | min:1"
			:validation-messages="{
				isInteger: `Number of units must be an integer.`,
			}"
		/>
		<FieldsEnergySupplies
			v-if="fuel === ''"
			id="energySupply"
			name="energySupply"
			label="Energy supply"
			help="Select the relevant energy supply that has been added previously"
		/>
	</div>
</template>