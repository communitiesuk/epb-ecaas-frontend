<script setup lang="ts">
import type { FormKitFrameworkContext } from "@formkit/core";
import { showErrorState, getErrorMessage } from "#imports";

const props = defineProps<{
	context: FormKitFrameworkContext
}>();

const {
	id,
	node: { name },
	label,
	help,
	attrs: { options },
} = props.context;

const exclusiveOptions = props.context.attrs["exclusive-options"];
const { mounted } = useMounted();

const optionsSelectedValues = props.context._value || [];
const optionsSelected = ref<string[]>([...optionsSelectedValues]);

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
				<legend v-if="label" class="govuk-fieldset__legend govuk-fieldset__legend--m">
					{{ label }}
				</legend>
				<div v-if="help" :id="`${id}_hint`" class="govuk-hint">
					{{ help }}
				</div>
				<p v-if="props.context.state.invalid" class="govuk-error-message" :data-testid="`${id}_error`">
					<span class="govuk-visually-hidden">Error:</span>
					{{ getErrorMessage(props.context) }}
				</p>
				<div class="govuk-checkboxes" data-module="govuk-checkboxes">
					<div v-for="key in Object.keys(options)" :key="key" class="govuk-checkboxes__item">
						<input
							:id="`${id}_${key}`"
							class="govuk-checkboxes__input"
							:name="name"
							type="checkbox"
							:value="key"
							:checked="mounted ? optionsSelected.includes(key) : false"
							:data-testid="`${id}_${key}`"
							v-bind="props.context.attrs"
							@change="handleChange(key)"
						>
						<label class="govuk-label govuk-checkboxes__label" :for="`${id}_${key}`">{{ options[key] }}</label>
					</div>
					<div class="govuk-checkboxes__divider">or</div>
					<div v-for="key in Object.keys(exclusiveOptions)" :key="key" class="govuk-checkboxes__item">
						<input
							:id="`${id}_${key}`"
							class="govuk-checkboxes__input"
							:name="name"
							type="checkbox"
							:value="key"
							:checked="mounted ? optionsSelected.includes(key) : false"
							:data-testid="`${id}_${key}`"
							v-bind="props.context.attrs"
							@change="handleChange(key)"
						>
						<label class="govuk-label govuk-checkboxes__label" :for="`${id}_${key}`">{{ exclusiveOptions[key] }}</label>
					</div>
				</div>
			</fieldset>
		</div>
	</div>
</template>
