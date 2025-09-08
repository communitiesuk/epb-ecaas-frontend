<script setup lang="ts">
const title = "Primary and secondary pipework";
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<p class="govuk-body">The length of secondary distribution pipework is needed for modelling the hot water distribution system. (HEM does not handle secondary circulation pipework, which is secondary hot water pumped around in continuous circulation).</p>
	<p class="govuk-body">The total secondary hot water distribution pipework length should be calculated as the sum of all lengths of pipework from the hot water source to a tapping point (i.e. tap, bath or shower), hence if a pipe is shared for multiple tapping points the length of shared pipe should be duplicated and added for each tapping point.</p>
	<p class="govuk-body">If there is hot water distribution pipework outside the thermal envelope it should be entered in the separate pane marked 'external'.</p>
	<p class="govuk-body">NOTE: Secondary distribution pipework is always needed if there are any hot water outlets in the property (hot water taps, showers).</p>
	<p class="govuk-body">If required, the length of primary pipework should be measured from the heat source to the hot water cylinder. Both the primary flow and return lengths should be included.</p>
	<p class="govuk-body">NOTE: Primary pipework is required whenever there is a hot water cylinder or a thermal storage tank in the heating system, and it has pipework connected to a separate heat source.</p>
	<p class="govuk-body"/>
	<img alt="Primary and secondary pipework" src="/img/primary-and-secondary-pipework.png">
	<GovLLMWarning classes="govuk-!-margin-top-8" />
</template>