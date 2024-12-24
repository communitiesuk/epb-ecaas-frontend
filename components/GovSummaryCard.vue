<script setup lang="ts">
import type { summarySectionData } from "~/pages/dwelling-details/summary.vue";
import pagesData, { type Page } from "~/data/pages";
import { ref } from "vue";

defineProps<{ summarySection?: summarySectionData[]}>();

function formatData(value: string | undefined) {
	if (value === undefined) {
		return "";
	}
	if (typeof value == "string") {
		const formattedString = value.split(/(?=[A-Z])/).join(" ");
		return (
			formattedString.charAt(0).toUpperCase() +
			formattedString.slice(1).toLowerCase()
		);
	}
	return value;
}
function getUrl(value: string) {
	const page: Page | undefined = pagesData.find((page) => {
		return value === page.title;
	})
	return page?.url
}

const currentTab = ref(0)

function selectTab(index: number) {
	currentTab.value = index
}

</script>


<template>

	<div class="govuk-tabs" data-module="govuk-tabs">
		<ul class="govuk-tabs__list">
			<li v-for="(section, index) in summarySection" :key="index" class="govuk-tabs__list-item"
				:class="{ 'govuk-tabs__list-item--selected': currentTab === index }">
				<NuxtLink class="govuk-tabs__tab" :to="`#tab-${index}`" @click.prevent="selectTab(index)">{{ section.label }}
				</NuxtLink>
			</li>
		</ul>

		<div v-for="(section, index) in summarySection" :key="index" class="govuk-tabs__panel" :id="`tab-${index}`"
			:class="{ 'govuk-tabs__panel--hidden': currentTab !== index }">
			<h2 class="govuk-heading-m">{{ section.label }}</h2>
			<dl class="govuk-summary-list">
				<div v-for="(value, key) in section.data" :key="key" class="govuk-summary-list__row">
					<dt class="govuk-summary-list__key">{{ key }}</dt>
					<dd class="govuk-summary-list__value">{{ formatData(value) }}</dd>
				</div>
			</dl>
			<NuxtLink class="govuk-link" :to="getUrl(section.label)">Edit</NuxtLink>
		</div>
	</div>
</template>
