<script setup lang="ts">
const title = 'Calculating distant shading';
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<p class="govuk-body">To assess the shading impact on a dwelling, you will need to input key details about surrounding obstacles that may block sunlight. You do not need to include party walls.</p>
	<h2 class="govuk-heading-s">Required Inputs:</h2>
	<ol class="govuk-list govuk-list--number">
		<li>Shading Direction: Define the start and end angles (in degrees) where the shading occurs, measured from north (0°).</li>
		<li>Obstacle Height: Enter the height (in metres) of the object causing the shading.</li>
		<li>Obstacle Distance: Provide the distance (in metres) from the dwelling to the shading object.</li>
	</ol>
	<p class="govuk-body">These inputs will help determine how much sunlight is blocked at different times of the day and year, which is crucial for energy efficiency and solar access planning.</p>
	<img src="/img/shaded-segments.png" alt="Shaded segments" class="govuk-!-margin-bottom-3">
	<p class="govuk-body">When identifying a shading segment, details of the most significant shading object in that direction should be recorded. This includes:</p>
	<ul class="govuk-list govuk-list--bullet">
		<li>The height of the object from the ground.</li>
		<li>The distance from the centre of the closest external wall of the dwelling to the centre of the nearest face of the shading object.</li>
	</ul>
	<p class="govuk-body">If the shading object has a varying vertical cross-section, its height will be measured at the midpoint of the object.</p>
	<p class="govuk-body">The key difference between obstacles and overhangs is:</p>
	<ul class="govuk-list govuk-list--bullet">
		<li>An obstacle (e.g., a tree or building) ends at a certain height above ground level.</li>
		<li>An overhang (e.g., a roof or balcony) starts at a certain height above ground level.</li>
	</ul>
	<img src="/img/overhang-and-obstacle.png" alt="Overhang and obstacle">
</template>