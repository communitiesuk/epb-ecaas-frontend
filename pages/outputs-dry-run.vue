<script lang="ts" setup>
import dayjs from "dayjs";

definePageMeta({ layout: false });

const title = "Check Part L compliance";
</script>

<template>
	<NuxtLayout name="one-column">
		<Head>
			<Title>{{ title }}</Title>
		</Head>
		<h2 class="govuk-heading-l">{{ title }}</h2>
		<GovPanel title="Calculation successful">
			<p>You have inputted everything correctly and this would provide a compliance result.</p>
			<p>{{ dayjs().format("DD/MM/YYYY HH:mm") }}</p>
		</GovPanel>
		<GovButton href="/" secondary>Return to overview</GovButton>
	</NuxtLayout>
</template>
