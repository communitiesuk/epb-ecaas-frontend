<script setup lang="ts">
import type { WarmAirHeaterModelType } from "~/pages/space-heating-new/heat-emitters/[heatEmitter]/index.vue";




defineProps<{
	model: WarmAirHeaterModelType
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
		id="designTempDiffAcrossEmitters"
		type="govInputWithSuffix"
		label="Design temperature difference across the emitters"
		name="designTempDiffAcrossEmitters"
		validation="required | number"
		suffix-text="°C"
		help="The temperature difference between the flow and return water temperatures at each emitter. Typically between 5 and 15°C." />
	<FormKit
		id="convectionFraction"
		type="govInputFloat"
		label="Convection fraction"
		name="convectionFraction"
		validation="required"
		help="Enter the proportion of heat the heater emits through convection"/>	
	<FieldsHeatGenerators
		id="heatSource"
		name="heatSource"
		label="Heat source"
		help="Select the relevant heat source that has been added previously"
		data-field="SpaceHeatSystem.*.HeatSource" />
	<FormKit
		id="numOfWarmAirHeaters"
		name="numOfWarmAirHeaters"
		type="govInputInt"
		label="Number of warm air heaters"
		help="Enter the number of warm air heaters with this specification in the dwelling" />
</template>
