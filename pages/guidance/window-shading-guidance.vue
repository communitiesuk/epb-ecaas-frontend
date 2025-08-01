<script setup lang="ts">
const title = 'Window Shading: Modelling Overhangs and Side Fins';
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<p class="govuk-body">To accurately model the shading effect of dwelling features (including the building itself) on windows and glazed doors, add all overhangs and side fins (including window reveals).</p>
	<h2 class="govuk-heading-s">For each shading object, specify:</h2>
	<ol class="govuk-list govuk-list--number">
		<li>Shading Type: Overhang, left side fin, or right side fin.</li>
		<li>Depth: Distance from the glass surface to the furthest edge of the shading object.</li>
		<li>Distance: Distance from the glass edge (side or top) to the nearest edge of the shading object, including the window frame width (not the outer edge of the wall opening).</li>
	</ol>
	<h2 class="govuk-heading-s">Window Reveals:</h2>
	<p class="govuk-body">Treat window reveals as overhangs or side fins. If a shading device extends beyond the reveal, enter only the shading device.</p>
	<p class="govuk-body">Note: Overhang width and side fin height are assumed to be infinite.</p>
	<p class="govuk-body">Perspective: Left and right side fins are defined from the perspective of looking out the window.</p>
	<img src="/img/overhangs-and-side-fins.png" alt="Overhangs and side fins">
	<GovLLMWarning classes="govuk-!-margin-top-8" />
</template>
