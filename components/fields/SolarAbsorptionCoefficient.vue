<script setup lang="ts">
defineProps<{
	id: string,
	name: string;
	label?: string;
	additionalText?: string;
}>();
</script>

<template>
	<FormKit
		:id="id"
		type="govInputFloat"
		:label="label ?? 'Solar absorption coefficient'"
		help="Enter the proportion of solar radiation which is absorbed. It should be a decimal between 0 and 1."
		:name="name"
		validation="required | number | min:0.01 | max:1">
		<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
			<p v-if="additionalText" class="govuk-body">{{ additionalText }}</p>

			<table class="govuk-table">
				<thead class="govuk-table__head">
					<tr>
						<th scope="col" class="govuk-table__header">External surface type</th>
						<th scope="col" class="govuk-table__header">Typical solar absorption coefficient</th>
					</tr>
				</thead>
				<tbody class="govuk-table__body">
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">White surfaces (for example paint, smooth)</th>
						<td class="govuk-table__cell">0.25 - 0.40</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Light colours (for example light grey, pastel paints)</th>
						<td class="govuk-table__cell">0.40 - 0.60</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Medium colours (for example brick, concrete)</th>
						<td class="govuk-table__cell">0.60 - 0.80</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Dark colours (for example dark grey, blue, brown paints)</th>
						<td class="govuk-table__cell">0.70 - 0.90</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Black surfaces</th>
						<td class="govuk-table__cell">0.8 - 0.95</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Metals (polished)</th>
						<td class="govuk-table__cell">0.05 - 0.30</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Metals (oxidised or dull)</th>
						<td class="govuk-table__cell">0.40 - 0.70</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Glass</th>
						<td class="govuk-table__cell">0.10 - 0.70</td>
					</tr>
				</tbody>
			</table>
		</GovDetails>
	</FormKit>
</template>