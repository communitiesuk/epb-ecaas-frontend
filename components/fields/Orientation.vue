<script setup lang="ts">
const {
	id = "orientation",
	name = "orientation",
	label = "Orientation",
	help = undefined,
	detailsCaption = "To define an object's orientation, measure the angle of its outside face clockwise from true North, accurate to the nearest degree.",
	clearedNonLlm = false,
} = defineProps<{
	id?: string;
	name?: string;
	label?: string;
	help?: string;
	detailsCaption?: string;
	clearedNonLlm?: boolean;
	dataField?: string;
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
		validation="required | number | min:0 | max:360"
		:data-field="dataField">
		<GovDetails summary-text="Help with this input" :possibly-llm-placeholder="!clearedNonLlm">
			<img src="/img/orientation-measurement.png" alt="Orientation measurement">
			<p class="govuk-hint">{{ detailsCaption }}</p>
		</GovDetails>
	</FormKit>
</template>