<script setup lang="ts">
import type { GovTagProps } from "~/common.types";

interface CustomListItem {
	name: string;
	status?: GovTagProps;
}

const props = defineProps<{
	id: string;
	title: string;
	formUrl: string;
	hint?: string;
	items?: string[] | CustomListItem[];
	maxNumberOfItems?: number;
	onRemove?: (index: number) => void;
	onDuplicate?: (index: number) => void;
	showStatus?: boolean;
}>();

function handleRemove(index: number, e: MouseEvent) {
	e.preventDefault();
	props.onRemove?.(index);
}

function handleDuplicate(index: number, e: MouseEvent) {
	e.preventDefault();
	props.onDuplicate?.(index);
}

function canAddMoreItems() {
	return !props.maxNumberOfItems || !props.items || props.items?.length < props.maxNumberOfItems;
}

function routeForAddItem() {
	return props.maxNumberOfItems === 1 ? props.formUrl : `${props.formUrl}/create`;
}

function routeForEditItem(index: number) {
	return props.maxNumberOfItems === 1 ? props.formUrl : `${props.formUrl}/${index}`;

}

</script>

<template>
	<ClientOnly>
		<div class="govuk-summary-card">
			<div class="govuk-summary-card__title-wrapper">
				<div>
					<h2 class="govuk-summary-card__title">
						{{ title }}
					</h2>
					<p v-if="hint" class="govuk-hint govuk-!-margin-0 custom-summary-card__hint">{{ hint }}</p>
				</div>
				<ul class="govuk-summary-card__actions">
					<li class="govuk-summary-card__action">
						<NuxtLink
							v-if="canAddMoreItems()" class="govuk-link" :data-testid="`${id}_add`"
							:href=routeForAddItem()>{{ items && items.length > 0 ? "Add more" : "Add" }}</NuxtLink>
					</li>
				</ul>
			</div>
			<div v-if="items && items.length" class="govuk-summary-card__content" :data-testid="`${id}_items`">
				<dl class="govuk-summary-list">
					<div
						v-for="(item, index) in items" :key="index" class="govuk-summary-list__row"
						:data-testid="`${id}_item`">
						<dt class="govuk-summary-list__key">
							{{ typeof item === 'string' ? item : item.name }}
						</dt>
						<dd class="govuk-summary-list__value">
							<div v-if="showStatus">
								<GovTag v-if="(typeof item) !== 'string' && item.status" :text="item.status.text" :color="item.status.color" :test-id="`${id}_status_${index}`" />
							</div>
						</dd>
						<dd class="govuk-summary-list__actions">
							<ul class="govuk-summary-list__actions-list">
								<li class="govuk-summary-list__actions-list-item">
									<NuxtLink class="govuk-link" :href=routeForEditItem(index)>Edit</NuxtLink>
								</li>
								<li
									v-if="onDuplicate && canAddMoreItems()"
									class="govuk-summary-list__actions-list-item">
									<a
										href="#" class="govuk-link" :data-testid="`${id}_duplicate_${index}`"
										@click="handleDuplicate(index, $event)">Duplicate</a>
								</li>
								<li class="govuk-summary-list__actions-list-item">
									<a
										href="#" class="govuk-link" :data-testid="`${id}_remove_${index}`"
										@click="handleRemove(index, $event)">Remove</a>
								</li>
							</ul>
						</dd>
					</div>
				</dl>
			</div>
		</div>
	</ClientOnly>
</template>

<style scoped lang="scss">
@use "sass:map";

.govuk-summary-list__value {
	width: 20%;
	white-space: nowrap;
}

.govuk-summary-list__actions {
	width: auto;
	margin-right: 25px;
}

.custom-summary-card__hint {
	font-size: 1rem;
}
</style>
