<script setup lang="ts">
    import formStatus from '~/constants/formStatus';

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
        <GovTaskList
            :items="[{
                id: 'generalSpecifications',
                title: 'General specifications',
                href: '/dwelling-details/general-specifications',
                status: {
                    tag: store.dwellingDetails.generalSpecifications.complete ? formStatus.complete : formStatus.notStarted
                }
            }]"
        />
    </div>
</template>