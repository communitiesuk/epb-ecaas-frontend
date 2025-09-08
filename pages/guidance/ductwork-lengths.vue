<script setup lang="ts">
const title = "Ductwork lengths";
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<p class="govuk-body">Duct lengths should be entered when a MVHR (Mechanical Ventilation with Heat Recovery) unit is present.</p>
	<p class="govuk-body">If the MVHR unit sits outside the thermal envelope, supply and extract duct lengths should be entered measuring the distance between the unit and the exterior of the thermal envelope of the dwelling.</p>
	<p class="govuk-body">If the MVHR unit sits within the thermal envelope the intake and exhaust duct lengths should be entered measuring the distance between the unit and the interior of the thermal envelope of the dwelling. In both cases the full length of the ducts given are assumed to be insulated as specified.</p>
	<img src="/img/duct-length.png" alt="Ductwork lengths">
	<GovLLMWarning classes="govuk-!-margin-top-8" />
</template>