<script setup lang="ts">
const title = "Calculating distant shading";
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<p class="govuk-body">The output of the PV system is limited by any shading on the panels. These could be distant objects (for example neighbouring buildings, see the distant shading section) and/or nearby objects (for example a chimney stack or a separate part of the roof.)</p>
	<p class="govuk-body">For further details see 6.2.4.7 calculation procedure in BS EN 15316-4-3:2017.</p>
	<p class="govuk-body">In the PV array shading section you need to add nearby objects. Nearby shading objects are categorised into four types:</p>
	
	<table class="govuk-table">
		<thead class="govuk-table__head">
			<tr class="govuk-table__row">
				<th scope="col" class="govuk-table__header">
					Type of shading
				</th>
				<th scope="col" class="govuk-table__header">Description</th>
			</tr>
		</thead>
		<tbody class="govuk-table__body">
			<tr class="govuk-table__row">
				<th scope="row" class="govuk-table__header">Overhangs (1)</th>
				<td class="govuk-table__cell">
					Horizontal shading elements located above the PV array, defined by their depth and distance from the array surface.</td>
			</tr>
			<tr class="govuk-table__row">
				<th scope="row" class="govuk-table__header">Side fins (2)</th>
				<td class="govuk-table__cell">
					Vertical shading elements located on either side of the PV array, defined by their depth and distance from the array surface.</td>
			</tr>
			<tr class="govuk-table__row">
				<th scope="row" class="govuk-table__header">Reveals (setbacks) (3)</th>
				<td class="govuk-table__cell">
					Horizontal and vertical shading elements surrounding the PV array, defined by their depth and distance from the array surface. Treated as a combination of equivalent overhangs and side fins due to incomplete variable definitions in the methods described in the BS EN ISO 52016-1:2017 and PD CEN ISO/TR 52016-2:2017. These are unusual with PV arrays.</td>
			</tr>
			<tr class="govuk-table__row">
				<th scope="row" class="govuk-table__header">Obstacles (4)</th>
				<td class="govuk-table__cell">
					Ground-attached objects, such as balustrades, defined by their height, distance from the PV array, and transparency.</td>
			</tr>
		</tbody>
	</table>
	<p class="govuk-body">See the image below for an illustration of these 4 different types of shading.</p> 
	<img src="/img/four-types-of-shading.png" alt="Diagram showing four types of shading" class="govuk-!-margin-bottom-3">
	<h2 class="govuk-heading-m">Measuring side fins and overhangs</h2>
	<p class="govuk-body">The diagram below shows how to measure the inputs required for side fins and overhangs.</p>
	<img src="/img/measure-side-fins-and-overhangs.png" alt="Measure side fins and overhangs" class="govuk-!-margin-bottom-3">
	<h2 class="govuk-heading-m">Measuring obstacles</h2>
	<p class="govuk-body">The diagram below shows how to measure the inputs required for side fins and overhangs.</p>
	<img src="/img/measure-obstacles.png" alt="Measure inputs required for obstacles" class="govuk-!-margin-bottom-3">

</template>

<style lang="scss">
.govuk-table th:first-child,
.govuk-table td:first-child {
  width: 40%;
}
table {
	margin-top: 40px;
}
</style>