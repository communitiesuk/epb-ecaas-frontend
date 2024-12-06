<script setup lang="ts">
import pagesData, { type Page } from "~/data/pages";
import { ref } from "vue";

const parentPages: Array<Page> = pagesData.filter(
	(page) => page.parentId === "overview"
);

const openStates = ref(Array(parentPages.length).fill(true));

function toggle(index: number) {
	openStates.value[index] = !openStates.value[index];
}

function isOpen(index: number) {
	return openStates.value[index];
}
</script>

<template>
	<div v-for="(parentPage, index) in parentPages" :key="parentPage.id" class="app-subnav__section govuk-list">
		<div @click="toggle(index)">
			<span class="govuk-accordion__section-toggle" data-nosnippet="">
				<span class="govuk-accordion__section-toggle-text govuk-!-font-size-16 govuk-!-font-weight-bold">
					{{ parentPage.title }}
				</span>
				<span v-if="isOpen(index)">
					<span class="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--up" style="float: right"></span>
				
					<div class="govuk-inset-text"   style="border-left-width: 1.5px"	>
						<div v-for="page in pagesData">
							<span v-if="page.parentId === parentPage.id" class="govuk-body-s">
								<div style="margin-bottom: 14px" >
								<NuxtLink  class="govuk-link" @click.stop :to="page.url">{{
									page.title
								}}</NuxtLink>
								</div>
							</span>
						</div>
					</div>
				</span>
				<span v-else class="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--down"
					style="float: right"></span>
			</span>
		</div>
	</div>
</template>
