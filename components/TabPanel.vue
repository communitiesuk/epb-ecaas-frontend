<script setup lang="ts">
defineProps<{
	id: string;
	selected: boolean;
}>();
</script>

<template>
	<div v-show="selected" :id="id" class="govuk-tabs__panel">
		<slot />
	</div>
</template>