<script setup lang="ts">
import { FieldsHeatSources } from "#components";
import { ecoClasses, ecoDesignControllerOptions } from "#imports";
import { tempDiffEmitDsgnWetDistributionZod } from "~/stores/ecaasStore.schema";
import { zodTypeAsFormKitValidation } from "~/utils/zodToFormKitValidation";
import type { AnyPcdbProduct } from "~/pcdb/pcdb.types";

defineProps<{
	model: WetDistributionSystemData;
	index: number;
}>();

const productBrandNames = ref<string[]>([]);

function handleProductLoaded(product: AnyPcdbProduct) {
	if (hasModelDetails(product)) {
		productBrandNames.value.push(product.brandName);
	}
}
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
	<WetDistributionEmittersSection :index="index" @product-loaded="handleProductLoaded" />
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
		label="Outdoor temperature for maximum flow temperature"
		name="minOutdoorTemp"
		validation="required | number"
		suffix-text="°C"
		help="Enter the outdoor temperature when the heat pump starts to run at the maximum flow temperature"
	>
		<GovDetails summary-text="Help with this input">
			<p class="govuk-body">When it is mild outside (for example, 12°C) the building loses very little heat. The heating system responds by dropping the water flow temperature to a minimum (for example, 35°C).</p>
			<p class="govuk-body">When it is freezing outside (for example, -3°C): The building loses heat rapidly. The system responds by cranking the flow temperature up to its maximum design limit (for example, 55°C) to keep up with the demand.</p>
			<p class="govuk-body">Here, you need to enter the outdoor temperature at which the heating system starts to use its maximum possible flow temperature. This should be lower than the outdoor temperature for minimum flow temperature.</p>
		</GovDetails>
	</FormKit>
	<FormKit
		v-if="ecoClasses.includes(model.ecoDesignControllerClass as EcoControlClassesWithExtraOptions)"
		id="maxOutdoorTemp"
		type="govInputWithSuffix"
		label="Outdoor temperature for minimum flow temperature"
		name="maxOutdoorTemp"
		validation="required | number"
		suffix-text="°C"
		help="Enter the outdoor temperature when the heat pump starts to run at the minimum flow temperature"
	>
		<GovDetails summary-text="Help with this input">
			<p class="govuk-body">When it is mild outside (for example, 12°C) the building loses very little heat. The heating system responds by dropping the water flow temperature to a minimum (for example, 35°C).</p>
			<p class="govuk-body">When it is freezing outside (for example, -3°C): The building loses heat rapidly. The system responds by cranking the flow temperature up to its maximum design limit (for example, 55°C) to keep up with the demand.</p>
			<p class="govuk-body">Here, you need to enter the outdoor temperature at which the heating system starts to use its minimum possible flow temperature. This should be higher than the outdoor temperature for maximum flow temperature.</p>
		</GovDetails>
	</FormKit>
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
		:validation="zodTypeAsFormKitValidation(tempDiffEmitDsgnWetDistributionZod)"
		suffix-text="°C"
		help="Enter the temperature difference between the flow and return water temperatures. Typically between 5 and 15°C." />
	<FieldsVariableFlowRate :model="model" />
	<FieldsPercentageRecirculated :model="model" />
	<HemDefaultProductWarning :brand-names="productBrandNames" />
</template>


