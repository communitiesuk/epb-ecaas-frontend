<script setup lang="ts">
import { FieldsHeatSources } from "#components";
import { ecoClasses, ecoDesignControllerOptions } from "#imports";

defineProps<{
	model: WetDistributionSystemData;
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
	<FieldsHeatSources
		id="heatSource"
		name="heatSource"
		label="Heat source"
		help="Select the relevant heat source that has been added previously"
		data-field="SpaceHeatSystem.*.HeatSource" />
	<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">	
	<WetDistributionEmittersSection
		:index="index" />
	<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
	<h2 class="govuk-heading-l">Flow temperature and rate</h2>
	<FormKit
		id="ecoDesignControllerClass"
		type="govDropdown"
		label="Eco design controller class"
		name="ecoDesignControllerClass"
		validation="required"
		:options="ecoDesignControllerOptions"
		data-field="SpaceHeatSystem.*.ecodesign_controller" />
	<FormKit
		v-if="ecoClasses.includes(model.ecoDesignControllerClass as EcoControlClassesWithExtraOptions)"
		id="minOutdoorTemp"
		type="govInputWithSuffix"
		label="Minimum outdoor temperature"
		name="minOutdoorTemp"
		validation="required | number"
		suffix-text="°C"
		help="Enter the coldest outdoor temperature expected for the dwelling. This is typically the temperature at which the design flow temperature operates." />
	<FormKit
		v-if="ecoClasses.includes(model.ecoDesignControllerClass as EcoControlClassesWithExtraOptions)"
		id="maxOutdoorTemp"
		type="govInputWithSuffix"
		label="Maximum outdoor temperature"
		name="maxOutdoorTemp"
		validation="required | number"
		suffix-text="°C"
		help="Enter the warmest outdoor temperature expected where the heating system is still active" />
	<FormKit
		v-if="ecoClasses.includes(model.ecoDesignControllerClass as EcoControlClassesWithExtraOptions)"
		id="minFlowTemp"
		type="govInputWithSuffix"
		label="Minimum flow temperature "
		name="minFlowTemp"
		help="Enter the lowest flow temperature the heating system will allow when using weather compensation"
		validation="required | number"
		suffix-text="°C" />
	<FormKit
		id="designFlowTemp"
		type="govInputWithSuffix"
		label="Design flow temperature"
		name="designFlowTemp"
		validation="required | number"
		suffix-text="°C"
		help="Enter the temperature at which water is delivered to the heating system during the coldest expected conditions. Typically between 35 and 55 °C." />
	<FormKit
		id="designTempDiffAcrossEmitters"
		type="govInputWithSuffix"
		label="Design temperature difference across the emitters"
		name="designTempDiffAcrossEmitters"
		validation="required | number"
		suffix-text="°C"
		help="Enter the temperature difference between the flow and return water temperatures. Typically between 5 and 15°C." />
	<FieldsVariableFlowRate :model="model" />
	<FieldsPercentageRecirculated :model="model" />

</template>

<style scoped>
.shading-summary :deep(.govuk-summary-list__key),
.shading-summary :deep(.govuk-summary-list__value) {
    font-size: 1.1875rem;
}

:deep(.govuk-fieldset__legend--m),
:deep(.govuk-body--m),
:deep(.govuk-label--m) {
    font-size: 1.1875rem !important;
}
</style>

