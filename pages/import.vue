<script lang="ts" setup>
const title = 'Import a calculation';

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
		console.log(reader.result);
	};
	reader.onerror = () => {
		console.error('could not read file');
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
		<GovFileUpload id="import" name="import" accept=".json,application/json" :change="accessFile" />
	</ClientOnly>
	<GovWarningText>Importing a file will override any data currently in the calculation. If you wish to save this data you must first export it.</GovWarningText>
	<div class="govuk-button-group">
		<GovButton :disabled="!hasFile || undefined" :click="doImport">Import</GovButton>
		<GovButton href="/" secondary>Return to overview</GovButton>
	</div>
</template>
