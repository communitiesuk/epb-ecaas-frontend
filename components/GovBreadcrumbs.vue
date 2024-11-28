    <template>
      <nav class="govuk-breadcrumbs" aria-label="Breadcrumb">
        <ol class="govuk-breadcrumbs__list">
          <li v-for="(page, index) in pages" :key="page.id" class="govuk-breadcrumbs__list-item">
            <a v-if="index !== pages.length - 1" class="govuk-breadcrumbs__link" :href="page.url">{{ page.title }}</a>
            <a v-else>{{ page.title }}</a>
          </li>
        </ol>
      </nav>
    </template>


<script setup lang="ts">
import pagesData from '../data/pages';
import type { Page } from '../data/pages'

const props = defineProps({
  currentPageId: {
    type: String,
    required: true,
  }
})

const pages = computed((): Array<Page> => {
  const currentPage = pagesData.find((page: Page) => page.id === props.currentPageId);
  if (!currentPage) return [];

  const pagesArray = [];
  let current: any = currentPage;


  while (current) {
    pagesArray.unshift({
      id: current.id,
      title: current.title,
      url: current.url,
    });
    current = current.parentId
      ? pagesData.find((page: Page) => page.id === current.parentId)
      : null;
  }
  return pagesArray;
}

)

</script>
