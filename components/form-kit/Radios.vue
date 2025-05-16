<script setup lang="ts">
import type { FormKitFrameworkContext } from '@formkit/core';
import { showErrorState, getErrorMessage } from '#imports';

export type RadioOption = {
	label: string;
	hint?: string;
};

const props = defineProps<{
	context: FormKitFrameworkContext
}>();
	
const {
	id,
	node: { name },
	attrs: { options },
	label,
	help
} = props.context;

function handleInput(e: Event) {
	const target = e.target as HTMLInputElement;
	const valueType = props.context.attrs['value-type'];
	
	if (valueType === 'number') {
		props.context.node.input(parseInt(target.value));
	} else {
		props.context.node.input(target.value);
	}
}

const optionsMap = options instanceof Map ? options : new Map(Object.entries(options));
</script>

<template>
	<GovRadios
		:id="id"
		:name="name"
		:label="label || ''"
		:help="help"
		:options="optionsMap"
		:show-error-state="() => showErrorState(props.context)"
		:show-error-message="() => getErrorMessage(props.context)"
		:invalid="props.context.state.invalid"
		:aria-described-by="props.context.state.invalid ? `${id}_error` : help ? `${id}_hint` : ''"
		:handle-input="handleInput"
		:current-value="props.context._value"
	/>
</template>
