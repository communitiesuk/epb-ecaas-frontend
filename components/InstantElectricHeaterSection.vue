<script setup lang="ts">
import type { InstantElectricHeaterModelType } from "~/pages/space-heating/heat-emitters/[heatEmitter]/index.vue";
const route = useRoute();

defineProps<{
	model: InstantElectricHeaterModelType;
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
		id="selectInstantElectricHeater"
		type="govPcdbProduct"
		label="Select an instant electric heater"
		name="productReference"
		validation="required"
		help="Select the instant electric heater from the PCDB using the button below."
		:selected-product-reference="model.productReference"
		:selected-product-type="model.typeOfHeatEmitter"
		:page-url="route.fullPath"
		:page-index="index" />
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
