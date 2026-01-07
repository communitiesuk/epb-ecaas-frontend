<script setup lang="ts">
import { uniqueName } from "#imports";

const route = useRoute();
const store = useEcaasStore();
const { getStoreIndex } = useForm();

defineProps<{
	model: Extract<HeatSourceData, { "typeOfHeatSource": "heatNetwork" }>;
}>();

const heatSourceStoreData = store.spaceHeatingNew.heatSource.data;
const index = getStoreIndex(heatSourceStoreData);

const heatNetworkTypeOptions = {
	"sleevedDistrict": "Sleeved district heat network",
	"unsleevedDistrict": "Unsleeved district heat network",
	"communal": "Communal heat network",
} as const satisfies Record<HeatNetworkType, HeatNetworkTypeDisplay>;

const emit = defineEmits(["update-heat-network-model"]);

</script>

<template>	
	<FormKit
		id="name"
		type="govInputText"
		label="Name"
		help="Provide a name for this element so that it can be identified later"
		name="name"
		:validation-rules="{ uniqueName: uniqueName(heatSourceStoreData, { index }) }"
		validation="required | uniqueName"
		:validation-messages="{
			uniqueName: 'An element with this name already exists. Please enter a unique name.'
		}"
	/>
	<FormKit
		id="typeOfHeatNetwork"
		type="govRadios"
		label="Type of heat network"
		:options="heatNetworkTypeOptions"
		name="typeOfHeatNetwork"
		validation="required"
		@click="emit('update-heat-network-model', 'typeOfHeatNetwork')"

	/>
	<FormKit
		id="isHeatNetworkInPcdb"
		type="govBoolean"
		label="Is the heat network in the PCDB?"
		name="isHeatNetworkInPcdb"
		validation="required"
	/>
	<FormKit
		v-if="model.isHeatNetworkInPcdb"
		id="selectHeatNetwork"
		type="govPcdbProduct"
		label="Select a heat network"
		name="productReference"
		validation="required"
		help="Select the heat network type from the PCDB using the button below."
		:selected-product-reference="model.typeOfHeatNetwork"
		:selected-product-type="heatNetworkTypeOptions[model.typeOfHeatNetwork]"
		:page-url="route.fullPath"
		:page-index="index"
	/>
	<FieldsEnergySupplies
		v-if="model.isHeatNetworkInPcdb"
		id="energySupply"
		name="energySupply"
		label="Energy supply"   
		help="Select the relevant energy supply that has been added previously"
	/>
	<FormKit
		v-if="model.isHeatNetworkInPcdb === false"
		id="emissionsFactor"
		type="govInputWithSuffix"
		label="Emissions factor"
		suffix-text="kgCO₂e/kWh"
		name="emissionsFactor"
		validation="required | number"
		help="Equivalent amount of CO₂ emissions per KWh used. CO₂e is the CO₂ equivalent, including other greenhouse gases like methane which may have been emitted in addition to CO₂."
	/>
	<FormKit
		v-if="model.isHeatNetworkInPcdb === false"
		id="outOfScopeEmissionsFactor"
		type="govInputWithSuffix"
		label="Emissions factor including out of scope emissions"
		suffix-text="kgCO₂e/kWh"
		name="outOfScopeEmissionsFactor"
		validation="required | number"
		help="Equivalent amount of CO₂ emissions per kWh used, including out-of-scope emissions"
	/>
	<FormKit
		v-if="model.isHeatNetworkInPcdb === false"
		id="primaryEnergyFactor"
		type="govInputWithSuffix"
		label="Primary energy factor"
		suffix-text="kWh/kWh"
		name="primaryEnergyFactor"
		validation="required | number"
		help="For every kWh delivered to the home, the actual amount of primary energy in kWh needed to deliver that kWh."
	/>
	<FormKit
		v-if="model.isHeatNetworkInPcdb === false"
		id="canEnergyBeExported"
		type="govBoolean"
		label="Can energy from the heat network be exported?"
		name="canEnergyBeExported"
		validation="required"
	/>
	<FormKit
		v-if="model.isHeatNetworkInPcdb !== undefined"
		id="usesHeatInterfaceUnits"
		type="govBoolean"
		label="Will the heat network use heat interface units?"
		name="usesHeatInterfaceUnits"
		validation="required"
	/>
	<FormKit
		v-if="model.usesHeatInterfaceUnits === true"
		id="selectHeatInterfaceUnit"
		type="govPcdbProduct"
		label="Select a heat interface unit"
		name="heatInterfaceUnitProductReference"
		validation="required"
		help="Select the heat interface unit type from the PCDB using the button below."
		:selected-product-reference="model.typeOfHeatNetwork"
		:selected-product-type="heatNetworkTypeOptions[model.typeOfHeatNetwork]"
		:page-url="route.fullPath"
		:page-index="index"
	/>
</template>