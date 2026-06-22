import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import { v4 as uuidv4 } from "uuid";
import type { WwhrsData } from "~/stores/ecaasStore.schema";
import type { DisplayProduct } from "~/pcdb/pcdb.types";
import Wwhrs from "./index.vue";

const { mockFetch, navigateToMock } = vi.hoisted(() => ({
	mockFetch: vi.fn(),
	navigateToMock: vi.fn(),
}));

mockNuxtImport("navigateTo", () => navigateToMock);

vi.mock("uuid");

describe("wwhrs", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	afterEach(() => {
		store.$reset();
		mockFetch.mockReset();
	});

	const wwhrsData: EcaasForm<WwhrsData> = {
		data: {
			id: "563d2dcd-b407-4a8a-a5d7-a565ef154bb6",
			name: "WWHRS",
			coldWaterSource: "mainsWater",
			productReference: "1234",
		},
	};

	const populateValidForm = async () => {
		await user.type(screen.getByTestId("name"), "WWHRS");
		await user.click(screen.getByTestId("coldWaterSource_mainsWater"));
		await user.tab();
	};

	it("displays required error messages when empty form is submitted", async () => {
		await renderSuspended(Wwhrs, {
			route: {
				params: { "system": "create" },
			},
		});

		await user.click(screen.getByTestId("saveAndComplete"));

		expect(await screen.findByTestId("name_error")).toBeDefined();
		expect(await screen.findByTestId("coldWaterSource_error")).toBeDefined();
		expect(await screen.findByTestId("productReference_error")).toBeDefined();
	});

	it("displays error summary when an invalid form in submitted", async () => {
		await renderSuspended(Wwhrs, {
			route: {
				params: { "system": "create" },
			},
		});

		await user.click(screen.getByTestId("saveAndComplete"));

		expect((await screen.findByTestId("wwhrsErrorSummary"))).toBeDefined();
	});

	describe("saving data", () => {
		const wwhrsProduct: Partial<DisplayProduct> = {
			id: "1234",
			brandName: "Brand",
			technologyType: "InstantaneousWwhrSystem",
		};

		beforeEach(() => {
			mockFetch.mockReturnValue({
				data: ref(wwhrsProduct),
			});
		});

		it("saves data to store state when form is valid", async () => {
			vi.mocked(uuidv4).mockReturnValue(wwhrsData.data.id as unknown as Buffer);

			await renderSuspended(Wwhrs, {
				route: {
					params: { "system": "create" },
				},
			});

			await populateValidForm();

			const { data } = store.domesticHotWater.wwhrs;

			expect(data[0]?.data).toEqual({
				...wwhrsData.data,
				productReference: undefined,
			});
		});

		it("prepopulates form when data exists in state", async () => {
			store.$patch({
				domesticHotWater: {
					wwhrs: {
						data: [wwhrsData],
					},
				},
			});

			await renderSuspended(Wwhrs, {
				route: {
					params: { "system": "0" },
				},
			});

			expect((await screen.findByTestId<HTMLInputElement>("name")).value).toBe(wwhrsData.data.name);
			expect((await screen.findByTestId<HTMLInputElement>(`coldWaterSource_${wwhrsData.data.coldWaterSource}`)).checked).toBe(true);
		});

		it("navigates to domestic hot water page when valid form is completed", async () => {
			store.$patch({
				domesticHotWater: {
					wwhrs: {
						data: [wwhrsData],
					},
				},
			});

			await renderSuspended(Wwhrs, {
				route: {
					params: { "system": "0" },
				},
			});

			await user.click(screen.getByTestId("saveAndComplete"));

			expect(navigateToMock).toHaveBeenCalledWith("/domestic-hot-water");
		});
	});
});