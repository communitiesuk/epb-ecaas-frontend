<script setup lang="ts">
import dayjs from 'dayjs';

const title = 'Check Part L building compliance';
	
const page = usePage();
const { createTaskList } = useTaskList();
const taskList = createTaskList(page);
const calculateError = ref<CorrectedJsonApiError[] | boolean | undefined>();

const showLoadingIndicator = ref(false);

const showLoading = () => {
	showLoadingIndicator.value = true;
};
const hideLoading = () => {
	showLoadingIndicator.value = false;
};

const lastExportDateCookie = useCookie('last_export_date');
const exportDate = lastExportDateCookie.value ? dayjs(lastExportDateCookie.value) : undefined;

const handleCalculateError = (errors?: CorrectedJsonApiError[] | boolean) => {
	calculateError.value = errors;
};
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<template v-if="!showLoadingIndicator">
		<div v-if="calculateError">
			<GovErrorSummary
				title="Sorry, there's been an error"
				class-name="govuk-!-margin-bottom-5"
				test-id="resultErrorSummary"
			>
				<p class="govuk-body govuk-!-margin-bottom-2">We have noted an unexpected error with the service and we will look into resolving it.</p>
				<p v-if="Array.isArray(calculateError)" class="govuk-body">Error ID: {{ calculateError[0]?.id }}</p>
			</GovErrorSummary>
		</div>
		<h1 class="govuk-heading-l">{{ title }}</h1>
		<GovTaskList :items="taskList" />
		<p v-if="exportDate" class="govuk-body last-export govuk-!-margin-top-5">This calculation was exported on the {{ exportDate.format('DD/MM/YYYY') }} at {{ exportDate.format('HH:mm') }}.</p>
		<div class="govuk-!-margin-top-8">
			<ClientOnly>
				<CalculateButton @loading="showLoading" @stop-loading="hideLoading" @error="handleCalculateError" />
			</ClientOnly>
		</div>
		<div class="govuk-!-margin-top-1 govuk-button-group">
			<GovButton secondary href="/export">Export</GovButton>
			<GovButton secondary href="/import">Import</GovButton>
			<GovButton secondary href="/clear-data">Clear data</GovButton>
		</div>
	</template>
	<LoadingIndicator v-else>Loading results</LoadingIndicator>
</template>

<style lang="scss" scoped>
@use "sass:map";

.last-export {
	color: map.get($govuk-colours, "dark-grey")
}
</style>