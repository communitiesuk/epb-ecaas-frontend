<script setup lang="ts">
const props = defineProps({
	context: {
		type: Object,
		default() {
			return {};
		},
	},
});

const {
	id,
	node: { name },
	label,
	help,
	attrs: { options },
} = props.context;

const { mounted } = useMounted();

const optionsSelectedValues = props.context.value ? JSON.parse(props.context.value) : [];
const optionsSelected = ref<string[]>(optionsSelectedValues);

const handleChange = (value: string) => {
	const index = optionsSelected.value.indexOf(value);

	if (index >= 0) {
		optionsSelected.value.splice(index, 1);
	} else {
		optionsSelected.value.push(value);
	}

	props.context.node.input(optionsSelected.value.length > 0 ? optionsSelected.value : undefined);
};
</script>

<template>
	<div :class="`govuk-form-group ${showErrorState(props.context) ? 'govuk-form-group--error' : ''}`">
		<div class="govuk-form-group">
			<fieldset class="govuk-fieldset">
				<legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
					<h1 class="govuk-fieldset__heading">
						{{ label }}
					</h1>
				</legend>
				<div v-if="help" :id="`${id}_hint`" class="govuk-hint">
					{{ help }}
				</div>
				<p v-if="props.context.state.invalid" class="govuk-error-message" :data-testid="`${id}_error`">
					<span class="govuk-visually-hidden">Error:</span>
					{{ getErrorMessage(props.context) }}
				</p>
				<div class="govuk-checkboxes" data-module="govuk-checkboxes">
					<div v-for="(option, index) in options" :key="option" class="govuk-checkboxes__item">
						<input
							:id="`${id}_${index}`"
							class="govuk-checkboxes__input"
							:name="name"
							type="checkbox"
							:value="option"
							:checked="mounted ? optionsSelected.includes(option) : false"
							@change="handleChange(option)"
						>
						<label class="govuk-label govuk-checkboxes__label" :for="`${id}_${index}`">{{ option }}</label>
					</div>
				</div>
			</fieldset>
		</div>
	</div>
</template>
