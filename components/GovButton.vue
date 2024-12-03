<script setup>
	const props = defineProps({
		context: Object
	});

	const { label } = props.context;
</script>

<template>
	<button type="submit" class="govuk-button" data-module="govuk-button">
		{{ label }}
	</button>
</template>