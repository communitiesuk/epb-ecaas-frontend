<script setup lang="ts">
    const title = 'Check dwelling compliance';
    const store = useEcaasStore();
</script>

<template>
    <Head>
        <Title>{{ title }}</Title>
    </Head>
    <h1 class="govuk-heading-l">{{ title }}</h1>
    <GovTaskList
        :items="[{
            id: 'dwellingDetails',
            title: 'Dwelling details',
            href: '/dwelling-details',
            status: {
                tag: store.getSectionStatus('dwellingDetails')
            }
        }]"
    />
</template>