<script setup lang="ts">
import pagesData from "~/data/pages/pages";
import type { Page } from "~/data/pages/pages.types";

const parentPages: Array<Page> = pagesData.filter(
	(page) => page.type === "section",
);

const summaryOnlySections = [
	"spaceHeating",
	"domesticHotWater",
	"pvAndBatteries",
	"cooling",
];

const { mounted } = useMounted();
const isOpen = ref<boolean>(true);

const toggleMenu = () => isOpen.value = !isOpen.value;

function getUrl(url: string) {
	const store = useEcaasStore();
	
	if (url !== "/domestic-hot-water/heat-sources/create") return url;
	if (!mounted.value) return url;

	if (store.domesticHotWater.heatSources.data.length >= 1) {
		return "/domestic-hot-water/heat-sources/0";
	} else return url;
}

function shouldShowPage(page: Page, parentPageId: string) {
	if (page.parentId !== parentPageId || page.url.includes(":")) {
		return false;
	}

	if (page.excludeFromNavigation && !mounted.value) {
		return false;
	}

	if (summaryOnlySections.includes(parentPageId) && page.title !== "Summary") {
		return false;
	}

	return !page.excludeFromNavigation?.();
}
</script>

<template>
	<nav class="accordion-nav">
		<div :class="`govuk-accordion__section ${isOpen ? 'govuk-accordion__section--expanded' : ''}`">
			<button class="govuk-accordion__section-button" @click="toggleMenu">
				<span class="govuk-accordion__section-heading-text govuk-!-font-size-18">
					<span class="govuk-accordion__section-heading-text-focus">Go to another page</span>
				</span>
				<span class="govuk-accordion__section-toggle">
					<span v-if="isOpen" class="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--up"/>
					<span v-else class="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--down"/>
				</span>
			</button>
			<div class="govuk-accordion__section-content">
				<div v-for="(parentPage) in parentPages" :key="parentPage.id">
					<NuxtLink class="govuk-link govuk-body-s" :to="getUrl(parentPage.url)" @click.stop>
						{{ parentPage.title  }}
					</NuxtLink>
					<ul class="govuk-inset-text">
						<template v-for="page in pagesData" :key="page.id">
							<li v-if="shouldShowPage(page, parentPage.id)">
								<NuxtLink class="govuk-link govuk-body-s" :to="getUrl(page.url)" @click.stop>
									{{ page.title  }}
								</NuxtLink>
							</li>
						</template>
					</ul>
				</div>
			</div>
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

	.govuk-frontend-supported {
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
			color: #1d70b8;
		}

		.govuk-accordion__section-toggle {
			margin: 0;
			font-size: 0rem;
			padding-top: 6px;
		}
	}

	.govuk-inset-text {
		list-style-type: none;
		margin: 10px 0 30px;
		border-left-width: 1px;
		padding-top: 5px;
	}
</style>
