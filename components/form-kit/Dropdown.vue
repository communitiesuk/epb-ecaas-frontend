<script setup lang="ts">
import type { FormKitFrameworkContext } from "@formkit/core";
import { showErrorState, getErrorMessage } from "#imports";

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

const { mounted } = useMounted();

function handleInput(e: Event) {
	const target = e.target as HTMLSelectElement;
	props.context.node.input(target.value);
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
		<p v-if="props.context.state.invalid" class="govuk-error-message" :data-testid="`${id}_error`">
			<span class="govuk-visually-hidden">Error:</span> {{ getErrorMessage(props.context) }}
		</p>
		<slot />
		<select
			:id="id"
			:class="`govuk-select govuk-input--width-10 ${props.context.state.invalid ? 'govuk-select--error' : ''}`"
			:name="name"
			:value="mounted ? props.context._value : ''"
			:data-testid="id"
			:aria-describedby="props.context.state.invalid ? `${id}_error` : help ? `${id}_hint` : ''"
			@input="handleInput"
		>
			<option value="">Select</option>
			<template v-if="Array.isArray(options)">
				<optgroup v-for="(opts, index) in options" :key="index" label="--">
					<option v-for="key in Object.keys(opts)" :key="key" :value="key">
						{{ opts[key] }}
					</option>
				</optgroup>
			</template>
			<template v-if="!Array.isArray(options)">
				<option v-for="key in Object.keys(options)" :key="key" :value="key">
					{{ options[key] }}
				</option>
			</template>
		</select>
	</div>
</template>

<style scoped lang="scss">
	.govuk-select {
		max-width: 11.5em;
	}
</style>