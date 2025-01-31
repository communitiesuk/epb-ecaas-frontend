<script setup lang="ts">
defineProps<{
	tag: string;
}>();
</script>

<template>
	<div class="govuk-phase-banner">
		<p class="govuk-phase-banner__content">
			<strong class="govuk-tag govuk-phase-banner__content__tag">
				{{ tag }}
			</strong>
			<span class="govuk-phase-banner__text">
				<slot />
			</span>
		</p>
	</div>
</template>