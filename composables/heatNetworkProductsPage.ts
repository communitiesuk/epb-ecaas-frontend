import type { PageId } from "~/data/pages/pages";
import type { DisplayProduct } from "~/pcdb/pcdb.types";
import { productTypeMap } from "~/stores/ecaasStore.schema";
import type { ProductOrderOption } from "./productSearch";

export function useHeatNetworkProductsPage(indexParam: string) {
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

	const getSearchModelFromQuery = (): HeatNetworkProductSearchModel => {
		const productId = (routeQuery.value?.productId as string | undefined)?.trim();
		const networkName = (routeQuery.value?.networkName as string | undefined)?.trim();
		const searchOption = routeQuery.value?.searchOption as HeatNetworkSearchOption | undefined;
		const sort = routeQuery.value?.sort as HeatNetworkProductSortOption | undefined;
		const order = routeQuery.value?.order as ProductOrderOption | undefined;

		return {
			searchOption,
			productId,
			networkName,
			sort,
			order,
		};
	};

	const searchModel = ref(getSearchModelFromQuery());

	const searchData = (productData: DisplayProduct[], pageSize: number = 12) => {
		const productResults = ref(useHeatNetworkProductSearch(productData, searchModel.value));
		const pagination = ref(usePagination(productResults.value, pageSize));

		watch(routeQuery, (currentRoute, previousRoute) => {
			if (currentRoute.page && currentRoute.page !== previousRoute.page) {
				pagination.value = usePagination(productResults.value, pageSize);
				return;
			}

			searchModel.value = getSearchModelFromQuery();
		});

		watch(searchModel, () => {
			productResults.value = useHeatNetworkProductSearch(productData, searchModel.value);
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