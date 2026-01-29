<script setup lang="ts">
import { ecoDesignControllerOptions, isInteger, radiatorTypes } from "#imports";
import type { RadiatorModelType } from "~/pages/space-heating/heat-emitters/[heatEmitter]/index.vue";
import type { EcoControlClassesWithExtraOptions } from "~/stores/ecaasStore.schema";

const route = useRoute();
const ecoClasses: EcoControlClassesWithExtraOptions[] = ["2", "3", "6", "7"];

defineProps<{
	model: RadiatorModelType,
	index: number,
}>();

const emit = defineEmits(["update-radiator-model"]);
</script>

<template>
	<FormKit
		id="typeOfRadiator"
		type="govRadios"
		label="Type of radiator"
		name="typeOfRadiator"
		:options="radiatorTypes"
		validation="required"
		@click="emit('update-radiator-model', 'typeOfRadiator')"/>
	<template v-if="model.typeOfRadiator">
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			name="name"
			validation="required" />
		<FormKit
			id="selectRadiator"
			type="govPcdbProduct"
			label="Select a product"
			name="selectRadiator"
			validation="required"
			help="Select a radiator type from the PCDB using the button below."
			:selected-product-reference="model.productReference"
			:selected-product-type="model.typeOfHeatEmitter"
			:page-url="route.fullPath"
			:page-index="index" />
		<FieldsHeatSources
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
			v-if="ecoClasses.includes(model.ecoDesignControllerClass as EcoControlClassesWithExtraOptions)"
			id="minOutdoorTemp"
			type="govInputWithSuffix"
			label="Minimum outdoor temperature"
			name="minOutdoorTemp"
			validation="required | number"
			suffix-text="°C"
			help="This is the coldest outdoor temperature expected for the dwelling. This is typically the temperature at which the design flow temperature operates." />
		<FormKit
			v-if="ecoClasses.includes(model.ecoDesignControllerClass as EcoControlClassesWithExtraOptions)"
			id="maxOutdoorTemp"
			type="govInputWithSuffix"
			label="Maximum outdoor temperature"
			name="maxOutdoorTemp"
			validation="required | number"
			suffix-text="°C"
			help="This is the warmest outdoor temperature expected where the heating system is still active" />
		<FormKit
			v-if="ecoClasses.includes(model.ecoDesignControllerClass as EcoControlClassesWithExtraOptions)"
			id="minFlowTemp"
			type="govInputWithSuffix"
			label="Minimum flow temperature "
			name="minFlowTemp"
			help="Minimum flow temperature when using weather compensation"
			validation="required | number"
			suffix-text="°C" />
		<FormKit
			id="designFlowTemp"
			type="govInputWithSuffix"
			label="Design flow temperature"
			name="designFlowTemp"
			validation="required | number"
			suffix-text="°C"
			help="Enter the temperature at which water is delivered to the heating system during the coldest expected conditions. Typically between 35 and 55 °C." />
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
			v-if="model.typeOfRadiator === 'standard'"
			id="length"
			type="govInputWithSuffix"
			label="Length"
			name="length"
			validation="required | number"
			suffix-text="mm" />
		<FormKit
			id="numOfRadiators"
			name="numOfRadiators"
			type="govInputInt"
			label="Number of radiators"
			help="Enter the number of radiators in this wet distribution system with this specification"
			:validation-rules="{ isInteger }"
			validation="required | isInteger | min: 1"
			:validation-messages="{
				isInteger: `Number of radiators must be an integer.`,
			}" />
	</template>
</template>
