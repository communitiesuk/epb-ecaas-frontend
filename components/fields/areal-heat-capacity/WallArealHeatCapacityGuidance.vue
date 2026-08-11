<template>
	<GovDetails summary-text="Help with this input">
		<p class="govuk-body govuk-!-margin-bottom-4">
			Use the table below to determine the areal heat capacity of the element.
		</p>

		<p class="govuk-body">
			Where an element contains multiple significant layers, the areal heat capacities should be added together. For example, a wall with thin solid brick (&lt;300 mm) would be 240 (very light) and concrete cavity (250–350 mm) would be 450 (light). When these are added together, it is 690 overall (240 + 450 = 690), so it would be classified as Medium.
		</p>
		<table
			class="govuk-table"
			data-testid="wallArealHeatCapacityTable"
		>
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
						Solid brick walls, less than 300 mm thick<br>
						Brick cavity walls, less than 350 mm thick<br>
						Concrete cavity walls, less than 250 mm thick<br>
						Timber frame walls, less than 350 mm thick
					</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Light</th>
					<td class="govuk-table__cell">450 kJ/(m²·K)</td>
					<td class="govuk-table__cell">
						Solid brick walls, 300 - 400 mm thick<br>
						Brick cavity walls, 350 - 450 mm thick<br>
						Concrete cavity walls, 250 - 350 mm thick<br>
						Timber frame walls, more than 350 mm thick
					</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Medium</th>
					<td class="govuk-table__cell">650 kJ/(m²·K)</td>
					<td class="govuk-table__cell">
						Solid brick walls, 400 - 500 mm thick<br>
						Brick cavity walls, more than 400 mm thick<br>
						Concrete cavity walls, 350 - 450 mm thick<br>
						Solid limestone or cob walls, less than 400 mm thick
					</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Heavy</th>
					<td class="govuk-table__cell">850 kJ/(m²·K)</td>
					<td class="govuk-table__cell">
						Concrete cavity walls, more than 450 mm thick<br>
						Solid limestone or cob walls, 400 - 500 mm thick<br>
						Solid granite or sandstone, 300 - 400 mm thick
					</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">Very heavy</th>
					<td class="govuk-table__cell">1350 kJ/(m²·K)</td>
					<td class="govuk-table__cell">
						Solid limestone or cob walls, more than 500 mm thick<br>
						Solid granite or sandstone, more than 400 mm thick
					</td>
				</tr>
			</tbody>
		</table>
	</GovDetails>
</template>