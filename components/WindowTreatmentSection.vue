<script setup lang="ts">
import type { SchemaWindowTreatmentControl, SchemaWindowTreatmentType } from "~/schema/aliases";
import { deltaRZod, fraction } from "~/stores/ecaasStore.schema";
import { zodTypeAsFormKitValidation } from "~/utils/zodToFormKitValidation";

const props = defineProps<{
	treatmentSectionType: "door" | "window";
}>();

const windowTreatmentTypeOptions: Record<SchemaWindowTreatmentType, SnakeToSentenceCase<SchemaWindowTreatmentType>> = {
	curtains: "Curtains",
	blinds: "Blinds",
};

const windowTreatmentControlsOptions: Record<SchemaWindowTreatmentControl, "Manual" | "Automatic"> = {
	manual: "Manual",
	auto_motorised: "Automatic",
};
</script>

<template>
	<FormKit
		id="treatmentType"
		type="govRadios"
		:options="windowTreatmentTypeOptions"
		label="Type of window dressing"
		help="Select curtain if it’s designed to keep heat in, and blind if it’s designed to keep the sun out"
		name="treatmentType"
		validation="required"
	/>
	<FormKit
		id="treatmentControls"
		type="govRadios"
		:options="windowTreatmentControlsOptions"
		label="Control type"
		name="treatmentControls"
		validation="required"
	/>
	<FormKit
		id="thermalResistivityIncrease"
		type="govInputWithSuffix"
		suffix-text="W/(m²·K)"
		label="Thermal resistivity increase"
		help="Enter the thermal resistivity of the curtain or blind."
		name="thermalResistivityIncrease"
		:validation="zodTypeAsFormKitValidation(deltaRZod)"
	/>
	<FormKit
		id="solarTransmittanceReduction"
		type="govInputFloat"
		label="Solar transmittance reduction"
		:help="`Enter the proportion of solar energy allowed through the ${props.treatmentSectionType} which is allowed into the zone when curtain or blind is closed. This should be a decimal between 0 and 1.`"
		name="solarTransmittanceReduction"
		:validation="zodTypeAsFormKitValidation(fraction)"
	/>
</template>

