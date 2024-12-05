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
    <div>
        <div>
            <h2 class="govuk-heading-m">Sections to complete</h2>
        </div>
        <GovTaskList :items="taskList" />
    </div>
</template>