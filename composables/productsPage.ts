import type { PageId } from "~/data/pages/pages";
import type { DisplayProduct } from "~/pcdb/pcdb.types";
import { productTypeMap } from "~/stores/ecaasStore.schema";
import type { ProductOrderOption, ProductSortOption } from "./productSearch";

export function useProductsPage(indexParam: string) {
	const route = useRoute();
	const routeQuery = computed(() => route.query);
	const pageId = kebabToCamelCase(route.params.products as string);

	if (!(pageId in productTypeMap)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid product type selected",
		});
	}

	const title = getTitle(pageId + "Products" as PageId);
	const index = Number(route.params[indexParam]);

	const getSearchModelFromQuery = (): ProductSearchModel => {
		const searchOption = routeQuery.value?.searchOption as SearchOption | undefined;
		const productId = (routeQuery.value?.productId as string | undefined);
		const searchTerm = (routeQuery.value?.searchTerm as string | undefined);
		const sort = routeQuery.value?.sort as ProductSortOption | undefined;
		const order = routeQuery.value?.order as ProductOrderOption | undefined;

		return {
			searchOption,
			productId,
			searchTerm,
			sort,
			order,
		};
	};

	const searchModel = ref(getSearchModelFromQuery());

	const searchData = (productData: DisplayProduct[], pageSize: number = 12) => {
		const productResults = ref(useProductSearch(productData, searchModel.value));
		const pagination = ref(usePagination(productResults.value, pageSize));

		watch(routeQuery, (currentRoute, previousRoute) => {
			if (currentRoute.page && currentRoute.page !== previousRoute.page) {
				pagination.value = usePagination(productResults.value, pageSize);
				return;
			}

			searchModel.value = getSearchModelFromQuery();
		});

		watch(searchModel, (currentSearch, previousSearch) => {
			if (currentSearch.searchOption !== previousSearch.searchOption) {
				return;
			}

			productResults.value = useProductSearch(productData, currentSearch);
			pagination.value = usePagination(productResults.value, pageSize);
		});

		return {
			pagination,
		};
	};

	return {
		pageId,
		title,
		index,
		searchModel,
		searchData,
	};
}