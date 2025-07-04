<script setup lang="ts">

const store = useEcaasStore();

const handleClearData = async () => {
	store.clearState();
	await navigateTo("/");
};

</script>

<template>
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
			<a href="/" class="govuk-link govuk-link--inverse"  data-testid="taskListLink">Go back to task list</a>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.clear-data-panel {
		background-color: #1d70b8;
        text-align: left;
        font-size: 1.1875rem;
		margin-top: 20px;
		padding-bottom: 20px;

		h1 {
			font-size: 2.25rem;
		}

		.govuk-button-group {
			margin-top: 40px;
			margin-bottom: 0;
		}

		.govuk-button {
			margin-right: 30px;
		}
	}
</style>