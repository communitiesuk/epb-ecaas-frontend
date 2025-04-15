<script setup lang="ts">
import type { SummarySection } from '~/common.types';
import { getUrl } from '#imports';

defineProps<{ summary: SummarySection, selected: boolean }>();
</script>

<template>
	<GovTabPanel
		:id="summary.id"
		:data-testid="summary.id"
		:selected="selected"
	>
		<template v-if="!Array.isArray(summary.data) || summary.data.length">
			<h2 class="govuk-heading-m">{{ summary.label }}</h2>
			<GovSummaryList :data="summary.data" :id="summary.id"/>
			<NuxtLink class="govuk-link" :to="getUrl(summary.id)">Edit</NuxtLink>
		</template>
		<template v-if="Array.isArray(summary.data) && !summary.data.length">
			<slot name="empty" />
		</template>
	</GovTabPanel>
</template>