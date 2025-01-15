<script setup lang="ts">
	const props = defineProps<{
		title: string;
		formUrl: string;
		items?: string[];
		onRemove?: (index: number) => void;
	}>();

	function handleRemove(index: number, e: MouseEvent) {
		e.preventDefault();
		props.onRemove?.(index);
	}
</script>

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
		margin-right: 25px;
	}
</style>

<template>
	<div class="custom-list">
		<div class="custom-list__header">
			<h2 class="govuk-heading-m govuk-!-margin-0">{{ title }}</h2>
			<NuxtLink class="govuk-link" :href="`${formUrl}/create`">Add more</NuxtLink>
		</div>
		<div class="custom-list__body" v-if="items" data-testid="customListItems">
			<table class="govuk-table govuk-!-margin-0">
				<tbody class="govuk-table__body">
					<tr class="govuk-table__row" v-for="(item, index) in items">
						<th scope="row" class="govuk-table__header">{{ item }}</th>
						<td class="govuk-table__cell">
							<NuxtLink class="govuk-link custom-list__action-link" :href="`${formUrl}/${index}`">Edit</NuxtLink>
							<a href="#" class="govuk-link custom-list__action-link" @click="handleRemove(index, $event)" :data-testid="`customListItemRemove_${index}`">Remove</a>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>