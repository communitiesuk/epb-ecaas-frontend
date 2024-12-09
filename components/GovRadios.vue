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
	<div :class="`govuk-form-group ${props.context.state.invalid ? 'govuk-form-group--error' : ''}`">
		<fieldset
			:id="id"
			class="govuk-fieldset"
			:aria-describedby="props.context.state.invalid ? `${id}_error` : help ? `${id}_hint` : ''"
		>
			<legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
				{{ label }}
			</legend>
			<div :id="`${id}_hint`" class="govuk-hint" v-if="help">
				{{ help }}
			</div>
			<p v-if="props.context.state.invalid" class="govuk-error-message" :data-testid="`${id}_error`">
				<span class="govuk-visually-hidden">Error:</span> {{ props.context.messages.rule_required.value }}
			</p>
			<div class="govuk-radios govuk-radios--small" data-module="govuk-radios">
				<div class="govuk-radios__item" v-for="key in Object.keys(options)">
					<input
						class="govuk-radios__input"
						type="radio"
						:id="`${id}_${key}`"
						:name="name"
						:value="key"
						:checked="mounted ? props.context._value == key : false"
						@change="handleInput"
						:data-testid="`${id}_${key}`"
						:aria-describedby="typeof options[key] === 'object' ? `${id}_${key}_hint` : ''"
					/>
					<label class="govuk-label govuk-radios__label" :for="`${id}_${key}`">
						{{ typeof options[key] === 'object' ? options[key].label : options[key] }}
					</label>
					<div :id="`${id}_${key}_hint`" class="govuk-hint govuk-radios__hint" v-if="(typeof options[key] === 'object')">
						{{ options[key].hint }}
					</div>
				</div>
			</div>
		</fieldset>
	</div>
</template>