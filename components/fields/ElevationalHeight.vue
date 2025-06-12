<script lang="ts" setup>
const { field = 'elevationalHeight' } = defineProps<{
	field?: string
}>();
</script>

<template>
	<FormKit
		:id="field" type="govInputWithSuffix" suffix-text="m"
		label="Elevational height of building element at its base"
		help="The distance between the ground and the lowest edge of the element"
		:name="field"
		validation="required | number | min:0 | max:500"
	>
		<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
			<table class="govuk-table">
				<thead class="govuk-table__head">
					<tr class="govuk-table__row">
						<th scope="col" class="govuk-table__header govuk-!-width-one-third">Concept</th>
						<th scope="col" class="govuk-table__header">Description</th>
					</tr>
				</thead>
				<tbody class="govuk-table__body">
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Elevational height of element at its base</th>
						<td class="govuk-table__cell">The vertical distance from the ground datum level to the base of a specific element (e.g., windows, doors, walls, foundations). This measurement indicates the position of the element relative to a consistent ground reference.</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Ground datum level</th>
						<td class="govuk-table__cell">A consistent reference point on the ground that serves as the baseline for measuring vertical heights around the building. It helps standardise height measurements, even when the ground level varies (e.g., on a slope).</td>
					</tr>
				</tbody>
			</table>
		</GovDetails>
	</FormKit>
</template>