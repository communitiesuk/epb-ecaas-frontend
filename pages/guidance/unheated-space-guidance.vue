<script setup lang="ts">
const title = 'Unheated space guidance';
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<h2 class="govuk-heading-m">Garages (integral)</h2>
	<p class="govuk-body">The U-value of elements between the dwelling and an integral garage should be adjusted using Rᵤ from Table 1 or Table 2.</p>
	<p class="govuk-body">Attached garages (not integral) should be disregarded.</p>
	<p class="govuk-body">Apply the following Rᵤ values for typical configurations of single garages (3m x 6m), double garages (6m x 6m) or similar unheated spaces. If the garage is substantially different from the typical garages assumed, then the Rᵤ value should be calculated using the procedure for the general case in the section above.</p>
	<img src="/img/unheated-space-1.png" alt="Single garages">
	<img src="/img/unheated-space-2.png" alt="Double garages">
	<h2 class="govuk-heading-m">Stairwells and access corridors</h2>
	<p class="govuk-body">Stairwells and access corridors are not regarded as parts of the dwelling. If they are heated the wall between stairwell and corridor and the dwelling is treated as a party wall. If unheated, the U-value of walls between the dwelling and the unheated space should be modified by adding an additional thermal resistance.</p>
	<img src="/img/unheated-space-3.png" alt="Common configurations of stairwells and corridors">
	<img src="/img/unheated-space-4.png" alt="Configuration assumptions">
	<h2 class="govuk-heading-m">Room in roof</h2>
	<p class="govuk-body">In the case of room-in-roof construction where the insulation follows the shape of the room, use values of Rᵤ from the table 4. The same applies to the ceiling of the room below:</p>
	<img src="/img/unheated-space-5.png" alt="Room in roof">
	<GovLLMWarning classes="govuk-!-margin-top-8" />
</template>