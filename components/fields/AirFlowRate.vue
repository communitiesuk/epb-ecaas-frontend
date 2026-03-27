<script setup lang="ts">
import { litrePerSecond } from "~/utils/units/flowRate";

</script>

<template>
	<FormKit
		id="airFlowRate"
		name="airFlowRate"
		label="Design air flow rate"
		help="Enter the required design air flow rate that will be supplied to or extracted from the ventilation zone by the system. Typically between 10 and 50 l/s."
		type="govInputWithUnit"
		:unit="litrePerSecond"
		validation="required"
		data-field="InfiltrationVentilation.MechanicalVentilation.design_outdoor_air_flow_rate"
	>
		<GovDetails summary-text="Help with this input">
			<table class="govuk-table">
				<thead class="govuk-table__head">
					<tr>
						<th scope="col" class="govuk-table__header">Ventilation type</th>
						<th scope="col" class="govuk-table__header">Typical airflow rates</th>
						<th scope="col" class="govuk-table__header">Description</th>
					</tr>
				</thead>
				<tbody class="govuk-table__body">
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">MVHR (Mechanical Ventilation with Heat Recovery)</th>
						<td class="govuk-table__cell">42 - 83 l/s</td>
						<td class="govuk-table__cell">Whole-house system. Supplies fresh air and extracts stale air while recovering heat. Exact rate depends on dwelling size.</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Intermittent MEV (Mechanical Extract Ventilation)</th>
						<td class="govuk-table__cell">8 - 17 l/s per fan (typically kitchen/bathroom)</td>
						<td class="govuk-table__cell">Small fans that operate only when needed, for example a humidistat or user control. Each wet room usually has its own fan.</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Centralised Continuous MEV</th>
						<td class="govuk-table__cell">17 - 42 l/s</td>
						<td class="govuk-table__cell">A single unit continuously extracts from multiple rooms via ductwork. Airflow depends on dwelling size and number of wet rooms.</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header govuk-!-font-weight-regular">Decentralised Continuous MEV (dMEV)</th>
						<td class="govuk-table__cell">3 - 11 l/s per fan</td>
						<td class="govuk-table__cell">Individual small fans in each wet room, running continuously at a low rate, with a boost function when needed.</td>
					</tr>
				</tbody>
			</table>
		</GovDetails>
	</FormKit>
</template>