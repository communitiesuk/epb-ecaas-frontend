<script setup lang="ts">
    const title = 'Dwelling details';

    const store = useEcaasStore();
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
        <gv-task-list>
            <gv-task-list-item>
                <template #default>
                    <NuxtLink to="/dwelling-details/general-specifications">General specifications</NuxtLink>
                </template>
                <template #status>
                    <gv-tag colour="grey">{{ store.dwellingDetails.generalSpecifications.status }}</gv-tag>
                </template>
            </gv-task-list-item>
        </gv-task-list>
    </div>
</template>