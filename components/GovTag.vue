<script setup lang="ts">
	export interface GovTagProps {
		text: string;
		classes?: string;
	}

	defineProps<GovTagProps>();
</script>

<template>
	<strong :class="`govuk-tag ${classes}`">
		{{ text }}
	</strong>
</template>