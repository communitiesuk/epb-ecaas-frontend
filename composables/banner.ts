export function useBanner() {
	return useState<BannerType | null>("banner", () => null);
}

type BannerType =
  | { type: "import-complete" }
  | { type: "import-caused-update" }
  | { type: "update-front-door" }
  | { type: "change-orientation-complete"; difference: number; orientation: number };