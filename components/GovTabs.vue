<script setup lang="ts">
export interface TabItem {
	id: string;
	label: string;
};

defineProps<{
	items: TabItem[]
}>();

const currentTab = ref(0);

function selectTab(index: number, e: MouseEvent) {
	e.preventDefault();
	currentTab.value = index;
}
</script>

<template>
	<div class="govuk-tabs" data-module="govuk-tabs">
		<div class="govuk-tabs__list-container">
			<ul class="govuk-tabs__list">
				<li
					v-for="(item, index) in items"
					:key="item.id"
					class="govuk-tabs__list-item"
					:class="{ 'govuk-tabs__list-item--selected': currentTab === index }"
				>
					<a class="govuk-tabs__tab" :href="`#${item.id}`" @click="selectTab(index, $event)">
						{{ item.label }}
					</a>
				</li>
			</ul>
		</div>

		<slot :current-tab="currentTab" :current-item="items[currentTab]" />
	</div>
</template>

<style scoped lang="scss">
	.govuk-tabs__list-container {
		overflow-x: auto;
		padding-top: 5px;
	}

	.govuk-tabs__list {
		min-width: max-content;
	}
</style>