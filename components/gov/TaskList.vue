<script setup lang="ts">
import type { GovTagProps } from '~/common.types';

interface GovTaskListItemStatus {
	tag: GovTagProps;
}

export interface GovTaskListItemProps {
	id: string;
	title: string;
	status: GovTaskListItemStatus;
	url?: string;
}

defineProps<{
	items: Array<GovTaskListItemProps>
}>();
</script>

<template>
	<ul class="govuk-task-list">
		<li v-for="item in items" :key="item.id" class="govuk-task-list__item govuk-task-list__item--with-link">
			<div class="govuk-task-list__name-and-hint">
				<NuxtLink :to="item.url" class="govuk-link govuk-task-list__link" :aria-describedby="item.id">
					{{ item.title }}
				</NuxtLink>
			</div>
			<div :id="`${item.id}-status`" class="govuk-task-list__status">
				<ClientOnly>
					<GovTag :text="item.status.tag.text" :color="item.status.tag.color" />
				</ClientOnly>
			</div>
		</li>
	</ul>
</template>

<style scoped lang="scss">
	.govuk-task-list {
		margin-bottom: 0;
	}

	.govuk-task-list__item:first-child {
		border-top: none;
	}
</style>