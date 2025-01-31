<script setup lang="ts">
export interface GovDetailsProps {
	summaryText: string;
	text: string;
	classes?: string;
}

defineProps<GovDetailsProps>();
</script>

<template>
	<details :class="`govuk-details ${classes}`">
		<summary class="govuk-details__summary">
			<span class="govuk-details__summary-text">
				{{ summaryText }}
			</span>
		</summary>
		<div class="govuk-details__text">
			{{ text }}
		</div>
	</details>
</template>