<script setup lang="ts">
import { getErrorMessage, showErrorState } from "#imports";
import type { FormKitFrameworkContext } from "@formkit/core";

const props = defineProps<{
	context: FormKitFrameworkContext
}>();

const {
	id,
	node: { name },
	label,
	help,
} = props.context;

const { mounted } = useMounted();

function handleInput(e: Event) {
	const target = e.target as HTMLTextAreaElement;
	props.context.node.input(target.value);
}

function handleBlur(e: FocusEvent) {
	props.context.handlers.blur(e);
}
</script>

<template>
	<div :class="`govuk-form-group ${showErrorState(props.context) ? 'govuk-form-group--error' : ''}`">
		<label class="govuk-label govuk-label--m" :for="id">
			{{ label }}
		</label>
		<div v-if="help" :id="`${id}_hint`" class="govuk-hint">
			{{ help }}
		</div>
		<p
			v-if="props.context.state.invalid"
			class="govuk-error-message"
			:data-testid="`${id}_error`"
		>
			<span class="govuk-visually-hidden">Error:</span> {{ getErrorMessage(props.context) }}
		</p>
		<textarea
			:id="id"
			:class="`govuk-textarea govuk-!-width-two-thirds ${props.context.state.invalid ? 'govuk-textarea--error' : ''}`"
			:name="name"
			:rows="5"
			:value="mounted ? props.context._value : ''"
			:aria-describedby="props.context.state.invalid ? `${id}_error` : help ? `${id}_hint` : ''"
			:data-testid="id"
			v-bind="props.context.attrs"
			@input="handleInput"
			@blur="handleBlur"
		/>
	</div>
</template>
