<script setup>
	const props = defineProps({
		context: Object
	});

	const {
		id,
		node: { name },
		label,
		help
	} = props.context;

	const { mounted } = useMounted();

	function handleInput(e) {
		const value = e.target.value ? parseInt(e.target.value) : '';
		props.context.node.input(value);
	}
</script>
<template>
	<div :class="`govuk-form-group ${props.context.state.invalid &&
			props.context.messages.rule_required &&
			props.context.messages.rule_required.visible
			? 'govuk-form-group--error'
			: ''
		}`">
		<label class="govuk-label govuk-label--m" :for="id">
			{{ label }}
		</label>
		<div :id="`${id}_hint`" class="govuk-hint" v-if="help">
			{{ help }}
		</div>
		<p v-if="props.context.state.invalid" class="govuk-error-message" :data-testid="`${id}_error`">
			<span class="govuk-visually-hidden">Error:</span> {{ props.context.messages.rule_required?.value }}
		</p>
		<div class="govuk-input__wrapper">
			<input
				@input="handleInput"
				:class="`govuk-input govuk-input--width-5 ${props.context.state.invalid ? 'govuk-input--error' : ''}`"
				:id="id"
				:name="name"
				type="number"
				:value="mounted ? props.context._value : ''"
				:data-testid="id"
				:aria-describedby="props.context.state.invalid ? `${id}_error` : help ? `${id}_hint` : ''"
			/>
		</div>
	</div>
</template>
