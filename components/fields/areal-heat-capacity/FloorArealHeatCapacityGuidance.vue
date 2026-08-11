<template>
	<GovDetails summary-text="Help with this input">
		<p class="govuk-body">The areal heat capacity of a building element is not the same as the kappa value. Kappa values only consider the thermal mass directly exposed to the internal space, whereas the areal heat capacity  takes into account the full thickness of the building element.</p>				
		<table class="govuk-table" data-testid="floorArealHeatCapacityTable">
			<thead class="govuk-table__head">
				<tr class="govuk-table__row">
					<th scope="col" class="govuk-table__header govuk-!-width-one-third">Areal heat capacity classification</th>
					<th scope="col" class="govuk-table__header govuk-!-width-one-third">
						Areal heat capacity
					</th>
					<th scope="col" class="govuk-table__header govuk-!-width-one-third">Type of construction layer</th>
				</tr>
			</thead>
			<tbody class="govuk-table__body">
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Very light</th>
					<td class="govuk-table__cell">240 kJ/(m²·K)</td>
					<td class="govuk-table__cell">
						All timber floors (suspended and exposed)<br>
						Unreinforced slab with no insulation, 1-4% moisture content</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Light</th>
					<td class="govuk-table__cell">450 kJ/(m²·K)</td>
					<td class="govuk-table__cell">Insulated slab, with 50 mm insulation</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Medium</th>
					<td class="govuk-table__cell">650 kJ/(m²·K)</td>
					<td class="govuk-table__cell">Not typical for floors</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Heavy</th>
					<td class="govuk-table__cell">850 kJ/(m²·K)</td>
					<td class="govuk-table__cell">Not typical for floors</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Very heavy</th>
					<td class="govuk-table__cell">1350 kJ/(m²·K)</td>
					<td class="govuk-table__cell">Not typical for floors</td>
				</tr>
			</tbody>
		</table>
	</GovDetails>
</template>