<script setup lang="ts">
    const page = usePage();
</script>

<template>
	<Head>
        <Title>{{ page?.title }}</Title>
    </Head>
    <h1 class="govuk-heading-l">{{ page?.title }}</h1>
</template>