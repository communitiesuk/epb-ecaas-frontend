<script setup lang="ts">
const page = usePage();

if (!page) {
	const route = useRoute();

	throw createError({
		statusCode: 404,
		statusMessage: `Page not found: ${route.path}`
	});
}

const { createTaskList } = useTaskList();
const taskList = createTaskList(page);
</script>

<template>
	<Head>
		<Title>{{ page?.title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ page?.title }}</h1>
	<GovTaskList :items="taskList" />
	<div class="govuk-button-group govuk-!-margin-top-6">
		<GovButton href="/" secondary>Return to overview</GovButton>
		<NuxtLink :to="`${page?.url}/summary`" class="govuk-button govuk-button--secondary">View summary</NuxtLink>
	</div>
</template>