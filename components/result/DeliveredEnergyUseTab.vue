<script lang="ts" setup>
import type { SchemaFhsEnergyPerformanceValue } from '~/schema/api-schema.types';
import { displayDeliveryEnergyUseKey } from '#imports';

// overrides because never types are currently generated from the OpenAPI erroneously
export interface CorrectedFhsDeliveredEnergyUse {
	total: SchemaFhsEnergyPerformanceValue,
	by_system: Record<string, SchemaFhsEnergyPerformanceValue>
}

const { selected, data } = defineProps<{ selected: boolean, data: CorrectedFhsDeliveredEnergyUse }>();
const { total: _total, ...systems } = data.by_system || {}; // by_system can include total inside it, so remove if present
</script>

<template>
	<TabPanel id="delivered_energy_use_tab" data-testid="delivered_energy_use_tab" :selected>
		<table class="govuk-table">
			<thead class="govuk-table__head">
				<tr class="govuk-table__row">
					<th class="govuk-table__header govuk-!-width-one-third">Appliance or system</th>
					<th scope="col" class="govuk-table__header">Actual dwelling</th>
					<th scope="col" class="govuk-table__header">Notional dwelling</th>
				</tr>
			</thead>
			<tbody class="govuk-table__body">
				<template v-for="({actual, notional}, system) in systems" :key="`${system}-result`">
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">
							{{ displayDeliveryEnergyUseKey(system as string) }}<br>
							<span class="govuk-!-font-weight-regular">kWh/m² per year</span>
						</th>
						<td class="govuk-table__cell">
							{{ actual?.toFixed(2) }}
						</td>
						<td class="govuk-table__cell">
							{{ notional?.toFixed(2) }}
						</td>
					</tr>
				</template>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">
						Total<br>
						<span class="govuk-!-font-weight-regular">kWh/m² per year</span>
					</th>
					<td class="govuk-table__cell">
						{{ data?.total?.actual?.toFixed(2) }}<br>
					</td>
					<td class="govuk-table__cell">
						{{ data?.total?.notional?.toFixed(2) }}<br>
					</td>
				</tr>
			</tbody>
		</table>
	</TabPanel>
</template>
