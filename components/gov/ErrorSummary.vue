<script setup lang="ts">
withDefaults(defineProps<{
	title?: string;
	errorList?: Array<{
		id: string;
		text: string | undefined;
	}>;
	testId?: string;
	className?: string;
	useLinks?: boolean;
}>(), {
	title: undefined,
	errorList: undefined,
	testId: undefined,
	className: undefined,
	useLinks: true,
});

const navigateToField = (id: string) => (e: Event) => {
	e.preventDefault();

	const label = document.querySelector(`label[for="${id}"]`);

	if (label) {
		label.scrollIntoView();
		return;
	}

	document.getElementById(id)?.scrollIntoView();
};
</script>

<template>
	<div v-if="(errorList && errorList.length) || $slots.default" :class="`govuk-error-summary ${className ?? ''}`" data-module="govuk-error-summary" :data-testid="testId">
		<div role="alert">
			<h2 class="govuk-error-summary__title">
				{{ title ?? 'There is a problem' }}
			</h2>
			<div class="govuk-error-summary__body">
				<ul v-if="errorList && errorList.length" class="govuk-list govuk-error-summary__list">
					<li v-for="error in errorList" :key="error.id">
						<a v-if="useLinks" :href="`#${error.id}`" :onclick="navigateToField(error.id)">{{ error.text }}</a>
						<span v-else>{{ error.text }}</span>
					</li>
				</ul>
				<p v-if="$slots" class="govuk-body">
					<slot />
				</p>
			</div>
		</div>
	</div>
</template>