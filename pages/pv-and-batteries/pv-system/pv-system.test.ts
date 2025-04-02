import { screen } from "@testing-library/vue";
import PVScreen from "./[system].vue";
import { renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from '@testing-library/user-event';

describe("PV system", () => {
	const user = userEvent.setup();

	it("should have a heading", async () => {
		await renderSuspended(PVScreen);
		expect(
			screen.getByRole("heading", { name: "Photovoltaic (PV)" })
		).toBeDefined();
	});

	it("should have the following inputs", async () => {
		await renderSuspended(PVScreen);
		expect(screen.getByText("Name")).toBeDefined();
		expect(screen.getByText("Peak power")).toBeDefined();
		expect(screen.getAllByText("Ventilation strategy")).toBeDefined();
		expect(screen.getByText("Pitch")).toBeDefined();
		expect(screen.getByText("Orientation")).toBeDefined();
		expect(screen.getByText("Elevational height of PV element at its base")).toBeDefined();
		expect(screen.getByText("Length of PV")).toBeDefined();
		expect(screen.getByText("Width of PV")).toBeDefined();
		expect(screen.getByText("Inverter peak power AC")).toBeDefined();
		expect(screen.getByText("Inverter peak power DC")).toBeDefined();
		expect(screen.getByText("Inverter location")).toBeDefined();
		expect(screen.getByText("Inverter type")).toBeDefined();
		expect(screen.getByText("PV shading")).toBeDefined();
	});



	it("should error when the Peak power input is out of range", async () => {
		await renderSuspended(PVScreen);
		await user.type(screen.getByTestId('name'), 'Photovoltaic');
		await user.type(screen.getByTestId('peakPower'), '0');

		await user.click(screen.getByRole('button'));

		expect((await screen.findByTestId('photovoltaicErrorSummary'))).toBeDefined();
	});
});
