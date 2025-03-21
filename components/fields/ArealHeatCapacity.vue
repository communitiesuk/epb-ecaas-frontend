<script setup lang="ts">
defineProps<{
	id: string,
	name: string;
}>();
</script>

<template>
	<FormKit
		:id="id"
		type="govRadios"
		label="Areal heat capacity"
		:name="name"
		help="Effective areal heat capacity or kappa value. This is the total heat capacity of all the construction layers, that is, the sum of the heat capacities of each individual layers."
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
		<GovDetails summary-text="Help with this input">
			<table class="govuk-table">
				<tbody class="govuk-table__body">
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Very light</th>
						<td class="govuk-table__cell">Light board or plastic</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Light</th>
						<td class="govuk-table__cell">5-10 cm lightweight brick or concrete</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Medium</th>
						<td class="govuk-table__cell">10-20 cm lightweight brick or concrete</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Heavy</th>
						<td class="govuk-table__cell">7-12 cm solid brick or heavyweight concrete</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Very heavy</th>
						<td class="govuk-table__cell">More than 12 cm solid brick or heavyweight concrete</td>
					</tr>
				</tbody>
			</table>
		</GovDetails>
	</FormKit>
</template>