<script setup>
	const props = defineProps({
		context: Object
	});

	const { attrs: { options }, node: { name }, label, help} = props.context;

	function handleInput(e) {
		props.context.node.input(e.target.value);
	}
</script>

<template>
	<div :class="`govuk-form-group ${props.context.state.invalid ? 'govuk-form-group--error' : ''}`">
		<fieldset class="govuk-fieldset">
			<legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
				{{ label }}
			</legend>
						<div id="event-name-hint" class="govuk-hint">
			{{ help }}
				</div>
			<p v-if="props.context.state.invalid" class="govuk-error-message">
				<span class="govuk-visually-hidden">Error:</span> {{ props.context.messages.rule_required.value }}
			</p>
			<div class="govuk-radios govuk-radios--small" data-module="govuk-radios">
				<div class="govuk-radios__item" v-for="key in Object.keys(options)">
					<input
						class="govuk-radios__input"
						type="radio"
						checked="checked"
						:id="`${name}_${key}`"
						:name="name"
						:value="key"
						:checked="props.context._value == key"
						@change="handleInput"
					/>
					<label class="govuk-label govuk-radios__label" :for="`${name}_${key}`">
						{{ options[key] }}
					</label>
				</div>
			</div>
		</fieldset>
	</div>
</template>