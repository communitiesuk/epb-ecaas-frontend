/** This component is a constituent part of the GOV.UK accordion component (https://design-system.service.gov.uk/components/accordion/) and is used with GovAccordion. */

<script setup lang="ts">
defineProps<{
	id?: string;
	title: string;
	index: number;
	headingSize?: "s" | "m" | "l";
}>();

const expanded = ref(false);
const toggle = () => expanded.value = !expanded.value;
</script>

<template>
	<div class="govuk-accordion__section">
		<div class="govuk-accordion__section-header">
			<h2 class="govuk-accordion__section-heading">
				<button
					type="button"
					class="govuk-accordion__section-button"
					:data-testid="id"
					:aria-controls="`accordion-content-${index}`"
					:aria-expanded="expanded"
					@click="toggle">
					<span :class="`govuk-accordion__section-heading-text govuk-heading-${headingSize ?? 's'}`">
						<span class="govuk-accordion__section-heading-text-focus" :data-testid="`${id}_heading`">
							{{ title }}
						</span>
					</span>
					<span class="govuk-accordion__section-toggle" data-nosnippet="" :data-testid="`${id}_toggle`">
						<span class="govuk-accordion__section-toggle-focus">
							<span class="govuk-accordion-nav__chevron" :class="!expanded ? 'govuk-accordion-nav__chevron--down' : ''" />
							<span class="govuk-accordion__section-toggle-text">{{ expanded ? 'Hide' : 'Show' }}</span>
						</span>
					</span>
				</button>
			</h2>
		</div>
		<div :id="`accordion-content-${index}`" class="govuk-accordion__section-content" :style="expanded ? 'display: block' : ''" :data-testid="`${id}_content`">
			<slot />
		</div>
	</div>
</template>