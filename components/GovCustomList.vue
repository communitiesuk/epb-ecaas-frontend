<script setup lang="ts">
const props = defineProps<{
	id: string;
	title: string;
	formUrl: string;
	items?: string[];
	onRemove?: (index: number) => void;
	onDuplicate?: (index: number) => void;
}>();

function handleRemove(index: number, e: MouseEvent) {
	e.preventDefault();
	props.onRemove?.(index);
}

function handleDuplicate(index: number, e: MouseEvent) {
	e.preventDefault();
	props.onDuplicate?.(index);
}
</script>

<template>
	<ClientOnly>
		<div class="custom-list">
			<div class="custom-list__header">
				<h2 class="govuk-heading-m govuk-!-margin-0">{{ title }}</h2>
				<NuxtLink class="govuk-link" :href="`${formUrl}/create`">{{ items && items.length > 0 ? "Add more" : "Add" }}</NuxtLink>
			</div>
			<div v-if="items && items.length" class="custom-list__body" :data-testid="`${id}_items`">
				<table class="govuk-table govuk-!-margin-0 custom-list__table">
					<tbody class="govuk-table__body">
						<tr v-for="(item, index) in items" :key="index" class="govuk-table__row" :data-testid="`${id}_item`">
							<th scope="row" class="govuk-table__header custom-list__table-header">{{ item }}</th>
							<td class="govuk-table__cell govuk-!-text-align-right">
								<NuxtLink class="govuk-link custom-list__action-link" :href="`${formUrl}/${index}`">Edit</NuxtLink>
								<a v-if="onDuplicate" href="#" class="govuk-link custom-list__action-link" :data-testid="`${id}_duplicate_${index}`" @click="handleDuplicate(index, $event)">Duplicate</a>
								<a href="#" class="govuk-link custom-list__action-link" :data-testid="`${id}_remove_${index}`" @click="handleRemove(index, $event)">Remove</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</ClientOnly>
</template>

<style scoped lang="scss">
	@use "sass:map";
	
	.custom-list {
		border: 1px solid map.get($govuk-colours, "mid-grey");
		margin-bottom: 30px;
	}

	.custom-list__header {
		padding: 15px 20px;
		background: #f3f2f1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.custom-list__body {
		padding: 15px 20px;
	}

	.custom-list__action-link {
		margin-left: 25px;
	}
	.custom-list__table-header {
		overflow-wrap: anywhere;
	}
</style>