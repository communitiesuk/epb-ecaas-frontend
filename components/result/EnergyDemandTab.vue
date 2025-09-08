<script lang="ts" setup>
import type { SchemaFhsEnergyDemand } from "~/schema/api-schema.types";

const { selected, data } = defineProps<{ selected: boolean, data: SchemaFhsEnergyDemand }>();
</script>

<template>
	<TabPanel id="energy_demand_tab" data-testid="energy_demand_tab" :selected>
		<table class="govuk-table">
			<thead class="govuk-table__head">
				<tr class="govuk-table__row">
					<th class="govuk-table__header govuk-!-width-one-third">Energy demand</th>
					<th scope="col" class="govuk-table__header">Actual dwelling</th>
					<th scope="col" class="govuk-table__header">Notional dwelling</th>
				</tr>
			</thead>
			<tbody class="govuk-table__body">
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">
						Space heating<br>
						<span class="govuk-!-font-weight-regular">kWh/m² per year</span>
					</th>
					<td class="govuk-table__cell">
						{{ data?.space_heating?.actual?.toFixed(2) }}
					</td>
					<td class="govuk-table__cell">
						{{ data?.space_heating?.notional?.toFixed(2) }}
					</td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">
						Space cooling<br>
						<span class="govuk-!-font-weight-regular">kWh/m² per year</span>
					</th>
					<td class="govuk-table__cell">
						{{ data?.space_cooling?.actual?.toFixed(2) }}<br>
					</td>
					<td class="govuk-table__cell">
						{{ data?.space_cooling?.notional?.toFixed(2) }}<br>
					</td>
				</tr>
			</tbody>
		</table>
	</TabPanel>
</template>

