<script setup lang="ts">
	defineProps<{
		title: string;
		index: number;
	}>();

	const expanded = ref(false);
	const toggle = () => expanded.value = !expanded.value;
</script>

<template>
	<div class="govuk-accordion__section">
		<div class="govuk-accordion__section-header">
			<h2 class="govuk-accordion__section-heading">
				<button type="button" @click="toggle" class="govuk-accordion__section-button" :aria-controls="`accordion-content-${index}`" :aria-expanded="expanded">
					<span class="govuk-accordion__section-heading-text govuk-heading-s">
						<span class="govuk-accordion__section-heading-text-focus">
							{{ title }}
						</span>
					</span>
					<span class="govuk-accordion__section-toggle" data-nosnippet="">
						<span class="govuk-accordion__section-toggle-focus">
							<span class="govuk-accordion-nav__chevron" :class="!expanded ? 'govuk-accordion-nav__chevron--down' : ''"></span>
							<span class="govuk-accordion__section-toggle-text">{{ expanded ? 'Hide' : 'Show' }}</span>
						</span>
					</span>
				</button>
			</h2>
		</div>
		<div class="govuk-accordion__section-content" :style="expanded ? 'display: block' : ''" :id="`accordion-content-${index}`">
			<slot />
		</div>
	</div>
</template>