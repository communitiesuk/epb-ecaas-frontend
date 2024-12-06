<script setup lang="ts">
	import pagesData, { type Page } from "~/data/pages";

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

<style scoped>
	.accordion-nav {
		width: 100%;
		max-width: 250px;
		float: right;
	}

	.accordion-nav-heading {
		display: flex;
		width: 100%;
		justify-content: space-between;
		background: transparent;
		border: none;
	}

	.accordion-nav-list {
		list-style-type: none;
		margin-top: 20px;
		border-left-width: 1.5px;
	}

	.accordion-nav-link {
		margin-bottom: 14px;
	}
</style>

<template>
	<nav class="accordion-nav">
		<div v-for="(parentPage, index) in parentPages" :key="parentPage.id" class="app-subnav__section govuk-list">
			<button class="govuk-accordion__section-toggle accordion-nav-heading" @click="toggle(index)">
				<span class="govuk-accordion__section-toggle-text govuk-!-font-size-16 govuk-!-font-weight-bold">{{ parentPage.title }}</span>
				<span v-if="isOpen(index)" class="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--up"></span>
				<span v-else class="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--down"></span>
			</button>
			<ul v-if="isOpen(index)" class="govuk-inset-text accordion-nav-list">
				<template v-for="page in pagesData" >
					<li v-if="page.parentId === parentPage.id">
						<NuxtLink class="govuk-link govuk-body-s accordion-nav-link" @click.stop :to="page.url">
							{{ page.title }}
						</NuxtLink>
					</li>
				</template>
			</ul>
		</div>
	</nav>
</template>
