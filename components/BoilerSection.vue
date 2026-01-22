<script setup lang="ts">
import type { AdjacentSpaceType, HeatSourceData } from "#imports";
import { uniqueName } from "#imports";
import { boilerTypes, type BoilerLocationDisplay } from "~/utils/display";
const route = useRoute();
const store = useEcaasStore();

defineProps<{
	model: Extract<HeatSourceData, { "typeOfHeatSource": "boiler" }>;
	index: number;
}>();

const heatSourceStoreData = store.spaceHeatingNew.heatSource.data;

const locationOfBoilerOptions = {
	"heatedSpace": "Heated space",
	"unheatedSpace": "Unheated space",
} as const satisfies Record<AdjacentSpaceType, BoilerLocationDisplay>;

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
		@click="emit('update-boiler-model', 'typeOfBoiler')" />
	<template v-if="model.typeOfBoiler">
		<FormKit
			id="name"
			type="govInputText"
			label="Name"
			help="Provide a name for this element so that it can be identified later"
			name="name"
			:value="model.name"
			:validation-rules="{ uniqueName: uniqueName(heatSourceStoreData, { index }) }"
			validation="required | uniqueName"
			:validation-messages="{
				uniqueName: 'An element with this name already exists. Please enter a unique name.'
			}" />
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
			:page-index="index" />
		<FormKit
			v-if="model.typeOfBoiler"
			id="locationOfBoiler"
			type="govRadios"
			label="Location of boiler"
			:options="locationOfBoilerOptions"
			name="locationOfBoiler"
			validation="required" />
	</template>
</template>