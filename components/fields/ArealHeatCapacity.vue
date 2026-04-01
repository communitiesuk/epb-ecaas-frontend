<script setup lang="ts">
import type { SchemaArealHeatCapacity } from "~/schema/aliases";
import type { RadioOption } from "../form-kit/Radios.vue";

defineProps<{
	id: string,
	name: string;
	label?: string;
	help?: string;
}>();

const arealHeatCapacityOptions = {
	"Very light": {
		label: "Very light",
		hint: "e.g. Light board of plastic",
	},
	"Light": {
		label: "Light",
		hint: "e.g. 5-10 cm lightweight brick or concrete",
	},
	"Medium": {
		label: "Medium",
		hint: "e.g. 10-20 cm lightweight brick or concrete",
	},
	"Heavy": {
		label: "Heavy",
		hint: "e.g. 7-12 cm solid brick or heavyweight concrete",
	},
	"Very heavy": {
		label: "Very heavy",
		hint: "e.g. More than 12 cm solid brick or heavyweight concrete",
	},
} as const satisfies Record<SchemaArealHeatCapacity, RadioOption & { label: SchemaArealHeatCapacity }>;

</script>

<template>
	<FormKit
		:id="id"
		type="govRadios"
		:label="label ?? 'Areal heat capacity'"
		:name="name"
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
						<td class="govuk-table__cell">5-10 cm lightweight brick or concrete</td>
						<td class="govuk-table__cell">Aerated concrete blocks (5-10 cm thick); Lightweight timber frame wall with thin sheathing; Thicker layer of less dense insulation board (e.g. 8cm EPS).</td>
						<td class="govuk-table__cell">75,000 J/(m²·K)</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Medium</th>
						<td class="govuk-table__cell">10-20 cm lightweight brick or concrete</td>
						<td class="govuk-table__cell">15 cm lightweight concrete block wall; 12 cm timber frame wall with some internal dense layers; 10 cm of standard concrete screed.</td>
						<td class="govuk-table__cell">110,000 J/(m²·K)</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Heavy</th>
						<td class="govuk-table__cell">7-12 cm solid brick or heavyweight concrete</td>
						<td class="govuk-table__cell">10 cm solid brick wall; 8 cm heavyweight concrete slab; Stone flooring (for example 2cm) on a thicker concrete subfloor (for example 10 cm).</td>
						<td class="govuk-table__cell">175,000 J/(m²·K)</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Very heavy</th>
						<td class="govuk-table__cell">More than 12 cm solid brick or heavyweight concrete</td>
						<td class="govuk-table__cell">20 cm solid brick wall; 15 cm or thicker heavyweight concrete slab; Thick stone or masonry walls (for example 15 cm of limestone).</td>
						<td class="govuk-table__cell">250,000 J/(m²·K)</td>
					</tr>
				</tbody>
			</table>
		</GovDetails>
	</FormKit>
</template>