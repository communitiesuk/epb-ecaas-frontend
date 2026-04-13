<script setup lang="ts">
import { celsius } from "~/utils/units/temperature";

defineProps<{
	model: Extract<HeatSourceData, { "typeOfHeatSource": "heatInterfaceUnit" }>;
	page: "domestic hot water" | "space heating";
	help?: string;
}>();
</script>
<template>

	<FormKit
		id="maxFlowTemp"
		name="maxFlowTemp"
		label="Maximum flow temperature"
		:help="help ?? `Enter the highest temperature that the battery is allowed to operate at for ${page}`"
		type="govInputWithUnit"
		:unit="celsius"
		validation="required"
		:data-field="page == 'domestic hot water' ? 'HotWaterSource.*.HeatSource.*.temp_flow_limit_upper' :  'SpaceHeatSystem.*HeatSource.temp_flow_limit_upper'"
	/>
</template>