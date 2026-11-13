<template>
	<GovDetails summary-text="Help with this input">
		<table
			class="govuk-table"
			data-testid="constructionBuildUpTable"
		>
			<thead class="govuk-table__head">
				<tr class="govuk-table__row">
					<th scope="col" class="govuk-table__header govuk-!-width-one-third" >Areal heat capacity classification</th>
					<th scope="col" class="govuk-table__header govuk-!-width-one-half">
						Areal heat capacity of the construction build up
					</th>
				</tr>
			</thead>
			<tbody class="govuk-table__body">
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Very light</th>
					<td class="govuk-table__cell">240 kJ/(m²·K)</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Light</th>
					<td class="govuk-table__cell">450 kJ/(m²·K)</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Medium</th>
					<td class="govuk-table__cell">650 kJ/(m²·K)</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Heavy</th>
					<td class="govuk-table__cell">850 kJ/(m²·K)</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Very heavy</th>
					<td class="govuk-table__cell">1350 kJ/(m²·K)</td>
				</tr>
			</tbody>
		</table>
	</GovDetails>
</template>