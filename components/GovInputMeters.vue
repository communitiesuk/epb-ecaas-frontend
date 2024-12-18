<script setup>
	const props = defineProps({
		context: {
			type: Object,
			default() {
				return {};
			}
		}
	});

	const {
		id,
		node: { name },
		label,
		help
	} = props.context;

	const { mounted } = useMounted();

	function handleInput(e) {
		const value = e.target.value ? parseFloat(e.target.value) : '';
		props.context.node.input(value);
	}
</script>
<template>
	<div
:class="`govuk-form-group ${props.context.state.invalid &&
		props.context.messages.rule_required &&
		props.context.messages.rule_required.visible
		? 'govuk-form-group--error'
		: ''}`"
	>
		<label class="govuk-label govuk-label--m" :for="id">
			{{ label }}
		</label>
		<div v-if="help" :id="`${id}_hint`" class="govuk-hint">
			{{ help }}
		</div>
		<p v-if="props.context.state.invalid" class="govuk-error-message" :data-testid="`${id}_error`">
			<span class="govuk-visually-hidden">Error:</span> {{ props.context.messages.rule_required?.value }}
		</p>
		<div class="govuk-input__wrapper">
			<input
				:id="id"
				:class="`govuk-input govuk-input--width-5 ${props.context.state.invalid ? 'govuk-input--error' : ''}`"
				:name="name"
				type="number"
				:value="mounted ? props.context._value : ''"
				:data-testId="id"
				:aria-describedby="props.context.state.invalid ? `${id}_error` : help ? `${id}_hint` : ''"
				@input="handleInput"
			>
			<div class="govuk-input__suffix" aria-hidden="true">m2</div>
		</div>
	</div>
</template>
