import type { Mock } from "vitest";
import { reactive } from "vue";


/**
 * Builds a reactive route for mocking `useRoute`.
 *
 * Vue Router only resolves links against full page paths, so the mocked
 * route's relative `path` is prefixed with the page's base path to avoid
 * "No match found" warnings. The route is reactive so components can `watch` it.
 *
 * @param basePath - The page's base path, e.g. "/domestic-hot-water/wwhrs"
 * @param route - The mocked route, whose `path` is relative to the base path
 */
export const mockReactiveRouteWithPath = (basePath: string, mockRoute: Mock) => {
	const route = mockRoute();
	return reactive({ ...route, path: `${basePath}${route?.path ?? ""}` });
};
