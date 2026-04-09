<script setup lang="ts">
import type { HeatSourceData } from "#imports";
import { uniqueName } from "#imports";
import type { SchemaBoilerLocationType } from "~/schema/aliases";
import { boilerTypes, type BoilerLocationDisplay } from "~/utils/display";
import { hasPackagedProduct } from "~/utils/packagedProduct";
import { celsius } from "~/utils/units/temperature";

const route = useRoute();
const store = useEcaasStore();

defineProps<{
	model: Extract<HeatSourceData, { "typeOfHeatSource": "boiler" }>;
	index: number;
	page: HeatSourceSectionPage;
}>();

const heatSources = getCombinedHeatSources(store);

const locationOfBoilerOptions = {
	"internal": "Heated space",
	"external": "Unheated space",
} as const satisfies Record<SchemaBoilerLocationType, BoilerLocationDisplay>;

const emit = defineEmits(["update-boiler-model"]);
</script>

<template>
	<FormKit
		id="typeOfBoiler"
		type="govRadios"
		label="Type of boiler"
		:options="boilerTypes"
		name="typeOfBoiler"
		validation="required"
		:disabled="hasPackagedProduct(model)"
		@click="emit('update-boiler-model', 'typeOfBoiler')"
	/>
	<template v-if="model.typeOfBoiler">
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			:value="model.name"
			:validation-rules="{ uniqueName: uniqueName(heatSources, { id: model.id }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name in domestic hot water or space heating already exists. Please enter a unique name.'
			}"
		/>
		<FormKit
			v-if="model.typeOfBoiler"
			id="selectBoiler"
			type="govPcdbProduct"
			label="Select a boiler"
			name="productReference"
			validation="required"
			help="Select the boiler model from the PCDB using the button below."
			:selected-product-reference="model.productReference"
			:selected-product-type="model.typeOfBoiler"
			:page-url="route.fullPath"
			:page-index="index"
			:disabled="hasPackagedProduct(model)"
		/>
		<FormKit
			v-if="model.typeOfBoiler && model.needsSpecifiedLocation"
			id="specifiedLocation"
			type="govRadios"
			label="Location of boiler"
			:options="locationOfBoilerOptions"
			name="locationOfBoiler"
			validation="required"
			:disabled="hasPackagedProduct(model)"
		/>
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
	</template>
</template>