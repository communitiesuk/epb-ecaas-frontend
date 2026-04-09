<script setup lang="ts">
const title = "Primary pipework";
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<p class="govuk-body">Primary pipework is required whenever there is a hot water cylinder or a thermal storage tank in the heating system, and it has pipework connected to a separate heat source.</p>
	<p class="govuk-body">The length of primary pipework should be measured from the heat source to the hot water cylinder. Both the primary flow and return lengths should be included.</p>
	<p class="govuk-body">You only need to add information about the primary pipework connecting a heat source to a thermal store, for example a hot water cylinder. Secondary and tertiary pipework is estimated in the calculation.</p>
	<img alt="Primary pipework" src="/img/primary-and-secondary-pipework.png">
</template>