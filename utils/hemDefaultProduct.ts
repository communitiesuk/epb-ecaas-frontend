export function isHemDefaultProduct(product: unknown): boolean {
	if (!product || typeof product !== "object") {
		return false;
	}

	const { brandName } = product as { brandName?: unknown };
	return typeof brandName === "string" && brandName.includes("HEM Default");
}