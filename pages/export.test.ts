import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Export from "./export.vue";
import { screen } from "@testing-library/vue";

describe("export", () => {
	it("displays validation error when file name is invalid", async () => {
		const user = userEvent.setup();
	
		await renderSuspended(Export);

		await user.click(screen.getByRole("button", { name: /Export/ }));

		expect(screen.findByTestId("fileName_error")).toBeDefined();
	});

	it('displays the "Export complete" screen when export file has been generated', async () => {
		const user = userEvent.setup();
	
		await renderSuspended(Export);

		const fileName = "test_export";

		await user.type(screen.getByTestId("fileName"), fileName);
		await user.click(screen.getByRole("button", { name: /Export/ }));

		expect(screen.findByText("Export complete")).toBeDefined();
		expect(screen.findByText(`${fileName}.json`)).toBeDefined();
	});
});