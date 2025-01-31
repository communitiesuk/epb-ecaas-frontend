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
	<GovTabs v-slot="tabProps" :items="tabItems">
		<GovTabPanel
			v-for="(section, index) in summarySections"
			:id="section.id"
			:key="index"
			:selected="tabProps.currentTab === index"
			:data-testId="section.id"
		>
			<h2 class="govuk-heading-m">{{ section.label }}</h2>
			
			<template v-if="!Array.isArray(section.data)">
				<GovSummaryList :data="section.data" />
				<NuxtLink class="govuk-link" :to="getUrl(section.id)">Edit</NuxtLink>
			</template>
			
			<template v-if="Array.isArray(section.data)">
				<GovAccordion>
					<GovAccordionSection v-for="(entry, entryIndex) in section.data" :key="`${section.id}_${entryIndex}`" :title="(entry.Name as string)" :index="index">
						<GovSummaryList :data="entry" />
						<NuxtLink class="govuk-link" :to="`${getUrl(section.id)}/${index}`">Edit</NuxtLink>
					</GovAccordionSection>
				</GovAccordion>
			</template>
		</GovTabPanel>
	</GovTabs>
</template>
