<script setup lang="ts">
import formatData from '~/utils/format-data';
import hyphenate from '~/utils/hyphenate';

export type SummaryData = {
	[key: string]: string | number | boolean | string[] | undefined;
};

const props = defineProps<{ data: SummaryData | SummaryData[]; id: string }>();

const overflow = Array.isArray(props.data) && props.data.length > 3;
</script>

<template>
	<div :class="overflow ? 'govuk-summary-list-overflow' : ''">
		<dl class="govuk-summary-list">
			<template v-if="!Array.isArray(data)">
				<div
					v-for="(value, key) in data" :key="key" :data-testid="`summary-${id}-${hyphenate(key as string)}`"
					class="govuk-summary-list__row">
					<dt class="govuk-summary-list__key">{{ key }}</dt>
					<dd class="govuk-summary-list__value">
						<template v-if="Array.isArray(value)">
							<ul>
								<li v-for="item in value" :key="item">
									{{ formatData(item, true) }}
								</li>
							</ul>
						</template>
						<template v-if="!Array.isArray(value)">
							{{ formatData(value, true) }}
						</template>
					</dd>
				</div>
			</template>
			<template v-if="Array.isArray(data) && data.length">
				<template v-for="(key, keyIndex) in Object.keys(data[0])" :key="key">
					<div v-if="data.some(x => x[key] != undefined)" class="govuk-summary-list__row" :data-testid="`summary-${id}-${hyphenate(key as string)}`">
						<dt class="govuk-summary-list__key" >{{ key }}</dt>
						<template v-for="(entry, index) in data" :key="`entry-${key}-${index}`">
							<template v-for="(entryProp, entryKey) in entry" :key="`prop-${entryKey}-${index}`">
								<dd v-if="entryKey === key" class="govuk-summary-list__value" :class="keyIndex === 0 ? 'govuk-!-font-weight-bold' : ''">
									<template v-if="Array.isArray(entryProp)">
										<ul>
											<li v-for="item in entryProp" :key="item">
												{{ formatData(item, true) }}
											</li>
										</ul>
									</template>
									<template v-if="!Array.isArray(entryProp)">
										{{ formatData(entryProp, true) }}
									</template>
								</dd>
							</template>
						</template>
					</div>
				</template>
			</template>
		</dl>
	</div>
</template>

<style lang="scss" scoped>
	.govuk-summary-list-overflow {
		overflow-x: auto;
		margin-bottom: 20px;

		.govuk-summary-list {
			width: max-content;
		}
	}

	.govuk-summary-list__key {
		width: 200px
	}

	.govuk-summary-list__value ul {
		padding: 0;
		margin: 0;
		list-style-type: none;
	}
</style>