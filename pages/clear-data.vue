<script setup lang="ts">

import { clearLastExportDate } from "~/utils/exportDate";

definePageMeta({ layout: false });

const title = 'Clear data';

const store = useEcaasStore();

const handleClearData = async () => {
	store.clearState();
	clearLastExportDate();
	await navigateTo("/");
};

</script>

<template>
	<NuxtLayout name="one-column">
		<Head>
			<Title>{{ title }}</Title>
		</Head>

		<NuxtLink href="/" class="govuk-back-link" data-testid="backLink">Back to task list</NuxtLink>

		<div class="govuk-panel govuk-panel--confirmation clear-data-panel" data-testid="clearDataPanel">
			<h1 class="govuk-panel__title">
				Are you sure you want to clear all inputted data?
			</h1>
			<div class="govuk-panel__body">
				<p>This will delete all the data you've entered so far.</p>
				<p>You can go back to undo this change.</p>
			</div>
			<div class="govuk-button-group">
				<a role="button" class="govuk-button govuk-button--inverse" data-testid="clearDataButton" @click="handleClearData">Clear data</a>
				<NuxtLink href="/" class="govuk-link govuk-link--inverse" data-testid="taskListLink">Return to overview</NuxtLink>
			</div>
		</div>
	</NuxtLayout>
</template>

<style lang="scss" scoped>
	.clear-data-panel {
		background-color: #1d70b8;
        text-align: left;
        font-size: 1.1875rem;
		margin-top: 20px;
		padding-bottom: 25px;

		h1 {
			font-size: 2.25rem;
		}

		.govuk-button-group {
			margin-top: 35px;
			margin-bottom: 0;
		}

		.govuk-button {
			margin-right: 30px;
		}
	}
</style>