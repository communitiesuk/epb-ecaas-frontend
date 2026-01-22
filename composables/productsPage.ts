import type { PageId } from "~/data/pages/pages";
import type { DisplayProduct } from "~/pcdb/pcdb.types";

export function useProductsPage(indexParam: string) {
	const route = useRoute();
	const routeQuery = computed(() => route.query);
	const pageId = kebabToCamelCase(route.params.products as string);

	if (!(pageId in heatSourceProductTypeMap)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid product type selected",
		});
	}

	const title = getTitle(pageId + "Products" as PageId);
	const index = Number(route.params[indexParam]);

	const getSearchModelFromQuery = (): ProductSearchModel => {
		const productId = (routeQuery.value?.productId as string | undefined)?.trim();
		const brandName = (routeQuery.value?.brandName as string | undefined)?.trim();
		const modelName = (routeQuery.value?.modelName as string | undefined)?.trim();
		const modelQualifier = (routeQuery.value?.modelQualifier as string | undefined)?.trim();
		const searchOption = routeQuery.value?.searchOption as SearchOption | undefined;

		return {
			searchOption,
			productId,
			brandName,
			modelName,
			modelQualifier,
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

		watch(searchModel, () => {
			productResults.value = useProductSearch(productData, searchModel.value);
			pagination.value = usePagination(productResults.value, pageSize);
		});

		return {
			productData,
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