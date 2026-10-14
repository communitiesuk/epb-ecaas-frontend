import { clearLastExportDate } from "~/utils/exportDate";

vi.mock(import("#app"), async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		useCookie: vi.fn().mockReturnValue({ value: "2025-08-20T12:00:00Z" }),
	};
});

it("clears last export date cookie", () => {
	const cookie = useCookie("last_export_date");
	clearLastExportDate();
	expect(cookie.value).toBeUndefined();
});