<script setup lang="ts">
const title = 'Check Part L building compliance';
	
const page = usePage();
const { createTaskList } = useTaskList();
const taskList = createTaskList(page);
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovTaskList :items="taskList" />
	<div class="govuk-!-margin-top-8">
		<CalculateButton />
	</div>
</template>