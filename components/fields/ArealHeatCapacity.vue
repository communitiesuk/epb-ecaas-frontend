<script setup lang="ts">
import type { SchemaArealHeatCapacity } from "~/schema/aliases";
import type { RadioOption } from "../form-kit/Radios.vue";

defineProps<{
	id?: string,
	name?: string;
	label?: string;
	help?: string;
}>();

const arealHeatCapacityOptions = {
	"Very light": {
		label: "Very light",
		hint: "For example, light board or plastic",
	},
	"Light": {
		label: "Light",
		hint: "For example, 50-100 mm lightweight brick or concrete",
	},
	"Medium": {
		label: "Medium",
		hint: "For example, 100-200 mm lightweight brick or concrete",
	},
	"Heavy": {
		label: "Heavy",
		hint: "For example, 70-120 mm solid brick or heavyweight concrete",
	},
	"Very heavy": {
		label: "Very heavy",
		hint: "For example, more than 120 mm solid brick or heavyweight concrete",
	},
} as const satisfies Record<SchemaArealHeatCapacity, RadioOption & { label: SchemaArealHeatCapacity }>;

</script>

<template>
	<FormKit
		:id="id ?? 'arealHeatCapacity'"
		type="govRadios"
		:label="label ?? 'Areal heat capacity'"
		:name="name ?? 'arealHeatCapacity'"
		:help="help ?? 'This is the sum of the heat capacities of all the construction layers, also known as effective areal heat capacity or kappa value'"
		validation="required"
		:options="arealHeatCapacityOptions"
		data-field="Zone.BuildingElement.*.areal_heat_capacity"
	>
		<GovDetails summary-text="Help with this input">
			<p class="govuk-body">The areal heat capacity of a building element is not the same as the kappa value. Kappa values only consider the thermal mass directly exposed to the internal space, whereas the areal heat capacity  takes into account the full thickness of the building element.</p>
			<table class="govuk-table">
				<thead class="govuk-table__head">
					<tr class="govuk-table__row">
						<th scope="col" class="govuk-table__header">Areal heat capacity classification</th>
						<th scope="col" class="govuk-table__header">Type of construction layer</th>
						<th scope="col" class="govuk-table__header">Description</th>
						<th scope="col" class="govuk-table__header">Typical heat capacity</th>
					</tr>
				</thead>
				<tbody class="govuk-table__body">
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Very light</th>
						<td class="govuk-table__cell">Light board or plastic</td>
						<td class="govuk-table__cell">Thin plastic composite panels; Thin plywood or hardboard; Fabric or thin membranes; Single glazing; Lightweight suspended ceilings.</td>
						<td class="govuk-table__cell">50,000 J/(m²·K)</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Light</th>
						<td class="govuk-table__cell">50-100 mm lightweight brick or concrete</td>
						<td class="govuk-table__cell">Aerated concrete blocks (50-100 mm thick); Lightweight timber frame wall with thin sheathing; Thicker layer of less dense insulation board (for example 80 mm EPS).</td>
						<td class="govuk-table__cell">75,000 J/(m²·K)</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Medium</th>
						<td class="govuk-table__cell">100-200 mm lightweight brick or concrete</td>
						<td class="govuk-table__cell">150 mm lightweight concrete block wall; 120 mm timber frame wall with some internal dense layers; 100 mm of standard concrete screed.</td>
						<td class="govuk-table__cell">110,000 J/(m²·K)</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Heavy</th>
						<td class="govuk-table__cell">70-120 mm solid brick or heavyweight concrete</td>
						<td class="govuk-table__cell">100 mm solid brick wall; 80 mm heavyweight concrete slab; Stone flooring (for example 20 mm) on a thicker concrete subfloor (for example 100 mm).</td>
						<td class="govuk-table__cell">175,000 J/(m²·K)</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Very heavy</th>
						<td class="govuk-table__cell">More than 120 mm solid brick or heavyweight concrete</td>
						<td class="govuk-table__cell">200 mm solid brick wall; 150 mm or thicker heavyweight concrete slab; Thick stone or masonry walls (for example 150 mm of limestone).</td>
						<td class="govuk-table__cell">250,000 J/(m²·K)</td>
					</tr>
				</tbody>
			</table>
		</GovDetails>
	</FormKit>
</template>