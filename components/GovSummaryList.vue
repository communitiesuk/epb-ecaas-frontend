<script setup lang="ts">
export type SummaryData = {
	[key: string]: string | number | boolean | undefined;
};

defineProps<{ data: SummaryData; }>();

function formatData(value: string | number | boolean | undefined) {
	if (value === undefined) {
		return '';
	}

	if (typeof value == 'string') {
		const formattedString = value.split(/(?=[A-Z])/).join(" ");

		return (
			formattedString.charAt(0).toUpperCase() +
				formattedString.slice(1).toLowerCase()
		);
	}

	return value;
}

function hyphenate(value: string | number | boolean | undefined) {
	if (value === undefined) {
		return '';
	}

	if (typeof value == 'string') {
		const formattedString = value.replaceAll(" ","-");

		return (
			formattedString.toLowerCase()
		);
	}

	return value;
}
</script>

<template>
	<dl class="govuk-summary-list">
		<template v-if="!Array.isArray(data)">
			<div v-for="(value, key) in data" :key="key" :data-testid="`summary-${hyphenate(key)}`" class="govuk-summary-list__row">
				<dt class="govuk-summary-list__key">{{ key }}</dt>
				<dd class="govuk-summary-list__value">{{ formatData(value) }}</dd>
			</div>
		</template>
	</dl>
</template>