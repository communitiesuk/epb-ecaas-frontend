<script setup lang="ts">
	const page = usePage();

	const { createTaskList } = useTaskList();
	const taskList = createTaskList(page);
</script>

<template>
	<Head>
		<Title>{{ page?.title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ page?.title }}</h1>
	<GovTaskListContainer heading="Sections to complete">
		<GovTaskList :items="taskList" />
	</GovTaskListContainer>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<NuxtLink to="/" class="govuk-button">Return to task list</NuxtLink>
		<NuxtLink :to="`${page?.url}/summary`" class="govuk-button govuk-button--secondary">View summary</NuxtLink>
	</div>
</template>