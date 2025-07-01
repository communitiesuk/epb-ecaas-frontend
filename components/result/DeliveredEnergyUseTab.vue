<script lang="ts" setup>
import type { SchemaFhsDeliveredEnergyUse } from '~/schema/api-schema.types';
import { displayDeliveryEnergyUseKey } from '#imports';

const { selected, data } = defineProps<{ selected: boolean, data: SchemaFhsDeliveredEnergyUse }>();
const { total: _total, ...systems } = data.by_system || {}; // by_system can include total inside it, so remove if present
</script>

<template>
	<TabPanel id="delivered_energy_use_tab" data-testid="delivered_energy_use_tab" :selected>
		<table class="govuk-table">
			<thead class="govuk-table__head">
				<tr class="govuk-table__row">
					<th class="govuk-table__header govuk-!-width-one-third" /><th scope="col" class="govuk-table__header">Actual dwelling</th>
					<th scope="col" class="govuk-table__header">Notional dwelling</th>
				</tr>
			</thead>
			<tbody class="govuk-table__body">
				<template v-for="({actual, notional}, system) in systems" :key="`${system}-result`">
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">
							{{ displayDeliveryEnergyUseKey(system as string) }}<br>
							<span class="govuk-!-font-weight-regular">kWh/m²</span>
						</th>
						<td class="govuk-table__cell">
							{{ actual?.toFixed(3) }}
						</td>
						<td class="govuk-table__cell">
							{{ notional?.toFixed(3) }}
						</td>
					</tr>
				</template>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">
						Total<br>
						<span class="govuk-!-font-weight-regular">kWh/m²</span>
					</th>
					<td class="govuk-table__cell">
						{{ data?.total?.actual?.toFixed(3) }}<br>
					</td>
					<td class="govuk-table__cell">
						{{ data?.total?.notional?.toFixed(3) }}<br>
					</td>
				</tr>
			</tbody>
		</table>
	</TabPanel>
</template>
