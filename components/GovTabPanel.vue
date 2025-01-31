<script setup lang="ts">
defineProps<{
	id: string;
	selected: boolean;
}>();
</script>

<template>
	<div :id="id" class="govuk-tabs__panel" :class="{ 'govuk-tabs__panel--hidden': !selected }">
		<slot />
	</div>
</template>