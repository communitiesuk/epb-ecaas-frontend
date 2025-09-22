<script lang="ts" setup>
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useBanner } from "#imports";
import { getInitialState } from "~/stores/ecaasStore";
import { clearLastExportDate } from "~/utils/exportDate";

const title = "Import data";

const store = useEcaasStore();
const banner = useBanner();

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

		let fileState: EcaasState;
    
		try {
			fileState = JSON.parse(reader.result as string)!;
		} catch {
			errorMessage.value = "The provided file is not recognised as containing JSON.";
			return;
		}

		errorMessage.value = null;

		const { newState: newValidatedState, changed: revalidationCausedUpdate } = revalidateState(fileState);
		fileState = newValidatedState as EcaasState;

		store.$patch({
			...getInitialState(),
			...fileState!,
			lastResult: undefined,
		});

		importedFile.value = {
			name: file.value!.name,
			datetime: dayjs(),
		};

		clearLastExportDate();

		// set banner, and navigate to root
		banner.value = revalidationCausedUpdate ? "import-caused-update" : "import-complete";

		navigateTo("/");
	};
	reader.onerror = () => {
		errorMessage.value = "Unable to read file";
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
		<GovInset>Importing a file will override any data currently in the calculation. If you wish to save this data you must first export it.</GovInset>
		<h2 class="govuk-heading-s">Upload a data file</h2>
		<ClientOnly>
			<GovFileUpload
				id="import"
				name="import"
				accept=".json,application/json"
				:change="accessFile"
				:label="{ text: 'Upload a JSON file', classes: 'govuk-!-display-none' }"
				:hint="{ text: 'Select a JSON file that you have previously exported' }"
				:error-message="errorMessage ? { text: errorMessage } : undefined"
			/>
		</ClientOnly>
		<div class="govuk-button-group">
			<GovButton :disabled="!hasFile || undefined" :click="doImport" data-testid="import-button">Import</GovButton>
			<GovButton href="/" secondary>Return to overview</GovButton>
		</div>
	</template>
</template>
