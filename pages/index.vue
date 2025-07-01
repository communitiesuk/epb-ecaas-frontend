<script setup lang="ts">
import dayjs from 'dayjs';

const title = 'Check Part L building compliance';
	
const page = usePage();
const { createTaskList } = useTaskList();
const taskList = createTaskList(page);

const lastExportDateCookie = useCookie('last_export_date');
const exportDate = lastExportDateCookie.value ? dayjs(lastExportDateCookie.value) : undefined;
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<GovTaskList :items="taskList" />
	<p v-if="exportDate" class="govuk-body last-export govuk-!-margin-top-5">This calculation was exported on the {{ exportDate.format('DD/MM/YYYY') }} at {{ exportDate.format('HH:mm') }}.</p>
	<div class="govuk-!-margin-top-8">
		<ClientOnly>
			<CalculateButton />
		</ClientOnly>
	</div>
	<div class="govuk-!-margin-top-1 govuk-button-group">
		<GovButton secondary href="/export">Export</GovButton>
		<GovButton secondary href="/import">Import</GovButton>
	</div>
</template>

<style lang="scss" scoped>
@use "sass:map";

.last-export {
	color: map.get($govuk-colours, "dark-grey")
}
</style>