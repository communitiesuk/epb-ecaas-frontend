<script setup lang="ts">
import type { InstantElectricHeaterModelType } from "~/pages/space-heating/heat-emitters/[heatEmitter]/index.vue";

defineProps<{
	model: InstantElectricHeaterModelType
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
		id="ratedPower"
		type="govInputWithSuffix"
		label="Rated power"
		name="ratedPower"
		validation="required | number"
		suffix-text="kW" />
	<FormKit
		id="convectionFractionForHeating"
		type="govInputFloat"
		label="Convection fraction for heating"
		name="convectionFractionForHeating"
		help="Specify the portion of heat transfered through convection (0 to 1), where 1 means all heat is convective"
		validation="required | number | min:0 | max:1"/>
	<FormKit
		id="numOfHeaters"
		name="numOfHeaters"
		type="govInputInt"
		label="Number of instant electric heaters"
		help="Enter the number of heaters with this specification in the dwelling" />
</template>
