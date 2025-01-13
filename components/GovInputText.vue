<script setup>
	const props = defineProps({
		context: {
			type: Object,
			default() {
				return {};
			}
		}
	});

	const {
		id,
		node: { name },
		label,
		help
	} = props.context;

	function handleInput(e) {
		props.context.node.input(e.target.value);
	}
</script>

<template>
	<div class="govuk-form-group">
		<h1 class="govuk-label-wrapper">
			<label class="govuk-label govuk-label--m" :for="id">
				{{ label }}
			</label>
		</h1>
		<div :id="`${id}_hint`" class="govuk-hint">
			{{ help }}
		</div>
		<input
			class="govuk-input govuk-input--width-10"
			:id="id"
			:name="name"
			type="text"
			:value="props.context._value"
			@input="handleInput"
		/>
	</div>
</template>
