<script setup lang="ts">
import pagesData from "~/data/pages/pages";
import type { Page } from "~/data/pages/pages.types";

const parentPages: Array<Page> = pagesData.filter(
	(page) => page.type === "section",
);

const openStates = ref(Array(parentPages.length).fill(true));

const hasMounted = ref(false);
onMounted(() => {
	hasMounted.value = true;
});

function toggle(index: number) {
	openStates.value[index] = !openStates.value[index];
}

function isOpen(index: number) {
	return openStates.value[index];
}

function getUrl(url: string) {
	const store = useEcaasStore();
	
	if (url !== "/domestic-hot-water/heat-sources/create") return url;
	if (!hasMounted.value) return url;

	if (store.domesticHotWater.heatSources.data.length >= 1) {
		return "/domestic-hot-water/heat-sources/0";
	} else return url;
}

function shouldShowPage(page: Page, parentPageId: string) {
	if (page.parentId !== parentPageId || page.url.includes(":")) {
		return false;
	}

	if (page.excludeFromNavigation && !hasMounted.value) {
		return false;
	}

	return !page.excludeFromNavigation?.();
}


</script>

<template>
	<nav class="accordion-nav">
		<div v-for="(parentPage, index) in parentPages" :key="parentPage.id">
			<button class="govuk-accordion__section-button" @click="toggle(index)">
				<span class="govuk-accordion__section-heading-text govuk-!-font-size-16">
					<span class="govuk-accordion__section-heading-text-focus">
						{{ parentPage.title }}
					</span>
				</span>
				<span class="govuk-accordion__section-toggle">
					<span v-if="isOpen(index)" class="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--up"/>
					<span v-else class="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--down"/>
				</span>
			</button>
			<ul v-if="isOpen(index)" class="govuk-inset-text">
				<template v-for="page in pagesData" :key="page.id">
					<li v-if="shouldShowPage(page, parentPage.id)">
						<NuxtLink class="govuk-link govuk-body-s" :to="getUrl(page.url)" @click.stop>
							{{ page.title  }}
						</NuxtLink>
					</li>
				</template>
			</ul>
		</div>
	</nav>
</template>

<style scoped lang="scss">
	@use "sass:map";

	.accordion-nav {
		width: 100%;

		@media (min-width: map.get($govuk-breakpoints, "tablet")) {
			max-width: 250px;
			float: right;
		}
	}

	.govuk-accordion__section-button {
		display: flex;
		width: 100%;
		justify-content: space-between;
		background: transparent;
		border: none;
		margin-bottom: 0;
	}

	.govuk-accordion__section-heading-text {
		margin: 0;
		color: govuk-colour("blue");
	}

	.govuk-accordion__section-toggle {
		margin: 0;
		font-size: 0rem;
	}

	.govuk-inset-text {
		list-style-type: none;
		margin: 10px 0;
		border-left-width: 1px;
	}
</style>
