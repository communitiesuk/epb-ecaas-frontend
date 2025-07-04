<script lang="ts" setup>
import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import { getInitialState } from '~/stores/ecaasStore';

const title = 'Import a calculation';

const store = useEcaasStore();

const file: Ref<File | null> = ref(null);
const importedFile: Ref<{ name: string; datetime: Dayjs } | null> = ref(null);
const errorMessage: Ref<string | null> = ref(null);

const hasFile: Ref<boolean> = computed(() => !!file.value);

const accessFile = (event: Event) => {
	const files = (event.target as HTMLInputElement).files;
	if (!files) {
		return;
	}
	file.value = files[0] || null;
	errorMessage.value = null;
};

const doImport = (_event: Event) => {
	if (!file.value) {
		return;
	}
	const reader = new FileReader();
	reader.onload = () => {
		if (reader.result === null) {
			return;
		}

		let fileState: EcaasState | undefined;
    
		try {
			fileState = JSON.parse(reader.result as string);
		} catch {
			errorMessage.value = 'The provided file is not recognised as containing JSON.';
			return;
		}

		errorMessage.value = null;

		store.$patch({
			...getInitialState(),
			...fileState!,
			lastResult: undefined
		});

		importedFile.value = {
			name: file.value!.name,
			datetime: dayjs()
		};
	};
	reader.onerror = () => {
		errorMessage.value = 'Unable to read file';
	};
	reader.readAsText(file.value);
};

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<template v-if="!importedFile">
		<p class="govuk-body">To continue working on a calculation you must import a previously exported JSON file.</p>
		<h2 class="govuk-heading-s">Upload a calculation</h2>
		<ClientOnly>
			<GovFileUpload
				id="import"
				name="import"
				accept=".json,application/json"
				:change="accessFile"
				:label="{ text: 'Upload a JSON file', classes: 'govuk-!-display-none' }"
				:hint="{ text: 'Select a JSON file that you have previously downloaded' }"
				:error-message="errorMessage ? { text: errorMessage } : undefined"
			/>
		</ClientOnly>
		<GovInset>Importing a file will override any data currently in the calculation. If you wish to save this data you must first export it.</GovInset>
		<div class="govuk-button-group">
			<GovButton :disabled="!hasFile || undefined" :click="doImport" data-testid="import-button">Import</GovButton>
			<GovButton href="/" secondary>Return to task list</GovButton>
		</div>
	</template>
	<template v-else>
		<GovPanel title="Import complete">
			<p>{{ importedFile.name }}</p>
			<p class="govuk-!-margin-bottom-0">{{ importedFile.datetime.format('DD/MM/YYYY HH:mm') }}</p>
		</GovPanel>
		<div class="govuk-button-group govuk-!-margin-top-7">
			<GovButton secondary href="/">Return to task list</GovButton>
		</div>
	</template>
</template>
