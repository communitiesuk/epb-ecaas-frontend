<script setup lang="ts">
defineProps<{
	tag: string;
	classes?: string;
}>();
</script>

<template>
	<div class="govuk-phase-banner govuk-width-container">
		<p class="govuk-phase-banner__content">
			<strong :class="`govuk-tag govuk-phase-banner__content__tag ${classes}`">
				{{ tag }}
			</strong>
			<span class="govuk-phase-banner__text">
				<slot />
			</span>
		</p>
	</div>
</template>

<style scoped lang="scss">
.govuk-tag--green {
	background: #89CC04;
	color: #000;
	font-weight: 700;
}
</style>