<script setup lang="ts">
import type { InstantElectricHeaterModelType } from "~/pages/space-heating/heat-emitters/[heatEmitter]/index.vue";
import { instantElectricHeaterRatedPowerZod, numOfInstantElectricHeatersZod } from "~/stores/ecaasStore.schema";
import { convectiveTypes } from "~/utils/display";
import { zodTypeAsFormKitValidation } from "~/utils/zodToFormKitValidation";

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
		id="ratedPower"
		type="govInputWithSuffix"
		label="Rated power"
		name="ratedPower"
		:validation="zodTypeAsFormKitValidation(instantElectricHeaterRatedPowerZod)"
		help="Enter the maximum power consumption of the heater"
		suffix-text="kW" />
	<FormKit
		id="convectiveType"
		type="govRadios"
		label="Type of convection"
		:options="convectiveTypes"
		name="convectiveType"
		validation="required">
		<GovDetails summary-text="Help with this input" classes="govuk-details__margin-bottom">
			<table class="govuk-table">
				<thead class="govuk-table__head">
					<tr class="govuk-table__row">
						<th scope="col" class="govuk-table__header govuk-!-width-one-third">Type of convection</th>
						<th scope="col" class="govuk-table__header">Description</th>
					</tr>
				</thead>
				<tbody class="govuk-table__body">
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Air heating</th>
						<td class="govuk-table__cell">These heaters warm the air, which then circulates to heat the room. For example, convectors and fan coils.</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Free heating surface</th>
						<td class="govuk-table__cell">These heaters produce radiant heat which heats objects and people directly rather than the air. For example, radiators and radiant panels.</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Floor heating</th>
						<td class="govuk-table__cell">These are dry heating systems attached to or in the floor. For example, low temperature radiant tube heaters and luminous heaters.</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Wall heating</th>
						<td class="govuk-table__cell">These are heating systems which are wall-mounted. For example, radiant panels.</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Ceiling heating</th>
						<td class="govuk-table__cell">These are heating systems which are mounted on the ceiling. For example, radiant ceiling electric heating.</td>
					</tr>
				</tbody>
			</table>
		</GovDetails>
	</FormKit>
	<FormKit
		id="numOfHeaters"
		name="numOfHeaters"
		type="govInputInt"
		label="Number of instant electric heaters"
		help="Enter the number of heaters with this specification in the dwelling"
		:validation="zodTypeAsFormKitValidation(numOfInstantElectricHeatersZod)" />
</template>