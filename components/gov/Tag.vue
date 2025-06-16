<script setup lang="ts">
import type { GovTagProps } from '~/common.types';

defineProps<GovTagProps>();
</script>

<template>
	<strong :class="`govuk-tag ${color ? `govuk-tag--${color}` : ''}`">
		{{ text }}
	</strong>
</template>