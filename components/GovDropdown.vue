<script setup>
	const props = defineProps({
		context: Object
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
	<div :class="`govuk-form-group ${props.context.state.invalid &&
		props.context.messages.rule_required &&
		props.context.messages.rule_required.visible
		? 'govuk-form-group--error' : '' }`"
	>
		<label class="govuk-label govuk-label--m" :for="id">
			{{ label }}
		</label>
		<div :id="`${id}_hint`" class="govuk-hint" v-if="help">
			{{ help }}
		</div>
		<p v-if="props.context.state.invalid" class="govuk-error-message" :data-testid="`${id}_error`">
			<span class="govuk-visually-hidden">Error:</span> {{ props.context.messages.rule_required.value }}
		</p>
		<select
			:class="`govuk-select ${props.context.state.invalid ? 'govuk-select--error' : ''}`"
			:id="id"
			:name="name"
			@input="handleInput"
			:value="mounted ? props.context._value : ''"
			:data-testid="id"
			:aria-describedby="props.context.state.invalid ? `${id}_error` : help ? `${id}_hint` : ''"
		>
			<option v-for="key in Object.keys(options)" :value="key">
				{{ options[key] }}
			</option>
		</select>
	</div>
</template>
