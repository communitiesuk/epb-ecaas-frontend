<script setup>
	import { useMounted } from '~/composables/mounted';

	const { mounted } = useMounted();

	const props = defineProps({
		context: Object,
	});

	function handleInput(e) {
		props.context.node.input(e.target.value);
	}

	const {
		node: { name },
		label,
	} = props.context;
</script>
<template>
	<div :class="`govuk-form-group ${props.context.state.invalid &&
			props.context.messages.rule_required &&
			props.context.messages.rule_required.visible
			? 'govuk-form-group--error'
			: ''
		}`">
		<label class="govuk-label govuk-label--m" :for="name">
			{{ label }}
		</label>
		<p v-if="props.context.state.invalid" class="govuk-error-message">
			{{ props.context.messages.rule_required?.value }}
		</p>
		<div class="govuk-input__wrapper">
			<input
				@input="handleInput"
				class="govuk-input govuk-input--width-5"
				:id="name"
				:name="name"
				type="number"
				:value="mounted ? props.context._value : ''"
			/>
		</div>
	</div>
</template>
