<script setup lang="ts">
const { sidebar = true } = defineProps<{ sidebar?: boolean; }>();
</script>

<template>
	<div :class="sidebar ? 'govuk-grid-column-two-thirds' : 'govuk-grid-column-full'">
		<slot />
	</div>
	<div v-if="sidebar" class="govuk-grid-column-one-third">
		<SideNavBar />    
	</div>
</template>