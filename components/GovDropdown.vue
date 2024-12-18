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
		attrs: { options },
		label,
		help
	} = props.context;

	const { mounted } = useMounted();

	function handleInput(e) {
		props.context.node.input(e.target.value);
	}
</script>

<template>
	<div
:class="`govuk-form-group ${props.context.state.invalid &&
		props.context.messages.rule_required &&
		props.context.messages.rule_required.visible
		? 'govuk-form-group--error' : '' }`"
	>
		<label class="govuk-label govuk-label--m" :for="id">
			{{ label }}
		</label>
		<div v-if="help" :id="`${id}_hint`" class="govuk-hint">
			{{ help }}
		</div>
		<p v-if="props.context.state.invalid" class="govuk-error-message" :data-testid="`${id}_error`">
			<span class="govuk-visually-hidden">Error:</span> {{ props.context.messages.rule_required.value }}
		</p>
		<select
			:id="id"
			:class="`govuk-select ${props.context.state.invalid ? 'govuk-select--error' : ''}`"
			:name="name"
			:value="mounted ? props.context._value : ''"
			:data-testid="id"
			:aria-describedby="props.context.state.invalid ? `${id}_error` : help ? `${id}_hint` : ''"
			@input="handleInput"
		>
			<option value="">Select</option>
			<option v-for="key in Object.keys(options)" :key="key" :value="key">
				{{ options[key] }}
			</option>
		</select>
	</div>
</template>
