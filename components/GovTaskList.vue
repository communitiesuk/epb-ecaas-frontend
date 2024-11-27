<script setup lang="ts">
	import type { GovTagProps } from '~/common.types';

	interface GovTaskListItemStatus {
		tag: GovTagProps;
	}

	interface GovTaskListItemProps {
		id: string;
		title: string;
		status: GovTaskListItemStatus;
		href?: string;
	}

	defineProps<{
		items: Array<GovTaskListItemProps>
	}>();
</script>

<template>
	<ul class="govuk-task-list">
		<li class="govuk-task-list__item govuk-task-list__item--with-link" v-for="item in items">
			<div class="govuk-task-list__name-and-hint">
				<NuxtLink :to="item.href" class="govuk-link govuk-task-list__link" :aria-describedby="item.id">
					{{ item.title }}
				</NuxtLink>
			</div>
			<div class="govuk-task-list__status" :id="`${item.id}-status`">
				<ClientOnly>
					<GovTag :text="item.status.tag.text" :color="item.status.tag.color" />
				</ClientOnly>
			</div>
		</li>
	</ul>
</template>