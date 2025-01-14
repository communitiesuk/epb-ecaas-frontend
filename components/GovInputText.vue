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

	function handleInput(e) {
		props.context.node.input(e.target.value);
	}
</script>

<template>
	<div :class="`govuk-form-group ${props.context.state.invalid &&
			props.context.messages.rule_required &&
			props.context.messages.rule_required.visible
			? 'govuk-form-group--error'
			: ''
		}`">
		<h1 class="govuk-label-wrapper">
			<label class="govuk-label govuk-label--m" :for="id">
				{{ label }}
			</label>
		</h1>
		<div :id="`${id}_hint`" class="govuk-hint">
			{{ help }}
		</div>
		<p v-if="props.context.state.invalid" class="govuk-error-message" :data-testid="`${id}_error`">
			<span class="govuk-visually-hidden">Error:</span> {{ props.context.messages.rule_required?.value }}
		</p>
		<input
			:class="`govuk-input govuk-input--width-10 ${props.context.state.invalid ? 'govuk-input--error' : ''}`"
			:id="id"
			:name="name"
			type="text"
			:value="props.context._value"
			:aria-describedby="props.context.state.invalid ? `${id}_error` : help ? `${id}_hint` : ''"
			@input="handleInput"
      :data-testid="id"
		/>
	</div>
</template>
