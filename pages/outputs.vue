<script lang="ts" setup>
definePageMeta({ layout: false });

const title = "Dwelling compliance results";
</script>

<template>
	<NuxtLayout name="one-column">
		<Head>
			<Title>{{ title }}</Title>
		</Head>
		<h1 class="govuk-heading-l">{{ title }}</h1>
		<ClientOnly>
			<ResultTabs />
		</ClientOnly>
		<div class="govuk-!-margin-top-1 govuk-button-group">
			<GovButton href="/get-brel-report">Get BREL Report</GovButton>
			<GovButton href="/" secondary>Edit input data</GovButton>
		</div>
	</NuxtLayout>
</template>
