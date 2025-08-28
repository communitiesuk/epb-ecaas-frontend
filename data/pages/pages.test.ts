import { describe, it, expectTypeOf } from "vitest";
import type { PageId } from "./pages";

describe("pages module", () => {
	it("should define a PageId type that matches the union of all page ids", () => {
		expectTypeOf<PageId>().not.toEqualTypeOf<string>();
	});
});
