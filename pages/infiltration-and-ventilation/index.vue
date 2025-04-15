<script setup lang="ts">
import type { GovTaskListItemProps } from '~/components/GovTaskList.vue';

const title = 'Infiltration and ventilation';
const page = usePage();
const store = useEcaasStore();



const { createTaskList } = useTaskList();
const taskList: GovTaskListItemProps[] = createTaskList(page);

</script>

<template>
	<Head>
		<Title>{{ title }}</Title>
	</Head>
	<h1 class="govuk-heading-l">{{ title }}</h1>
	<ul class="govuk-task-list">
		<template v-for="item in taskList" :key="item.id">
			<li
				v-if="item.id !== 'ductwork' || store.infiltrationAndVentilation.mechanicalVentilation.data.filter(x => x.typeOfMechanicalVentilationOptions === 'mvhr').length"
				class="govuk-task-list__item govuk-task-list__item--with-link">
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
		</template>
	</ul>
	<div class="govuk-button-group govuk-!-margin-top-6">
		<NuxtLink to="/" class="govuk-button">Return to task list</NuxtLink>
		<NuxtLink :to="`/summary`" class="govuk-button govuk-button--secondary">View summary</NuxtLink>
	</div>
</template>