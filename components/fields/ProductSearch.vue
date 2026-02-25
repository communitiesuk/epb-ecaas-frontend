<script setup lang="ts">
const { name } = defineProps<{
	id: string;
	name: string;
	label: string;
	placeholder: string;
	value: string | undefined;
}>();

const isFocussed = ref(false);

const handleBlur = () => {
	setTimeout(() => isFocussed.value = false, 200);
};

const handleFocus = () => isFocussed.value = true;
</script>

<template>
	<div class="search-field">
		<label class="govuk-body search-label" :for="name">
			{{ label }}
		</label>
		<FormKit
			:id="id"
			type="text"
			:name="name"
			:classes="{ input: 'govuk-input govuk-input--width-20' }"
			:placeholder="placeholder"
			@blur="handleBlur"
			@focus="handleFocus"
		/>
	</div>
	
</template>

<style lang="scss" scoped>
	.search-field {
		flex: 1;
		position: relative;
	}

	.search-label {
		margin-bottom: 5px;
		display: block;
	}
</style>