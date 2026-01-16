<script setup lang="ts">
import { ecoDesignControllerOptions, isInteger, radiatorTypes } from "#imports";
import type { RadiatorModelType } from "~/pages/space-heating-new/heat-emitters/[heatEmitter]/index.vue";

const route = useRoute();
const store = useEcaasStore();
const { getStoreIndex } = useForm();

defineProps<{
	model: RadiatorModelType
}>();

const heatSourceStoreData = store.spaceHeatingNew.heatSource.data;
const index = getStoreIndex(heatSourceStoreData);

</script>

<template>
	<FormKit
		id="typeOfRadiator" type="govRadios" label="Type of radiator" name="typeOfRadiator" :options="radiatorTypes"
		validation="required" />
	<template v-if="model.typeOfRadiator">
		<FormKit id="name" type="govInputText" label="Name" name="name" validation="required" />
		<FormKit
			id="selectRadiator" type="govPcdbProduct" label="Select a heat pump" name="productReference"
			validation="required" :help="''" :selected-product-reference="''" :selected-product-type="''" :page-url="''"
			:page-index="1" />
		<FieldsHeatGenerators
			id="heatSource" name="heatSource" label="Heat source"
			help="Select the relevant heat source that has been added previously" data-field="SpaceHeatSystem.*.HeatSource" />
		<FormKit
			id="ecoDesignControllerClass" type="govDropdown" label="Eco design controller class"
			name="ecoDesignControllerClass" validation="required" :options="ecoDesignControllerOptions"
			data-field="SpaceHeatSystem.*.ecodesign_controller" />
		<FormKit
			id="designFlowTemp" type="govInputWithSuffix" label="Design flow temperature" name="designFlowTemp"
			validation="required | number" suffix-text="°C"
			help="Enter the temperature at which water is delivered to the heating system during the coldest expected conditions. Typically between 35 and 55 °C." />
		<FormKit
			id="minFlowTemp" type="govInputWithSuffix" label="Minimum flow temperature " name="minFlowTemp"
			validation="required | number" suffix-text="l/s" />
		<FormKit
			id="designTempDiffAcrossEmitters" type="govInputWithSuffix"
			label="Design temperature difference across the emitters" name="designTempDiffAcrossEmitters"
			validation="required | number" suffix-text="°C"
			help="The temperature difference between the flow and return water temperatures at each emitter. Typically between 5 and 15°C." />
		<FormKit
			id="hasVariableFlowRate" type="govBoolean" label="Is there a variable flow rate?"
			name="hasVariableFlowRate" validation="required" />
		<FormKit
			v-if="model.hasVariableFlowRate" id="maxFlowRate" type="govInputWithSuffix" label="Maximum flow rate"
			name="maxFlowRate" validation="required | number" suffix-text="l/s" />
		<FormKit
			v-if="model.hasVariableFlowRate" id="minFlowRate" type="govInputWithSuffix" label="Minimum flow rate"
			name="minFlowRate" validation="required | number" suffix-text="l/s" />
		<FormKit
			v-if="model.hasVariableFlowRate === false" id="designFlowRate" type="govInputWithSuffix"
			label="Design flow rate" name="designFlowRate" validation="required | number" suffix-text="l/s" />
		<FormKit
			id="numOfRadiators" name="numOfRadiators" type="govInputInt" label="Number of radiators"
			help="Enter the number of radiators in this wet distribution system with this specification"
			:validation-rules="{ isInteger }" validation="required | isInteger | min: 1" :validation-messages="{
				isInteger: `Number of radiators must be an integer.`,
			}" />
	</template>
</template>
