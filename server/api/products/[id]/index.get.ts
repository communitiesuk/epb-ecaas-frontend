import { getProductDetails } from "@/server/services/products";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	const testDataId = getQuery(event).testDataId;
	return await getProductDetails(id ?? "", { testDataId: testDataId?.toString() });
});
