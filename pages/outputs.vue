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
		<GovButton href="/" secondary>Edit inputted data</GovButton>
	</NuxtLayout>
</template>
