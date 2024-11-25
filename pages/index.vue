<script setup lang="ts">
    const title = 'Check dwelling compliance';
    const store = useEcaasStore();
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
                <client-only>
                    <gv-tag colour="grey">{{ store.getSectionStatus('dwellingDetails') }}</gv-tag>
                </client-only>
            </template>
        </gv-task-list-item>
    </gv-task-list>
</template>