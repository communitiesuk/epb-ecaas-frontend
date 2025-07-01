<script lang="ts" setup>
import type { SchemaFhsEnergyPerformanceValue } from '~/schema/api-schema.types';
import { sentenceCase } from '#imports';

const { selected, data } = defineProps<{ selected: boolean, data: Record<string, SchemaFhsEnergyPerformanceValue> }>();
const { total: _total, ...systems } = data; // list can include total inside it, so remove if present
</script>

<template>
	<TabPanel id="energy_use_by_fuel_tab" data-testid="energy_use_by_fuel_tab" :selected>
		<table class="govuk-table">
			<thead class="govuk-table__head">
				<tr class="govuk-table__row">
					<th class="govuk-table__header govuk-!-width-one-third">Energy source</th><th scope="col" class="govuk-table__header">Actual dwelling</th>
					<th scope="col" class="govuk-table__header">Notional dwelling</th>
				</tr>
			</thead>
			<tbody class="govuk-table__body">
				<tr v-for="({actual = undefined, notional = undefined}, system) in systems" :key="`${system}-result`" class="govuk-table__row">
					<th scope="row" class="govuk-table__header">
						{{ sentenceCase(system as string) }}<br>
						<span class="govuk-!-font-weight-regular">kWh/m²</span>
					</th>
					<td class="govuk-table__cell">
						{{ actual?.toFixed(2) }}
					</td>
					<td class="govuk-table__cell">
						{{ notional?.toFixed(2) }}
					</td>
				</tr>
			</tbody>
		</table>
	</TabPanel>
</template>



