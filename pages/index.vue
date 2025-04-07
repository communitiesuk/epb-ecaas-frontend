<script setup lang="ts">
const title = 'Check part L building compliance';
	
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
</template>