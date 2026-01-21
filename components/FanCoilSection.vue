<script setup lang="ts">
import { ecoDesignControllerOptions } from "#imports";
import type { FanCoilModelType } from "~/pages/space-heating-new/heat-emitters/[heatEmitter]/index.vue";

const route = useRoute();

defineProps<{
	model: FanCoilModelType
	index: number;
}>();


</script>

<template>
	<FormKit
		id="name"
		type="govInputText"
		label="Name"
		name="name"
		validation="required" />
	<FormKit
		id="selectFanCoil"
		type="govPcdbProduct"
		label="Select product"
		name="productReference"
		validation="required"
		help="Select a fan coil type from the PCDB using the button below."
		:selected-product-reference="model.productReference"
		:selected-product-type="model.typeOfHeatEmitter"
		:page-url="route.fullPath"
		:page-index="index" />
	<FieldsHeatGenerators
		id="heatSource"
		name="heatSource"
		label="Heat source"
		help="Select the relevant heat source that has been added previously"
		data-field="SpaceHeatSystem.*.HeatSource" />
	<FormKit
		id="ecoDesignControllerClass"
		type="govDropdown"
		label="Eco design controller class"
		name="ecoDesignControllerClass"
		validation="required"
		:options="ecoDesignControllerOptions"
		data-field="SpaceHeatSystem.*.ecodesign_controller" />
	<FormKit
		id="designFlowTemp"
		type="govInputWithSuffix"
		label="Design flow temperature"
		name="designFlowTemp"
		validation="required | number"
		suffix-text="°C"
		help="Enter the temperature at which water is delivered to the heating system during the coldest expected conditions. Typically between 35 and 55 °C." />
	<FormKit
		id="minFlowTemp"
		type="govInputWithSuffix"
		label="Minimum flow temperature "
		name="minFlowTemp"
		validation="required | number"
		suffix-text="°C" />
	<FormKit
		id="designTempDiffAcrossEmitters"
		type="govInputWithSuffix"
		label="Design temperature difference across the emitters"
		name="designTempDiffAcrossEmitters"
		validation="required | number"
		suffix-text="°C"
		help="The temperature difference between the flow and return water temperatures at each emitter. Typically between 5 and 15°C." />
	<FormKit
		id="hasVariableFlowRate"
		type="govBoolean"
		label="Is there a variable flow rate?"
		name="hasVariableFlowRate"
		validation="required" />
	<FormKit
		v-if="model.hasVariableFlowRate"
		id="maxFlowRate"
		type="govInputWithSuffix"
		label="Maximum flow rate"
		name="maxFlowRate"
		validation="required | number"
		suffix-text="l/s" />
	<FormKit
		v-if="model.hasVariableFlowRate"
		id="minFlowRate"
		type="govInputWithSuffix"
		label="Minimum flow rate"
		name="minFlowRate"
		validation="required | number"
		suffix-text="l/s" />
	<FormKit
		v-if="model.hasVariableFlowRate === false"
		id="designFlowRate"
		type="govInputWithSuffix"
		label="Design flow rate"
		name="designFlowRate"
		validation="required | number"
		suffix-text="l/s" />
	<FormKit
		id="numOfFanCoils"
		name="numOfFanCoils"
		type="govInputWithSuffix"
		label="Number  of fan coils"
		suffix-text="m²"
		validation="required" />
</template>
