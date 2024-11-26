<script setup>
	const props = defineProps({
		context: Object
	});

	const { label } = props.context;

	const handleClick = () => {
		props.context.node.submit();
	}
</script>

<template>
	<button type="submit" class="govuk-button" data-module="govuk-button" @click="handleClick">
		{{ label }}
	</button>
</template>