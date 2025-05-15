<script setup lang="ts">
import type { FormKitFrameworkContext } from '@formkit/core';

const props = defineProps<{
	context: FormKitFrameworkContext
}>();

const { label } = props.context;
</script>

<template>
	<button type="submit" class="govuk-button" data-module="govuk-button">
		{{ label }}
	</button>
</template>