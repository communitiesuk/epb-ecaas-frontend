<script setup lang="ts">
import type { FormKitFrameworkContext } from '@formkit/core';
import { showErrorState, getErrorMessage } from '#imports';
import { Length, LengthUnit } from '~/utils/units/unitsLength';
import { Volume, VolumeUnit } from '~/utils/units/unitsVolume';

const props = defineProps<{
	context: FormKitFrameworkContext
}>();

const {
	id,
	node: { name },
	attrs: { unit },
	label,
	help,
} = props.context;

const { mounted } = useMounted();

function handleTyping(e: Event) {
	const target = e.target as HTMLInputElement;
	const value = target.value ? parseFloat(target.value) : '';
	
	if (Number.isNaN(value)) {
		props.context.node.input('');
	}
}

function handleInput(e: Event) {
	const target = e.target as HTMLInputElement;
	const value = target.value ? parseFloat(target.value) : '';

	if (typeof value === 'number') {
		if (unit instanceof LengthUnit) {
			props.context.node.input(new Length(value, unit));
		}

		if (unit instanceof VolumeUnit) {
			props.context.node.input(new Volume(value, unit));
		}
	} else {
		props.context.node.input('');
	}
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
		<div class="govuk-input__wrapper">
			<input
				:id="id"
				:class="`govuk-input govuk-input--width-5 ${props.context.state.invalid ? 'govuk-input--error' : ''}`"
				:name="name"
				:value="mounted ? props.context._value && props.context._value.amount : ''"
				:data-testId="id"
				:aria-describedby="props.context.state.invalid ? `${id}_error` : help ? `${id}_hint` : ''"
				@input="handleTyping"
				@change="handleInput"
			>
			<div class="govuk-input__suffix" aria-hidden="true">{{unit.suffix}}</div>
		</div>
	</div>
</template>
