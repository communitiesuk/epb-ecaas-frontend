<script setup lang="ts">
const { totalPages, range } = defineProps<{
	totalPages: number;
	range: number;
}>();

const route = useRoute();
const getPageNumber = () => parseInt(route.query?.page as string) || 1;

const minPageNumbers = 3;
const minPageNumbersToTruncate = 6;
const adjacentPageNumbers = Math.floor(range / 2);
</script>

<template>
	<div class="govuk-pagination govuk-!-margin-bottom-3" aria-label="Pagination">
		<!-- Show previous link if current page is greater than 1 -->
		<div v-if="getPageNumber() > 1" class="govuk-pagination__prev">
			<NuxtLink class="govuk-link govuk-pagination__link" :href="`?page=${getPageNumber() - 1}`" rel="prev">
				<svg
					class="govuk-pagination__icon govuk-pagination__icon--prev"
					xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true"
					focusable="false" viewBox="0 0 15 13">
					<path
						d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"/>
				</svg>
				<span class="govuk-pagination__link-title">
					Previous<span class="govuk-visually-hidden"> page</span>
				</span>
			</NuxtLink>
		</div>

		<!-- Show links to all page numbers if total pages is less than the minimum to truncate  -->
		<ul v-if="totalPages >= minPageNumbers && totalPages < minPageNumbersToTruncate" class="govuk-pagination__list">
			<li
				v-for="pageNumber in totalPages" class="govuk-pagination__item"
				:class="getPageNumber() === pageNumber ? 'govuk-pagination__item--current' : ''">
				<NuxtLink class="govuk-link govuk-pagination__link" :href="`?page=${pageNumber}`" :aria-label="`Page ${pageNumber}`">
					{{ pageNumber }}
				</NuxtLink>
			</li>
		</ul>

		<!-- Truncate page numbers if total pages is greater than the minimum to truncate -->
		<ul v-if="totalPages >= minPageNumbersToTruncate" class="govuk-pagination__list">
			<li class="govuk-pagination__item" :class="getPageNumber() === 1 ? 'govuk-pagination__item--current' : ''">
				<NuxtLink class="govuk-link govuk-pagination__link" href="?page=1" :aria-label="`Page 1`">
					1
				</NuxtLink>
			</li>
			<li v-if="getPageNumber() - adjacentPageNumbers > 3" class="govuk-pagination__item govuk-pagination__item--ellipses">
				&ctdot;
			</li>
			<template v-for="pageNumber in totalPages">
				<li
					v-if="
						pageNumber > 1 &&
							pageNumber < totalPages &&
							Array.from({ length: range }, (_, index) => index + (getPageNumber() - adjacentPageNumbers))
								.concat([
									(getPageNumber() - adjacentPageNumbers - 2 === 1 ? 2 : 0),
									(getPageNumber() + adjacentPageNumbers + 2 === totalPages ? totalPages - 1 : 0)
								])
								.includes(pageNumber)"
					class="govuk-pagination__item"
					:class="pageNumber === getPageNumber() ? 'govuk-pagination__item--current' : ''"
				>
					<NuxtLink class="govuk-link govuk-pagination__link" :href="`?page=${pageNumber}`" :aria-label="`Page ${pageNumber}`">
						{{ pageNumber }}
					</NuxtLink>
				</li>
			</template>
			<li v-if="getPageNumber() + adjacentPageNumbers < (totalPages - 2)" class="govuk-pagination__item govuk-pagination__item--ellipses">
				&ctdot;
			</li>
			<li class="govuk-pagination__item" :class="getPageNumber() === totalPages ? 'govuk-pagination__item--current' : ''">
				<NuxtLink class="govuk-link govuk-pagination__link" :href="`?page=${totalPages}`" :aria-label="`Page ${totalPages}`">
					{{ totalPages }}
				</NuxtLink>
			</li>
		</ul>

		<!-- Show next link if current page is less than total pages -->
		<div v-if="getPageNumber() < totalPages" class="govuk-pagination__next">
			<NuxtLink class="govuk-link govuk-pagination__link" :href="`?page=${getPageNumber() + 1}`" rel="next">
				<span class="govuk-pagination__link-title">
					Next<span class="govuk-visually-hidden"> page</span>
				</span>
				<svg
					class="govuk-pagination__icon govuk-pagination__icon--next"
					xmlns="http://www.w3.org/2000/svg" height="13" width="15" aria-hidden="true"
					focusable="false" viewBox="0 0 15 13">
					<path
						d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"/>
				</svg>
			</NuxtLink>
		</div>
	</div>
</template>