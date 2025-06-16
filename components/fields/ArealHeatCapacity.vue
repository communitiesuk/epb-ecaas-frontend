<script setup lang="ts">
defineProps<{
	id: string,
	name: string;
	label?: string;
	help?: string;
}>();
</script>

<template>
	<FormKit
		:id="id"
		type="govRadios"
		:label="label ?? 'Areal heat capacity'"
		:name="name"
		:help="help ?? 'Effective areal heat capacity or kappa value. This is the total heat capacity of all the construction layers, that is, the sum of the heat capacities of each individual layers.'"
		validation="required"
		:options="{
			'50000': 'Very light',
			'75000': 'Light',
			'110000': 'Medium',
			'175000': 'Heavy',
			'250000': 'Very heavy'
		}"
		value-type="number"
	>
		<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
			<table class="govuk-table">
				<tbody class="govuk-table__body">
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">
							Very light<br>
							<span class="govuk-!-font-weight-regular">50,000 J/(m2.K)</span>
						</th>
						<td class="govuk-table__cell">
							<p>Light board or plastic</p>
							<p>Thin plastic or composite panels; Thin plywood or hardboard; Fabric or thin membranes; Single glazing; Lightweight suspended ceilings.</p>
						</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">
							Light<br>
							<span class="govuk-!-font-weight-regular">75,000 J/(m2.K)</span>
						</th>
						<td class="govuk-table__cell">
							<p>5-10 cm lightweight brick or concrete</p>
							<p>Aerated concrete blocks (5-10 cm thick); Lightweight timber frame wall with thin sheathing; Thicker layer of less dense insulation board (e.g. 8cm EPS).</p>
						</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">
							Medium<br>
							<span class="govuk-!-font-weight-regular">110,000 J/(m2.K)</span>
						</th>
						<td class="govuk-table__cell">
							<p>10-20 cm lightweight brick or concrete</p>
							<p>15 cm lightweight concrete block wall; 12 cm timber frame wall with some internal dense layers; 10 cm of standard concrete screed.</p>
						</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">
							Heavy<br>
							<span class="govuk-!-font-weight-regular">175,000 J/(m2.K)</span>
						</th>
						<td class="govuk-table__cell">
							<p>7-12 cm solid brick or heavyweight concrete</p>
							<p>10 cm solid brick wall; 8 cm heavyweight concrete slab; Stone flooring (e.g., 2cm) on a thicker concrete subfloor (e.g., 10 cm).</p>
						</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">
							Very heavy<br>
							<span class="govuk-!-font-weight-regular">250,000 J/(m2.K)</span>
						</th>
						<td class="govuk-table__cell">
							<p>More than 12 cm solid brick or heavyweight concrete</p>
							<p>20 cm solid brick wall; 15 cm or thicker heavyweight concrete slab; Thick stone or masonry walls (e.g. 15 cm of limestone).</p>
						</td>
					</tr>
				</tbody>
			</table>
		</GovDetails>
	</FormKit>
</template>