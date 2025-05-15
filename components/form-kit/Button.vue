<script setup>
const props = defineProps({
	context: {
		type: Object,
		default() {
			return {};
		}
	}
});

const { label } = props.context;
</script>

<template>
	<button type="submit" class="govuk-button" data-module="govuk-button">
		{{ label }}
	</button>
</template>