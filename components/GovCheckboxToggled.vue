<script setup lang="ts">
import { ref } from 'vue';

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
	attrs: { options },
} = props.context;

const { mounted } = useMounted()

const optionSelected = ref<string | null>(props.context.value || null);

const handleChange = (value: string) => {

	if (optionSelected.value === value) {
		optionSelected.value = null;
	} else {
		optionSelected.value = value;
	}
	props.context.node.input(optionSelected.value);
};

</script>

<template>
  <div
    :class="`govuk-form-group ${
      props.context.state.invalid &&
      props.context.messages.rule_required &&
      props.context.messages.rule_required.visible
        ? 'govuk-form-group--error'
        : ''
    }`"
  >
    <div class="govuk-form-group">
      <fieldset class="govuk-fieldset">
        <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
          <h1 class="govuk-fieldset__heading">
            {{ label }}
          </h1>
        </legend>
        <p
          v-if="props.context.state.invalid"
          class="govuk-error-message"
          :data-testid="`${id}_error`"
        >
          <span class="govuk-visually-hidden">Error:</span>
          {{ props.context.messages.rule_required.value }}
        </p>
        <div class="govuk-checkboxes" data-module="govuk-checkboxes">
          <div v-for="option of options" class="govuk-checkboxes__item" :key="option">
            <input
              class="govuk-checkboxes__input"
              :id="id"
              :name="name"
              type="checkbox"
              :value="option"
              :checked="mounted ? optionSelected === option: false"
              @change="handleChange(option)"
            />
            <label class="govuk-label govuk-checkboxes__label" :for="id">{{ option }}</label>
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</template>
