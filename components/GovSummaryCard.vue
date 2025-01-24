<script setup lang="ts">
	import pagesData from "~/data/pages";
	import type { SummaryData } from "./GovSummaryList.vue";
	import type { TabItem } from "./GovTabs.vue";

	export interface SummarySection {
		id: string;
		label: string;
		data: SummaryData;
	}

	const props = defineProps<{ summarySections?: SummarySection[] }>();

	const tabItems: TabItem[] = props.summarySections?.map(x => {
		return {
			id: x.id,
			label: x.label
		};
	}) || [];

	function getUrl(pageId: string) {
		const page = pagesData.find(p => pageId === p.id);
		return page?.url;
	}
</script>

<template>
	<GovTabs :items="tabItems" v-slot="tabProps">
		<GovTabPanel v-for="(section, index) in summarySections"
			:key="index"
			:selected="tabProps.currentTab === index"
			:id="section.id"
			:data-testId="section.id"
		>
			<h2 class="govuk-heading-m">{{ section.label }}</h2>
			<GovSummaryList :data="section.data" />
			<NuxtLink class="govuk-link" :to="getUrl(section.id)">Edit</NuxtLink>
		</GovTabPanel>
	</GovTabs>
</template>
