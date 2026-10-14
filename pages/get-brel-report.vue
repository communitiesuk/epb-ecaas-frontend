<script setup lang="ts">
definePageMeta({ layout: false });

const title = "Get BREL Report";
</script>

<template>
	<NuxtLayout name="one-column">
		<Head>
			<Title>{{ title }}</Title>
		</Head>

		<NuxtLink href="/outputs" class="govuk-back-link" data-testid="backLink">Back to results</NuxtLink>

		<h1 class="govuk-heading-l">{{ title }}</h1>

		<div class="govuk-button-group govuk-!-margin-top-6">
			<GovButton href="/outputs" secondary>Return to results</GovButton>
		</div>
	</NuxtLayout>
</template>
