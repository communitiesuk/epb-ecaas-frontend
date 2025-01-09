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
</script>

<template>
	<dl class="govuk-summary-list">
		<div v-for="(value, key) in data" :key="key" class="govuk-summary-list__row">
			<dt class="govuk-summary-list__key">{{ key }}</dt>
			<dd class="govuk-summary-list__value">{{ formatData(value) }}</dd>
		</div>
	</dl>
</template>