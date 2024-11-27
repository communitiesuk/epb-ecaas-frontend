<script setup>
	import { useMounted } from '~/composables/mounted';
	
	const { mounted } = useMounted();

	const props = defineProps({
		context: Object,
	});

	const {
		attrs: { options },
		node: { name },
		label, help
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
		<label class="govuk-label govuk-label--m" :for="name">
			{{ label }}
		</label>
		<div id="event-name-hint" class="govuk-hint">
			{{ help }}
		</div>
		<p v-if="props.context.state.invalid" class="govuk-error-message">
			{{ props.context.messages.rule_required.value }}
		</p>
		<select
			class="govuk-select"
			:id="name"
			:name="name"
			@input="handleInput"
			:value="mounted ? props.context._value : ''"
		>
			<option v-for="key in Object.keys(options)" :id="`${name}_${key}`" :name="`${name}_${key}`" :value="key">
				{{ options[key] }}
			</option>
		</select>
	</div>
</template>
