<script lang="ts" setup>
const title = "Dwelling compliance results";

const store = useEcaasStore();
const { lastResult: result } = store.$state;

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<ClientOnly>
		<template v-if="!result">
			<p class="govuk-body">There are no results yet to show.</p>
		</template>
		<template v-if="result?.resultType === 'ok'">
			<p class="govuk-body">That got a good successful response! Display of the response to follow.</p>
		</template>
		<template v-if="result?.resultType === 'err'">
			<p class="govuk-body">There were errors as follows:</p>
			<template v-for="error in result.errors">
				<pre>{{ error.detail }}</pre>
			</template>
		</template>
	</ClientOnly>
</template>

<style lang="css">
pre {
    white-space: pre-wrap;
}
</style>