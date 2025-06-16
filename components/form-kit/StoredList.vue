<script setup lang="ts">
import type { FormKitFrameworkContext } from '@formkit/core';
import formatData from '~/utils/format-data';

export type StoredListOption = {
	id: string;
	name: string;
};

const props = defineProps<{
	context: FormKitFrameworkContext
}>();

const {
	id,
	label,
	help,
	attrs: { link, options }
} = props.context;

</script>

<template>
	<div class="custom-list__padding-bottom">
		<label class="govuk-label govuk-label--m">
			{{ label }}
		</label>
		<div v-if="help" :id="`${id}_hint`" class="govuk-hint">{{ help }}</div>
		<div>
			<ul v-if="options.length > 0" class="govuk-list">
				<li v-for="item in options" :key="item.id" class="govuk-list__item">
					{{ item.label }}
				</li>
			</ul>
			<div v-else>
				<p class="govuk-body govuk-error-message">No {{ formatData(id, "",false) }} has been added.</p>
				<NuxtLink class="govuk-link custom-add-list-item__link" :to="link">
					Click here to add a {{ formatData(id,"",  false) }}
				</NuxtLink>
			</div>
		</div>
	</div>	
</template>

<style scoped lang="scss">
@use "sass:map";

.custom-add-list-item__link {
	color: #1d70b8;
	font-size: 1.1875rem;
	line-height: 1.3157894737;
	font-weight: bold;
}
.custom-list__padding-bottom {
padding-bottom:1.5em

}
</style>