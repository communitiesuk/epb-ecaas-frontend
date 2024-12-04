<script setup lang="ts">
    const title = 'Check dwelling compliance';
	
	const { createTaskListFromPages } = useTaskList();
	const taskList = createTaskListFromPages();
</script>

<template>
    <Head>
        <Title>{{ title }}</Title>
    </Head>
    <h1 class="govuk-heading-l">{{ title }}</h1>
    <GovTaskList :items="taskList" />
</template>