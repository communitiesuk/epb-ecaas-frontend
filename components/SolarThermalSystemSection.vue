<script setup lang="ts">
import type { HeatSourceData } from "#imports";
import { isInteger, uniqueName } from "#imports";

const store = useEcaasStore();
const { getStoreIndex } = useForm();

defineProps<{
	model: Extract<HeatSourceData, { "typeOfHeatSource": HeatSourceType.solarThermalSystem }>;
}>();

const heatSourceStoreData = store.spaceHeatingNew.heatSource.data;
const index = getStoreIndex(heatSourceStoreData);


const locationOfCollectorLoopPipingOptions = {
	"outside": "Outside",
	"heatedSpace": "Heated space",
	"unheatedSpace": "Unheated space",
} as const satisfies Record<LocationOfCollectorLoopPipingType, LocationOfCollectorLoopPipingTypeDisplay>;

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
		id="locationOfCollectorLoopPiping"
		type="govRadios"
		label="Location of collector loop piping"
		:options="locationOfCollectorLoopPipingOptions"
		name="locationOfCollectorLoopPiping"
		validation="required"
	/>
	<FormKit
		id="collectorModuleArea"
		type="govInputWithSuffix"
		suffix-text="m²"
		label="Collector module area"
		name="collectorModuleArea"
		validation="required | number | min:0 | max:10000"
	/>
	<FormKit
		id="numberOfCollectorModules"
		type="govInputInt"
		label="Number of collector modules"
		name="numberOfCollectorModules"
		:validation-rules="{ isInteger }"
		validation="required | isInteger | min:1"
		:validation-messages="{
			isInteger: `Number of collector modules must be an integer.`,
		}"
	/>
	<FormKit
		id="peakCollectorEfficiency"
		type="govInputInt"
		label="Peak collector efficiency"
		name="peakCollectorEfficiency"
		validation="required | number | min:0 | max:1"
		help="Enter the peak efficiency of the solar collectors, as a decimal between 0 and 1"
	/>
	<FormKit
		id="incidenceAngleModifier"
		type="govInputInt"
		label="Incidence angle modifier"
		name="incidenceAngleModifier"
		validation="required | number | min:0 | max:1"
		help="Enter the hemispherical incidence angle modifier, as a decimal between 0 and 1"
	/>
	<FormKit
		id="firstOrderHeatLossCoefficient"
		type="govInputWithSuffix"
		suffix-text="W/(m²·K)"
		label="First order heat loss coefficient"
		name="firstOrderHeatLossCoefficient"
		validation="required | number | min:0 | max:10000"
	/>
	<FormKit
		id="secondOrderHeatLossCoefficient"
		type="govInputWithSuffix"
		suffix-text="W/(m²·K²)"
		label="Second order heat loss coefficient"
		name="secondOrderHeatLossCoefficient"
		validation="required | number | min:0 | max:10000"
	/>
	<FormKit
		id="heatLossCoefficientOfSolarLoopPipe"
		type="govInputWithSuffix"
		suffix-text="W/K"
		label="Heat loss coefficient of solar loop piping"
		name="heatLossCoefficientOfSolarLoopPipe"
		validation="required | number | min:0 | max:10000"
	/>
	<FormKit
		id="collectorMassFlowRate"
		type="govInputWithSuffix"
		suffix-text="kg/(s·m²)"
		label="Collector mass flow rate"
		name="collectorMassFlowRate"
		validation="required | number | min:0 | max:10000"
	/>
	<FormKit
		id="powerOfCollectorPump"
		type="govInputWithSuffix"
		suffix-text="W"
		label="Power of collector pump"
		name="powerOfCollectorPump"
		validation="required | number | min:0 | max:10000"
	/>
	<FormKit
		id="powerOfCollectorPumpController"
		type="govInputWithSuffix"
		suffix-text="W"
		label="Power of collector pump controller"
		name="powerOfCollectorPumpController"
		validation="required | number | min:0 | max:10000"
	/>
	<FormKit
		id="pitch"
		type="govInputWithSuffix"
		label="Pitch"
		help="Enter the tilt angle, or inclination, of the PV array from horizontal measured upwards facing, where 0° is a horizontal surface and 90° is a vertical surface"
		name="pitch"
		validation="required | number | min:0 | max: 90"
		suffix-text="°"
		data-field="Zone.BuildingElement.*.pitch"
	/>
	<FieldsOrientation details-caption="To define the orientation, measure the angle of the panel clockwise from true North, accurate to the nearest degree. If the panel is facing true north then the orientation is 0°. If the panel is facing south then the orientation is 180°." cleared-non-llm />
</template>