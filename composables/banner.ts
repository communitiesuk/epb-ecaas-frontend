export function useBanner() {
	return useState<BannerType | null>("banner", () => null);
}

type BannerType = "import-complete" | "import-caused-update";