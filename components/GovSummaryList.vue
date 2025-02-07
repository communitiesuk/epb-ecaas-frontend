<script setup lang="ts">
import formatData from '~/utils/format-data';
import hyphenate from '~/utils/hyphenate';

export type SummaryData = {
	[key: string]: string | number | boolean | string[] | undefined;
};

defineProps<{ data: SummaryData; }>();
</script>

<template>
	<dl class="govuk-summary-list">
		<template v-if="!Array.isArray(data)">
			<div
				v-for="(value, key) in data" :key="key" :data-testid="`summary-${hyphenate(key as string)}`"
				class="govuk-summary-list__row">
				<dt class="govuk-summary-list__key">{{ key }}</dt>
				<dd class="govuk-summary-list__value">
					<template v-if="Array.isArray(value)">
						<ul>
							<li v-for="item in value" :key="item">
								{{ formatData(item) }}
							</li>
						</ul>
					</template>
					<template v-if="!Array.isArray(value)">
						{{ formatData(value) }}
					</template>
				</dd>
			</div>
		</template>
	</dl>
</template>

<style lang="scss" scoped>
	.govuk-summary-list__value ul {
		padding: 0;
		margin: 0;
		list-style-type: none;
	}
</style>