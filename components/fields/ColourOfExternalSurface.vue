<script setup lang="ts">
defineProps<{
	id?: string;
	name?: string;
	label?: string;
}>();
const colourOptions = colourOptionsMap;
</script>

<template>
	<FormKit
		:id="id ?? 'colour'"
		type="govRadios"
		:label="label ?? 'Colour of external surface'"
		:name="name ?? 'colour'"
		:options="colourOptions"
		validation="required"
		data-field="Zone.BuildingElement.*.colour">
		<GovDetails summary-text="Help with this input">
			<table class="govuk-table">
				<thead class="govuk-table__head">
					<tr>
						<th scope="col" class="govuk-table__header">Colour</th>
						<th scope="col" class="govuk-table__header">Example materials</th>
					</tr>
				</thead>
				<tbody class="govuk-table__body">
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Light</th>
						<td class="govuk-table__cell">
							<ul class="govuk-list govuk-list--bullet">
								<li>Light buff or red brick</li>
								<li>White or light render</li>
								<li>Weathered grey timber</li>
								<li>Uncoated polished aluminium</li>
								<li>Coated white metal</li>
							</ul>
						</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Medium</th>
						<td class="govuk-table__cell">
							<ul class="govuk-list govuk-list--bullet">
								<li>Dark red, brown or blue brick</li>
								<li>Dark pigmented render</li>
								<li>Grey concrete roof tile</li>
								<li>Unglazed red clay tile</li>
								<li>Glazed or dark clay tile</li>
								<li>Aged asphalt or bitumen</li>
								<li>Fresh pine or cedar timber</li>
								<li>New, grey fibre cement</li>
								<li>Aged fibre cement</li>
								<li>Composite panels (metal skins)</li>
							</ul>
						</td>
					</tr>
					<tr class="govuk-table__row">
						<th scope="row" class="govuk-table__header">Dark</th>
						<td class="govuk-table__cell">
							<ul class="govuk-list govuk-list--bullet">
								<li>Black concrete roof tile</li>
								<li>Welsh or blue grey slate</li>
								<li>New asphalt or bitumen</li>
								<li>Uncoated, weathered metal</li>
								<li>Coated black metal</li>
							</ul>
						</td>
					</tr>
				</tbody>
			</table>
		</GovDetails>
	</FormKit>
</template>