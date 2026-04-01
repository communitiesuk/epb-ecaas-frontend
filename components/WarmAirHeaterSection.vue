<script setup lang="ts">
import type { WarmAirHeaterModelType } from "~/pages/space-heating/heat-emitters/[heatEmitter]/index.vue";


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
		help="Enter the intended difference between the temperature of the air entering the heater and leaving it"/>
	<FormKit
		id="convectionFraction"
		type="govInputFloat"
		label="Convection fraction"
		name="convectionFraction"
		validation="required"
		help="Enter the proportion of heat the heater transfers to the room by the circulation of warm air rather than directly (for example by radiation)"/>
	<FieldsHeatSources
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
