<script setup lang="ts">
import type { FormKitFrameworkContext } from '@formkit/core';
import { showErrorState, getErrorMessage } from '#imports';

const props = defineProps<{
	context: FormKitFrameworkContext
}>();

const {
	id,
	node: { name },
	label,
	help
} = props.context;

const { mounted } = useMounted();

function handleInput(e: Event) {
	const target = e.target as HTMLInputElement;
	props.context.node.input(target.value);
}
</script>

<template>
	<div :class="`govuk-form-group ${showErrorState(props.context) ? 'govuk-form-group--error' : ''}`">
		<h1 class="govuk-label-wrapper">
			<label class="govuk-label govuk-label--m" :for="id">
				{{ label }}
			</label>
		</h1>
		<div v-if="help" :id="`${id}_hint`" class="govuk-hint">
			{{ help }}
		</div>
		<p v-if="props.context.state.invalid" class="govuk-error-message" :data-testid="`${id}_error`">
			<span class="govuk-visually-hidden">Error:</span> {{ getErrorMessage(props.context) }}
		</p>
		<input
			:id="id"
			:class="`govuk-input govuk-input--width-10 ${props.context.state.invalid ? 'govuk-input--error' : ''}`"
			:name="name"
			type="text"
			:value="mounted ? props.context._value : ''"
			:aria-describedby="props.context.state.invalid ? `${id}_error` : help ? `${id}_hint` : ''"
			:data-testid="id"
			@change="handleInput"
		>
	</div>
</template>
