<script setup>
	const props = defineProps({
		context: Object
	});

	const {
		id,
		node: { name },
		label
	} = props.context;

	const { mounted } = useMounted();

	function handleInput(e) {
		const value = e.target.value ? parseFloat(e.target.value) : '';
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
		<p v-if="props.context.state.invalid" class="govuk-error-message" :data-testid="`${id}_error`">
			{{ props.context.messages.rule_required?.value }}
		</p>
		<div class="govuk-input__wrapper">
			<input
				@input="handleInput"
				class="govuk-input govuk-input--width-5"
				:id="id"
				:name="name"
				type="number"
				:value="mounted ? props.context._value : ''"
				:data-testId="id"
			/>
			<div class="govuk-input__suffix" aria-hidden="true">m2</div>
		</div>
	</div>
</template>
