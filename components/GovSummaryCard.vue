<script setup lang="ts">
import type { TabItem } from "./GovTabs.vue";
import type { SummarySection } from "~/common.types";
import { getUrl } from "#imports";

const props = defineProps<{ summarySections?: SummarySection[] }>();

const tabItems: TabItem[] = props.summarySections?.map(x => {
	return {
		id: x.id,
		label: x.label
	};
}) || [];
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

			<GovSummaryList :data="section.data" />
			<NuxtLink class="govuk-link" :to="getUrl(section.id)">Edit</NuxtLink>
		</GovTabPanel>
	</GovTabs>
</template>
