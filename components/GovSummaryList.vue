<script setup lang="ts">
import formatData from '~/utils/format-data';
import hyphenate from '~/utils/hyphenate';

export type SummaryData = {
	[key: string]: string | number | boolean | undefined;
};

defineProps<{ data: SummaryData; }>();


</script>

<template>
	<dl class="govuk-summary-list">
		<template v-if="!Array.isArray(data)">
			<div
				v-for="(value, key) in data" :key="key" :data-testid="`summary-${hyphenate(key)}`"
				class="govuk-summary-list__row">
				<dt class="govuk-summary-list__key">{{ key }}</dt>
				<dd class="govuk-summary-list__value">{{ formatData(value) }}</dd>
			</div>
		</template>
	</dl>
</template>