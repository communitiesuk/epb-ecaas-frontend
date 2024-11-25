<script setup lang="ts">
    import FormStatus from '~/constants/formStatus';

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
                    <client-only>
                        <gv-tag colour="grey">
                            {{ store.dwellingDetails.generalSpecifications.complete ? FormStatus.Complete : FormStatus.NotStarted }}
                        </gv-tag>
                    </client-only>
                </template>
            </gv-task-list-item>
        </gv-task-list>
    </div>
</template>