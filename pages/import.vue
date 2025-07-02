<script lang="ts" setup>
import { getInitialState } from '~/stores/ecaasStore';

const title = 'Import a calculation';

const store = useEcaasStore();

const file: Ref<File | null> = ref(null);

const hasFile: Ref<boolean> = computed(() => !!file.value);

const accessFile = (event: Event) => {
	const files = (event.target as HTMLInputElement).files;
	if (!files) {
		return;
	}
	file.value = files[0] || null;
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
		} catch (e) {
			console.error(`could not parse this as JSON: ${e instanceof SyntaxError ? e.message : 'unknown error'}`);
			return;
		}
		
		console.log({
			...getInitialState(),
			...fileState!,
			lastResult: undefined
		});
		store.$patch({
			...getInitialState(),
			...fileState!,
			lastResult: undefined
		});
		navigateTo('/');
	};
	reader.onerror = () => {
		console.error('could not read file!');
	};
	reader.readAsText(file.value);
};

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<p class="govuk-body">To continue working on a calculation you must import a previously exported JSON file.</p>
	<h2 class="govuk-heading-s">Upload a calculation</h2>
	<ClientOnly>
		<GovFileUpload
			id="import"
			name="import"
			accept=".json,application/json"
			:change="accessFile"
			:label="{ text: '' }"
			:hint="{ text: 'Select a JSON file that you have previously downloaded' }"
		/>
	</ClientOnly>
	<GovWarningText>Importing a file will override any data currently in the calculation. If you wish to save this data you must first export it.</GovWarningText>
	<div class="govuk-button-group">
		<GovButton :disabled="!hasFile || undefined" :click="doImport">Import</GovButton>
		<GovButton href="/" secondary>Return to task list</GovButton>
	</div>
</template>
