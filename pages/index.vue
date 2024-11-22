<script setup lang="ts">
    const title = 'Check dwelling compliance';
</script>

<template>
    <Head>
        <Title>{{ title }}</Title>
    </Head>
    <h1 class="govuk-heading-l">{{ title }}</h1>
    <gv-task-list>
        <gv-task-list-item>
            <template #default>
                <NuxtLink to="/dwelling-details">Dwelling details</NuxtLink>
            </template>
            <template #status>
                <gv-tag colour="grey">Not started</gv-tag>
            </template>
        </gv-task-list-item>
    </gv-task-list>
</template>