
import { renderSuspended } from "@nuxt/test-utils/runtime";
import spaceHeatingSummary from "./summary.vue";
import { screen, within } from "@testing-library/vue";
import { kilowatt } from "~/utils/units/power";


type expectedData = { [key: string]: string };
const verifyDataInSection = async (
	section: string,
	expectedSectionData: expectedData,
) => {
	for (const [key, value] of Object.entries(expectedSectionData)) {
		const lineResult = screen.queryByTestId(
			`summary-${section}-${hyphenate(key)}`,
		);
		expect(lineResult!.querySelector("dt")?.textContent).toBe(key);
		expect(lineResult!.querySelector("dd")?.textContent).toBe(value);
	}
};

describe("Cooling section", () => {

	const store = useEcaasStore();
	beforeEach(() => {
		store.$reset();
	});

	const airConditioning1: EcaasForm<AirConditioningData> = {
		data: {
			name: "Air conditioning 1",
			coolingCapacity: 1,
			seasonalEnergyEfficiencyRatio: 1,
			convectionFraction: 1,
		},
	};

	it("should contain the correct tabs for air conditioning systems", async () => {
		await renderSuspended(spaceHeatingSummary);

		expect(screen.getByRole("link", { name: "Air conditioning systems" })).not.toBeNull();
	});

	it("displays 'No air conditioning systems added' and link to create air conditioning item when no data exists", async () => {
		await renderSuspended(spaceHeatingSummary);

		expect(screen.getByText("No air conditioning systems added")).not.toBeNull();
		const addAirConditioningLink: HTMLAnchorElement = screen.getByRole("link", {
			name: "Add air conditioning system",
		});
		expect(new URL(addAirConditioningLink.href).pathname).toBe(
			getUrl("airConditioningCreate"),
		);
	});

	it("displays the correct data for the air conditioning section when data exists", async () => {

		store.$patch({
			cooling: {
				airConditioning: {
					data: [airConditioning1],
				},
			},
		});
		await renderSuspended(spaceHeatingSummary);

		const expectedAirConditioningData = {
			"Name": "Air conditioning 1",
			"Cooling capacity": `1 ${kilowatt.suffix}`,
			"Seasonal energy efficiency ratio": "1",
			"Convection fraction": "1",
		};
		await renderSuspended(spaceHeatingSummary);
		await verifyDataInSection("airConditioning", expectedAirConditioningData);
	});

	it("displays an edit link on each section that navigates to the cooling overview page when clicked", async () => {

		store.$patch({
			cooling: {
				airConditioning: {
					data: [airConditioning1],
				},
			},
		});
		await renderSuspended(spaceHeatingSummary);
		for (const [key] of Object.entries(store.cooling)) {
			const coolingSection = screen.getByTestId(key);

			const editLink: HTMLAnchorElement = within(coolingSection).getByText(
				"Edit",
			);
			expect(editLink).not.toBeNull();
			expect(new URL(editLink.href).pathname).toBe(
				"/cooling",
			);
		}
	});
});