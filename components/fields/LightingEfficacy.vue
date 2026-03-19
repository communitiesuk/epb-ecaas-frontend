<script setup lang="ts">
import { isInteger } from "~/utils/validation";

defineProps<{
	id?: string;
	name?: string;
	label?: string;
	help?: string;
}>();

const typicalBulbEfficacies = [
	{ energyEfficiencyGrade: "A", efficacy: "210 lm/W" },
	{ energyEfficiencyGrade: "B", efficacy: "185 lm/W" },
	{ energyEfficiencyGrade: "C", efficacy: "160 lm/W" },
	{ energyEfficiencyGrade: "D", efficacy: "135 lm/W" },
	{ energyEfficiencyGrade: "E", efficacy: "110 lm/W" },
	{ energyEfficiencyGrade: "F", efficacy: "85 lm/W" },
	{ energyEfficiencyGrade: "G", efficacy: "0 lm/W" },
];
</script>

<template>
	<FormKit
		:id="id ?? 'efficacy'"
		type="govInputWithSuffix"
		:label="label ?? 'Efficacy'"
		:name="name ?? 'efficacy'"
		:help="help ?? 'Enter the efficacy of the bulb'"
		suffix-text="lm/W"
		:validation-rules="{ isInteger }"
		validation="required | isInteger"
		:validation-messages="{
			isInteger: 'Efficacy must be an integer.',
		}"
		data-field="Zone.Lighting.bulbs.efficacy">
		<GovDetails summary-text="Help with this input">
			<table class="govuk-table">
				<thead class="govuk-table__head">
					<tr class="govuk-table__row">
						<th scope="col" class="govuk-table__header">Energy efficiency grade</th>
						<th scope="col" class="govuk-table__header">Typical efficacy</th>
					</tr>
				</thead>
				<tbody class="govuk-table__body">
					<tr
						v-for="{ energyEfficiencyGrade, efficacy } in typicalBulbEfficacies"
						:key="energyEfficiencyGrade"
						class="govuk-table__row"
					>
						<th scope="row" class="govuk-table__header">{{ energyEfficiencyGrade }}</th>
						<td class="govuk-table__cell">{{ efficacy }}</td>
					</tr>
				</tbody>
			</table>
		</GovDetails>
	</FormKit>
</template>