<script setup lang="ts">

import type { RadioOption } from "../form-kit/Radios.vue";

interface RadiosProps {
	id: string;
	name: string;
	label: string;
	help?: string;
	options: Map<string, string | RadioOption>;
	showErrorState: () => boolean;
	invalid: boolean;
	showErrorMessage: () => string | undefined;
	ariaDescribedBy?: string;
	handleInput: (e: Event) => void;
	currentValue: string | undefined;
}

const {
	id,
	showErrorState,
	showErrorMessage,
	help = undefined,
	ariaDescribedBy = undefined,
} = defineProps<RadiosProps>();

const { mounted } = useMounted();

const idWithKey = (key: string) => `${id}_${key.replaceAll(/ /g, "_")}`;

</script>

<template>
	<div :class="`govuk-form-group ${showErrorState() ? 'govuk-form-group--error' : ''}`">
		<fieldset
			:id="id"
			class="govuk-fieldset"
			:aria-describedby="ariaDescribedBy"
		>
			<legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
				{{ label }}
			</legend>
			<div v-if="help" :id="`${id}_hint`" class="govuk-hint">
				{{ help }}
			</div>
			<slot />
			<p v-if="invalid" class="govuk-error-message" :data-testid="`${id}_error`">
				<span class="govuk-visually-hidden">Error:</span> {{ showErrorMessage() }}
			</p>
			<div class="govuk-radios govuk-radios--small" data-module="govuk-radios">
				<div v-for="key in options.keys()" :key="key" class="govuk-radios__item">
					<input
						:id="idWithKey(key)"
						class="govuk-radios__input"
						type="radio"
						:name="name"
						:value="key"
						:checked="mounted ? currentValue == key : false"
						:data-testid="idWithKey(key)"
						:aria-describedby="typeof options.get(key) === 'object' ? `${idWithKey(key)}_hint` : ''"
						@change="handleInput"
					>
					<label class="govuk-label govuk-radios__label" :for="idWithKey(key)">
						{{ typeof options.get(key) === 'object' ? (options.get(key) as RadioOption).label : options.get(key) }}
					</label>
					<div v-if="(typeof options.get(key) === 'object')" :id="`${idWithKey(key)}_hint`" class="govuk-hint govuk-radios__hint">
						{{ (options.get(key)as RadioOption).hint }}
					</div>
				</div>
			</div>
		</fieldset>
	</div>
</template>

<style lang="scss">
	.gov-radios-add-link {
		color: #1d70b8;
		font-size: 1.1875rem;
		line-height: 1.3157894737;
		font-weight: bold;
	}
</style>