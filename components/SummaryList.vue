<script setup lang="ts">
import { computed, ref } from "vue";
import { getUrl } from "#imports";
import formatData from "~/utils/format-data";
import hyphenate from "~/utils/hyphenate";
import type { SummaryWithLink } from "~/pages/domestic-hot-water/summary.vue";

export type SummaryData = {
	[key: string]: string | number | boolean | string[] | SummaryWithLink | undefined;
};


/**
 * Transposes an array of objects into a 2D array of strings.
 *
 * Used by the SummaryList component when the `transposed` prop is `true`.
 * All values are coerced to strings, so this should only be used with data
 * that can be meaningfully converted to strings.
 *
 * Currently used only for thermal bridging data. If additional data types
 * require transposition in the future, consider generalising this function.
 *
 * @param data - Array of objects to transpose.
 * @returns A 2D array of strings containing the transposed data.
 */
function transposeData(data: SummaryData[]): string[][] {
	if (!data.length) return [];

	const keys = Object.keys(data[0]!);
	const transposed: string[][] = [];

	transposed.push(keys);

	for (const row of data) {
		const newRow: string[] = [];
		for (const key of keys) {
			newRow.push(String(row[key]));
		}
		transposed.push(newRow);
	}

	return transposed;
}

const props = defineProps<{ data: SummaryData | SummaryData[]; id: string; stickyFirstColumn?: boolean; transposed?: boolean }>();

const overflow = computed(() => Array.isArray(props.data) && props.data.length > 3);

const scrollContainer = ref<HTMLElement | null>(null);
const isHorizontallyScrolled = ref(false);

const updateScrollState = () => {
	isHorizontallyScrolled.value =
		(scrollContainer.value?.scrollLeft ?? 0) > 0;
};

</script>

<template>
	<div
		ref="scrollContainer"
		:class="[
			overflow ? 'govuk-summary-list-overflow' : '',
			overflow && stickyFirstColumn ? 'govuk-summary-list-overflow--sticky-first-column' : '',
			overflow && stickyFirstColumn && isHorizontallyScrolled ? 'govuk-summary-list-overflow--scrolled' : '',
		]"
		@scroll.passive="updateScrollState">
		<dl v-if="!transposed" class="govuk-summary-list">
			<template v-if="!Array.isArray(data)">
				<div
					v-for="(value, key) in data"
					:key="key"
					:data-testid="`summary-${id}-${hyphenate(key as string)}`"
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
							{{ value }}
						</template>
					</dd>
				</div>
			</template>
			<template v-if="Array.isArray(data) && data.length && !transposed">
				<template v-for="(key, keyIndex) in Object.keys(data[0]!)" :key="key">
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
									<template v-if="!Array.isArray(entryProp) && typeof entryProp === 'object' && 'link' in entryProp">
										<div class="summary-link-block">
											<div >{{ entryProp.text }}</div>
											<NuxtLink
												:to="getUrl(entryProp.link)"
												class="govuk-link"
											>
												{{ entryProp.linkText }}
											</NuxtLink>
										</div>
									</template>

									<template v-else>
										{{ entryProp }}
									</template>
								</dd>
							</template>
						</template>
					</div>
				</template>
			</template>
		</dl>
		<table v-else-if="Array.isArray(data) && data.length" class="govuk-summary-list" data-testid="summary-transposed-table">
			<tbody>
				<template v-for="(row, rowIndex) in transposeData(data)" :key="`row-${rowIndex}`">
					<tr class="govuk-summary-list__row" :data-testid="`summary-${id}-row-${rowIndex}`">
						<template v-for="(cell, cellIndex) in row" :key="`cell-${cellIndex}`">
							<td
								:class="[
									cellIndex === 0 ? 'govuk-summary-list__key' : 'govuk-summary-list__value',
									rowIndex === 0 ? 'govuk-!-font-weight-bold' : '',
								]">
								{{ cell }}
							</td>
						</template>
					</tr>
				</template>
			</tbody>
		</table>
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

	.govuk-summary-list-overflow--sticky-first-column {
		.govuk-summary-list__key {
			position: sticky;
			left: 0;
			z-index: 2;
			background: #fff;
		}
		::after{
			content: '';
			position: absolute;
			inset: 0 0 0 auto;
			width: 1px;
			background: transparent;
		}
	}

	.govuk-summary-list-overflow--scrolled {
		.govuk-summary-list__key::after {
			box-shadow: 1px 0 0 #b1b4b6;
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
	.summary-link-block {
  display: block;  
  max-width: 100%;
}

.summary-link-block div {
  margin-bottom: 4px;
}

.govuk-link {
  display: inline-block; 
  white-space: normal;   
  word-break: break-word; 
  overflow-wrap: break-word;
}

.govuk-summary-list-overflow .govuk-summary-list__value {
  min-width: 150px;
  max-width: 150px;
}
</style>