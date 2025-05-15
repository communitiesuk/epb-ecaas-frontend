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

const { mounted } = useMounted();

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
	<div :class="`govuk-form-group ${showErrorState(props.context) ? 'govuk-form-group--error' : ''}`">
		<fieldset
			:id="id"
			class="govuk-fieldset"
			:aria-describedby="props.context.state.invalid ? `${id}_error` : help ? `${id}_hint` : ''"
		>
			<legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
				{{ label }}
			</legend>
			<div v-if="help" :id="`${id}_hint`" class="govuk-hint">
				{{ help }}
			</div>
			<slot />
			<p v-if="props.context.state.invalid" class="govuk-error-message" :data-testid="`${id}_error`">
				<span class="govuk-visually-hidden">Error:</span> {{ getErrorMessage(props.context) }}
			</p>
			<div class="govuk-radios govuk-radios--small" data-module="govuk-radios">
				<div v-for="key in optionsMap.keys()" :key="key" class="govuk-radios__item">
					<input
						:id="`${id}_${key}`"
						class="govuk-radios__input"
						type="radio"
						:name="name"
						:value="key"
						:checked="mounted ? props.context._value == key : false"
						:data-testid="`${id}_${key}`"
						:aria-describedby="typeof optionsMap.get(key) === 'object' ? `${id}_${key}_hint` : ''"
						@change="handleInput"
					>
					<label class="govuk-label govuk-radios__label" :for="`${id}_${key}`">
						{{ typeof optionsMap.get(key) === 'object' ? optionsMap.get(key).label : optionsMap.get(key) }}
					</label>
					<div v-if="(typeof optionsMap.get(key) === 'object')" :id="`${id}_${key}_hint`" class="govuk-hint govuk-radios__hint">
						{{ optionsMap.get(key).hint }}
					</div>
				</div>
			</div>
		</fieldset>
	</div>
</template>

<style lang="scss">
	.gov-radios-add-link {
		color: #1d70b8;
		font-size: 1.1875rem;
		line-height: 1.3157894737;
		font-weight: bold;
	}
</style>