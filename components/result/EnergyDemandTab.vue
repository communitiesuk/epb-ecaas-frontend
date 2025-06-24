<script lang="ts" setup>
import type { SchemaFhsEnergyDemand } from '~/schema/api-schema.types';

const { selected, data } = defineProps<{ selected: boolean, data: SchemaFhsEnergyDemand }>();
</script>

<template>
	<TabPanel id="energy_demand_tab" data-testid="energy_demand_tab" :selected>
		<table class="govuk-table">
			<thead class="govuk-table__head">
				<tr class="govuk-table__row">
					<th/><th scope="col" class="govuk-table__header">Actual dwelling</th>
					<th scope="col" class="govuk-table__header">Notional dwelling</th>
				</tr>
			</thead>
			<tbody class="govuk-table__body">
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">
						Space heating<br>
						<span class="govuk-!-font-weight-regular">kWh/m2</span>
					</th>
					<td class="govuk-table__cell">
						{{ data?.space_heating?.actual?.toFixed(3) }}
					</td>
					<td class="govuk-table__cell">
						{{ data?.space_heating?.notional?.toFixed(3) }}
					</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">
						Space cooling<br>
						<span class="govuk-!-font-weight-regular">kWh/m2</span>
					</th>
					<td class="govuk-table__cell">
						{{ data?.space_cooling?.actual?.toFixed(3) }}<br>
					</td>
					<td class="govuk-table__cell">
						{{ data?.space_cooling?.notional?.toFixed(3) }}<br>
					</td>
				</tr>
			</tbody>
		</table>
	</TabPanel>
</template>

