<script setup lang="ts">
	import pagesData from "~/data/pages";
	import type { SummaryData } from "./GovSummaryList.vue";
	import type { TabItem } from "./GovTabs.vue";

	export interface SummarySection {
		id: string;
		label: string;
		data: SummaryData | SummaryData[];
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
			
			<template v-if="!Array.isArray(section.data)">
				<GovSummaryList :data="section.data" />
				<NuxtLink class="govuk-link" :to="getUrl(section.id)">Edit</NuxtLink>
			</template>
			
			<template v-if="Array.isArray(section.data)">
				<GovAccordion>
					<GovAccordionSection v-for="(entry, index) in section.data" :title="(entry.Name as string)" :index="index">
						<GovSummaryList :data="entry" />
						<NuxtLink class="govuk-link" :to="`${getUrl(section.id)}/${index}`">Edit</NuxtLink>
					</GovAccordionSection>
				</GovAccordion>
			</template>
		</GovTabPanel>
	</GovTabs>
</template>
