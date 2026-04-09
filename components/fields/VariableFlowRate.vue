<script setup lang="ts">
import { flowRateWetDistributionZod } from "~/stores/ecaasStore.schema";
import { zodTypeAsFormKitValidation } from "~/utils/zodToFormKitValidation";

defineProps<{
	model: {
		hasVariableFlowRate?: boolean | null;
	};
}>();
</script>

<template>
	<FormKit
		id="hasVariableFlowRate"
		type="govBoolean"
		label="Is there a variable flow rate?"
		help="There is a variable flow rate if the system can modulate the flow using, for example, inverter-driven pumps"
		name="hasVariableFlowRate"
		validation="required" />
	<FormKit
		v-if="model.hasVariableFlowRate"
		id="maxFlowRate"
		type="govInputWithSuffix"
		label="Maximum flow rate"
		name="maxFlowRate"
		:validation="zodTypeAsFormKitValidation(flowRateWetDistributionZod)"
		suffix-text="l/min" />
	<FormKit
		v-if="model.hasVariableFlowRate"
		id="minFlowRate"
		type="govInputWithSuffix"
		label="Minimum flow rate"
		name="minFlowRate"
		:validation="zodTypeAsFormKitValidation(flowRateWetDistributionZod)"
		suffix-text="l/min" />
	<FormKit
		v-if="model.hasVariableFlowRate === false"
		id="designFlowRate"
		type="govInputWithSuffix"
		label="Design flow rate"
		name="designFlowRate"
		:validation="zodTypeAsFormKitValidation(flowRateWetDistributionZod)"
		suffix-text="l/min" />
</template>