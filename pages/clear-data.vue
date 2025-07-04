<script setup lang="ts">
definePageMeta({ layout: false });

const title = 'Clear data';

</script>

<template>
	<NuxtLayout name="one-column">
		<Head>
			<Title>{{ title }}</Title>
		</Head>
		
		<a href="/" class="govuk-back-link" data-testid="backLink">Back to task list</a>

		<ClearDataPanel />
	</NuxtLayout>
</template>