<script setup>
    const props = defineProps({
        context: Object
    });

    const { attrs: { options }, node: { name }, label } = props.context;

    function handleInput(e) {
        props.context.node.input(e.target.value);
    }
</script>

<template>
    <gv-radios
        @input="handleInput"
        v-model="props.context._value"
        :legend="label"
        size="small"
        legendClass="govuk-fieldset__legend--m"
        :formGroupClass="`govuk-form-group ${props.context.state.invalid && props.context.messages.rule_required && props.context.messages.rule_required.visible ? 'govuk-form-group--error' : ''}`"
    >
        <p v-if="props.context.state.invalid" class="govuk-error-message">{{ props.context.messages.rule_required.value }}</p>
        <gv-radio
            v-for="key in Object.keys(options)"
            :id="`${name}_${key}`"
            :name="`${name}_${key}`"
            :value="key"
        >
            {{ options[key] }}
        </gv-radio>
    </gv-radios>
</template>