<script setup lang="ts">
defineProps<{
	id?: string;
	name?: string;
	label?: string;
	help?: string;
}>();

const typicalBulbPowers = [
	{ lampType: "Linear fluorescent", power: "8.3 W" },
	{ lampType: "LED", power: "10 W" },
	{ lampType: "Halogen LV", power: "25.7 W" },
	{ lampType: "Halogen", power: "42.8 W" },
	{ lampType: "Incandescent", power: "60 W" },
	{ lampType: "CFL", power: "10 W" },
];
</script>

<template>
	<FormKit
		:id="id ?? 'power'"
		type="govInputWithSuffix"
		:label="label ?? 'Power'"
		:name="name ?? 'power'"
		:help="help ?? 'Enter the power of the bulb'"
		suffix-text="W"
		validation="required | number"
		data-field="Zone.Lighting.bulbs.power">
		<GovDetails summary-text="Help with this input">
			<table class="govuk-table">
				<thead class="govuk-table__head">
					<tr class="govuk-table__row">
						<th scope="col" class="govuk-table__header">Lamp type</th>
						<th scope="col" class="govuk-table__header">Typical power</th>
					</tr>
				</thead>
				<tbody class="govuk-table__body">
					<tr
						v-for="{ lampType, power } in typicalBulbPowers"
						:key="lampType"
						class="govuk-table__row"
					>
						<th scope="row" class="govuk-table__header">{{ lampType }}</th>
						<td class="govuk-table__cell">{{ power }}</td>
					</tr>
				</tbody>
			</table>
		</GovDetails>
	</FormKit>
</template>