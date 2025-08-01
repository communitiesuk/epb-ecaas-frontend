<script setup lang="ts">
const title = 'Measuring zone parameters';
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<p class="govuk-body">There are two zones (living and rest of dwelling). The zones are measured independently.</p>
	<p class="govuk-body">External building elements such as walls, roof, floor, window are each individually defined and assigned to a zone. Window and door areas are not included in the wall areas (i.e. the user enters the net wall area, with aperture area subtracted).</p>
	<p class="govuk-body">Thermal bridges are also assigned to the zone they occur in, with their length and linear thermal transmittance.</p>
	<p class="govuk-body">The internal building elements are only included to account for thermal mass, and can therefore be grouped together if they have the same areal heat capacity, so internal floors, internal walls and internal ceilings only need to be defined once. For internal walls with two sides in the zone, both sides are counted as wall area. Where an internal wall is between two zones, only the area facing the zone is included.</p>
	<p class="govuk-body">In the context of the housing energy model (HEM):</p>
	<p class="govuk-body">A "house" refers to a standalone residential building surrounded by open space or terraced or semi-terraced, ground floor walls are measured floor-to-ceiling, mid-floor walls are measured ceiling to ceiling.</p>
	<p class="govuk-body">While a "flat" denotes a self-contained unit within a multi-unit structure, sharing common walls and areas. In a single-storey flat, wall height is measured floor to ceiling. In a two-storey flat, wall height is measured lowest floor to ceiling, upper-floor walls are measured ceiling to ceiling.</p>
	<p class="govuk-body">The model distinguishes between these two types based on architectural and structural differences, considering factors like insulation and heating to accurately assess their distinct energy efficiency.</p>
	<img src="/img/zone-parameter-measurement-house.png" alt="Example measurement conventions for a two storey house">
	<img src="/img/zone-parameter-measurement-flat.png" alt="Example measurement conventions for a flat">
	<GovLLMWarning classes="govuk-!-margin-top-8" />
</template>