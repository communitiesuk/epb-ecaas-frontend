import type { DisplayProduct, PaginatedResult, Product, TechnologyGroup, TechnologyType } from "../pcdb.types";

export type ProductForTechnology<T extends TechnologyType> = Extract<Product, { technologyType: T }>;

export interface PcdbClient {
	getProduct: <T extends TechnologyType>(id: number, includeTestData: boolean) => Promise<ProductForTechnology<T> | undefined>;
	getProductsByTechnologyType(technologyType: TechnologyType, pageSize?: number, startKey?: string): Promise<PaginatedResult<DisplayProduct>>;
	getProductsByTechnologyGroup(technologyGroup: TechnologyGroup): Promise<PaginatedResult<DisplayProduct>>;
};