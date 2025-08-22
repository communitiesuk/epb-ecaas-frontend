<script setup lang="ts">
import dayjs from 'dayjs';
import { lastExportDateCookieName } from '~/utils/exportDate';

const store = useEcaasStore();
const title = 'Export data';

const model = ref<{ fileName?: string }>({
	fileName: undefined
});

const downloadUrl = ref<string | undefined>();
const exportDate = ref<string | undefined>();
const downloadTriggered = ref(false);

const saveForm = (_: typeof model) => {
	const stateValue = JSON.stringify(store.$state);

	const stateBytes = new TextEncoder().encode(stateValue);
	const stateBlob = new Blob([stateBytes], { type: 'application/json;charset=utf-8' });

	downloadUrl.value = URL.createObjectURL(stateBlob);
	exportDate.value = (new Date()).toISOString();

	const lastExportDateCookie = useCookie(lastExportDateCookieName);
	lastExportDateCookie.value = exportDate.value;

	setTimeout(() => {
		document.getElementById('download')?.click();

		URL.revokeObjectURL(downloadUrl.value!);
		downloadTriggered.value = true;
	}, 500);
};

const { handleInvalidSubmit, errorMessages } = useErrorSummary();
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">
		{{ title }}
	</h1>
	<template v-if="downloadUrl">
		<GovPanel title="Export complete">
			<p>{{ `${model.fileName}.json` }}</p>
			<p>The file has been saved to your downloads folder.</p>
			<p class="govuk-!-margin-bottom-0">{{ dayjs(exportDate).format('DD/MM/YYYY HH:mm') }}</p>
		</GovPanel>
		<div class="govuk-button-group govuk-!-margin-top-7">
			<NuxtLink v-if="!downloadTriggered" v-show="false" id="download" :href="downloadUrl" :download="`${model.fileName}.json`" />
			<GovButton secondary href="/">Return to overview</GovButton>
		</div>
	</template>
	<template v-else>
		<p class="govuk-body">To save a completed, or partially completed calculation, you must export it and save it locally. You can import the data file to continue working on it.</p>
		<FormKit v-model="model" type="form" :actions="false" :incomplete-message="false" @submit="saveForm" @submit-invalid="handleInvalidSubmit">
			<GovErrorSummary :error-list="errorMessages" test-id="exportErrorSummary"/>
			<FormKit
				id="fileName"
				type="govInputTextWithSuffix"
				label="Name your file"
				help="Your file will be downloaded with this name"
				name="fileName"
				validation="required"
				suffix-text=".json"
			/>
			<div class="govuk-button-group">
				<FormKit type="govButton" label="Export" />
				<GovButton secondary href="/">Return to overview</GovButton>
			</div>
		</FormKit>
	</template>
</template>

<style lang="scss" scoped>
.govuk-panel__body p {
	margin: 0 0 30px 0;
	font-size: 1.8rem;

	&:last-of-type {
		margin-bottom: 0;
	}
}
</style>