<script lang="ts" setup>
const title = 'Import a calculation';
</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<p class="govuk-body">To continue working on a calculation you must import a previously exported JSON file.</p>
	<h2 class="govuk-heading-s">Upload a calculation</h2>
	<ClientOnly>
		<GovFileUpload id="import" name="import" accept=".json,application/json" />
	</ClientOnly>
	<GovWarningText>Importing a file will override any data currently in the calculation. If you wish to save this data you must first export it.</GovWarningText>
	<GovButton href="/" secondary>Return to overview</GovButton>
</template>
