<script setup lang="ts">
	import { hyphenate } from '#imports';

	const { name, onSelect } = defineProps<{
		id: string;
		name: string;
		label: string;
		placeholder: string;
		value: string | undefined;
		suggestedValues?: string[];
		onSelect?: (value: string) => void;
	}>();

	const isFocussed = ref(false);
	const maxSuggestedValues = 5;

	const handleBlur = () => {
		setTimeout(() => isFocussed.value = false, 200);
	};

	const handleFocus = () => isFocussed.value = true;

	const handleSelect = (value: string, e: MouseEvent) => {
		e.preventDefault();
		onSelect?.(value);
	};
</script>

<template>
	<div class="search-field">
		<label class="govuk-body search-label" :for="name">
			{{ label }}
		</label>
		<FormKit
			type="text"
			:id="id"
			:name="name"
			:classes="{ input: 'govuk-input govuk-input--width-20' }"
			:placeholder="placeholder"
			@blur="handleBlur"
			@focus="handleFocus"
		/>
		<div v-show="suggestedValues?.length && (value?.length || 0) > 2 && isFocussed" class="search-field-results">
			<ul>
				<li v-for="value in suggestedValues?.slice(0, maxSuggestedValues)" :key="hyphenate(value)">
					<a href="#" class="govuk-body" @click="handleSelect(value, $event)">
						{{ value }}
					</a>
				</li>
			</ul>
			<p v-if="(suggestedValues?.length || 0) > maxSuggestedValues" class="govuk-body-s govuk-!-margin-0">
				{{ suggestedValues!.length - maxSuggestedValues }} more results
			</p>
		</div>
	</div>
</template>

<style lang="scss">
	@use "sass:map";

	.search-field {
		flex: 1;
		position: relative;
	}

	.search-label {
		margin-bottom: 5px;
		display: block;
	}

	.search-field-results {
		background-color: white;
		width: 100%;
		padding: 10px;
		box-sizing: border-box;
		border: 1px solid map.get($govuk-colours, "mid-grey");

		ul {
			margin: 0;
			padding: 0;
			list-style-type: none;
		}

		li {
			padding-bottom: 15px;
			margin-bottom: 15px;
			border-bottom: 1px solid map.get($govuk-colours, "mid-grey");

			&:last-child {
				margin-bottom: 5px;
			}
		}

		a {
			text-decoration: none;
		}
	}
</style>