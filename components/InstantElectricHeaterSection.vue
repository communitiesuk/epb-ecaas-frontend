<script setup lang="ts">
import type { InstantElectricHeaterModelType } from "~/pages/space-heating-new/heat-emitters/[heatEmitter]/index.vue";

const route = useRoute();
const store = useEcaasStore();
const { getStoreIndex } = useForm();

defineProps<{
	model: InstantElectricHeaterModelType
}>();
const heatSourceStoreData = store.spaceHeatingNew.heatSource.data;
const index = getStoreIndex(heatSourceStoreData);

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
		id="numOfHeatersWithThisSpec"
		name="numOfHeatersWithThisSpec"
		type="govInputInt"
		label="Number of heaters with this spec"
		help="Enter the number of heaters with this specification in the dwelling" />
</template>
