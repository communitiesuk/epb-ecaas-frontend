<script setup lang="ts">
	import pagesData, { type Page } from '../data/pages';

	const getBreadcrumbs = (id: string | undefined, breadcrumbs: Array<Page>): Array<Page> => {
		const currentPage = pagesData.find(page => page.id === id);

		if (!currentPage) {
			return breadcrumbs;
		}

		breadcrumbs.unshift(currentPage);
		return getBreadcrumbs(currentPage.parentId, breadcrumbs);
	};

	const pages = computed(() => {
		const route = useRoute();
		const currentPage = pagesData.find(page => page.url === route.path);

		return currentPage ? getBreadcrumbs(currentPage.id, []) : [];
	});
</script>

<template>
	<nav class="govuk-breadcrumbs govuk-!-margin-top-0 govuk-!-margin-bottom-7" aria-label="Breadcrumb" v-if="pages.length > 1">
		<ol class="govuk-breadcrumbs__list">
			<li v-for="(page, index) in pages" :key="page.id" class="govuk-breadcrumbs__list-item">
				<NuxtLink v-if="index !== pages.length - 1" class="govuk-breadcrumbs__link" :to="page.url">
					{{ page.title }}
				</NuxtLink>
				<span v-else>{{ page.title }}</span>
			</li>
		</ol>
	</nav>
</template>