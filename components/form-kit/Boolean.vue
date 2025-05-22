<script setup lang="ts">
import type { FormKitFrameworkContext } from '@formkit/core';
import { showErrorState, getErrorMessage } from '#imports';
import type { RadioOption } from './Radios.vue';

const props = defineProps<{
	context: FormKitFrameworkContext<boolean>
}>();

const {
	id,
	node: { name },
	attrs: { trueLabel = 'Yes', falseLabel = 'No' },
	label,
	help,
} = props.context;

const yesValue = 'yes';
const noValue = 'no';

type BooleanValue = typeof yesValue | typeof noValue;

const options: Map<BooleanValue, RadioOption> = new Map([
	[yesValue, { label: trueLabel }],
	[noValue, { label: falseLabel }],
]);

function handleInput(e: Event) {
	const target = e.target as HTMLInputElement;

	props.context.node.input(target.value === yesValue);
}

const currentValue = computed(() => {
	if (props.context._value === undefined) {
		return undefined;
	}
	return props.context._value ? yesValue : noValue;
});

</script>

<template>
	<GovRadios
		:id="id"
		:name="name"
		:label="label || ''"
		:help="help"
		:options="options"
		:show-error-state="() => showErrorState(props.context)"
		:show-error-message="() => getErrorMessage(props.context)"
		:invalid="props.context.state.invalid"
		:aria-describedby="props.context.state.invalid ? `${id}_error` : help ? `${id}_hint` : ''"
		:handle-input="handleInput"
		:current-value="currentValue"
	>
		<slot />
	</GovRadios>
</template>