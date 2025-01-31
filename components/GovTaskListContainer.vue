<script setup lang="ts">
defineProps<{ heading: string }>();
</script>

<template>
	<div class="task-list-container">
		<h2 class="task-list-container__heading govuk-heading-m">{{ heading }}</h2>
		<div class="task-list-container__tasks">
			<slot />
		</div>
	</div>
</template>

<style scoped lang="scss">
	@use "sass:map";

	.task-list-container {
		border: 1px solid map.get($govuk-colours, "mid-grey");
	}

	.task-list-container__heading {
		margin: 0;
		padding: 20px;
		text-decoration: underline;
		background: map.get($govuk-colours, "light-grey");
		font-size: 1.2rem;
	}

	.task-list-container__tasks {
		padding: 20px;
	}
</style>