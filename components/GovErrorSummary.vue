<script setup lang="ts">
	defineProps<{
		title?: string;
		errorList?: Array<{
			id: string;
			text: string | undefined;
		}>;
		testId?: string;
	}>();

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
	<div class="govuk-error-summary" data-module="govuk-error-summary" v-if="errorList && errorList.length" :data-testid="testId">
		<div role="alert">
			<h2 class="govuk-error-summary__title">
				{{ title ?? 'There is a problem' }}
			</h2>
			<div class="govuk-error-summary__body">
				<ul class="govuk-list govuk-error-summary__list">
					<li v-for="error in errorList">
						<a :href="`#${error.id}`" :onclick="navigateToField(error.id)">{{ error.text }}</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>