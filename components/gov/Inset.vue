<script setup lang="ts">
defineProps<{ testId?: string }>();
</script>
<template>
	<div class="govuk-inset-text" :data-testId="testId">
		<slot />
	</div>
</template>