<script setup lang="ts">
    const title = 'Dwelling details';
	
	const { createTaskListFromPages } = useTaskList();
	const taskList = createTaskListFromPages();
</script>

<template>
    <Head>
        <Title>{{ title }}</Title>
    </Head>
    <h1 class="govuk-heading-l">{{ title }}</h1>
    <div>
        <div>
            <h2 class="govuk-heading-m">Sections to complete</h2>
        </div>
        <GovTaskList :items="taskList" />
    </div>
</template>