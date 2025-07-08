<script setup lang="ts">
defineProps<{
	id?: string;
	name?: string;
	label?: string;
	help?: string;
}>();
</script>

<template>
	<FormKit
		:id="id ?? 'orientation'"
		type="govInputWithSuffix"
		suffix-text="°"
		:label="label ?? 'Orientation'"
		:name="name ?? 'orientation'"
		:help=help
		validation="required | number | min:0 | max:360">
		<GovDetails summary-text="Help with this input" possibly-llm-placeholder>
			<img src="/img/orientation-measurement.png" alt="Orientation measurement">
			<p class="govuk-hint">To define an object's orientation, measure the angle of its outside face clockwise from true North, accurate to the nearest degree.</p>
		</GovDetails>
	</FormKit>
</template>