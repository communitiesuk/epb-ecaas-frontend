<script lang="ts" setup>
import type { SchemaFhsComplianceResponse } from "~/schema/api-schema.types";

defineProps<{ selected: boolean, data: Omit<SchemaFhsComplianceResponse, "energy_demand" | "delivered_energy_use" | "energy_use_by_fuel"> }>();
</script>

<template>
	<TabPanel id="primary_tab" data-testid="primary_tab" :selected>
		<table class="govuk-table">
			<thead class="govuk-table__head">
				<tr class="govuk-table__row">
					<th class="govuk-table__header">Ouput</th>
					<th scope="col" class="govuk-table__header">Actual dwelling</th>
					<th scope="col" class="govuk-table__header">Notional dwelling</th>
					<th class="govuk-table__header" />
					<th class="govuk-table__header" />
				</tr>
			</thead>
			<tbody class="govuk-table__body">
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">
						Emission rate<br>
						<span class="govuk-!-font-weight-regular">kgCO₂/m² per year</span>
					</th>
					<td class="govuk-table__cell">
						{{ data.dwelling_emission_rate?.toFixed(2) }}<br>
						<span class="govuk-!-font-weight-bold">(DER)</span>
					</td>
					<td class="govuk-table__cell">
						{{ data.target_emission_rate?.toFixed(2) }}<br>
						<span class="govuk-!-font-weight-bold">(TER)</span>
					</td>
					<td class="govuk-table__cell"><ResultComplianceBadge :is-compliant="data.emission_rate_compliant!"/></td>
					<td class="govuk-table__cell"><ResultComplianceDelta :actual="data.dwelling_emission_rate!" :target="data.target_emission_rate!" /></td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">
						Primary energy rate<br>
						<span class="govuk-!-font-weight-regular">kWh/m² per year</span>
					</th>
					<td class="govuk-table__cell">
						{{ data.dwelling_primary_energy_rate?.toFixed(2) }}<br>
						<span class="govuk-!-font-weight-bold">(DPER)</span>
					</td>
					<td class="govuk-table__cell">
						{{ data.target_primary_energy_rate?.toFixed(2) }}<br>
						<span class="govuk-!-font-weight-bold">(TPER)</span>
					</td>
					<td class="govuk-table__cell"><ResultComplianceBadge :is-compliant="data.primary_energy_rate_compliant!"/></td>
					<td class="govuk-table__cell"><ResultComplianceDelta :actual="data.dwelling_primary_energy_rate!" :target="data.target_primary_energy_rate!" /></td>
				</tr>
				<tr class="govuk-table__row">
					<th scope="row" class="govuk-table__header">
						Fabric energy efficiency<br>
						<span class="govuk-!-font-weight-regular">kWh/m² per year</span>
					</th>
					<td class="govuk-table__cell">
						{{ data.dwelling_fabric_energy_efficiency?.toFixed(2) }}<br>
						<span class="govuk-!-font-weight-bold">(DFEE)</span>
					</td>
					<td class="govuk-table__cell">
						{{ data.target_fabric_energy_efficiency?.toFixed(2) }}<br>
						<span class="govuk-!-font-weight-bold">(TFEE)</span>
					</td>
					<td class="govuk-table__cell"><ResultComplianceBadge :is-compliant="data.fabric_energy_efficiency_compliant!"/></td>
					<td class="govuk-table__cell"><ResultComplianceDelta :actual="data.dwelling_fabric_energy_efficiency!" :target="data.target_fabric_energy_efficiency!" /></td>
				</tr>
			</tbody>
		</table>
	</TabPanel>
</template>

