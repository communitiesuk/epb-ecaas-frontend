import { screen } from "@testing-library/vue";
import PVScreen from "./[system].vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from '@testing-library/user-event';

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});

describe("PV system", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();

	const populateValidForm = async () => {
		await user.type(screen.getByTestId('name'), 'PV 1');
		await user.type(screen.getByTestId('peakPower'), '4');
		await user.click(screen.getByTestId('ventilationStrategy_unventilated'));
		await user.type(screen.getByTestId('pitch'), '45');
		await user.type(screen.getByTestId('orientation'), '20');
		await user.type(screen.getByTestId('elevationalHeight'), '100');
		await user.type(screen.getByTestId('lengthOfPV'), '20');
		await user.type(screen.getByTestId('widthOfPV'), '20');
		await user.type(screen.getByTestId('inverterPeakPowerAC'), '4');
		await user.type(screen.getByTestId('inverterPeakPowerDC'), '5');
		await user.click(screen.getByTestId('inverterLocation_inside'));
		await user.click(screen.getByTestId('inverterType_central'));
		await user.type(screen.getByTestId('aboveDepth'), '20');
		await user.type(screen.getByTestId('aboveDistance'), '4');
		await user.type(screen.getByTestId('leftDepth'), '10');
		await user.type(screen.getByTestId('leftDistance'), '7');
		await user.type(screen.getByTestId('rightDepth'), '2');
		await user.type(screen.getByTestId('rightDistance'), '10');
	};

	const pvSystem: PvSystemData = {
		name: 'PV 1',
		peakPower: 4,
		ventilationStrategy: 'unventilated',
		pitch: 45,
		orientation: 20,
		elevationalHeight: 100,
		lengthOfPV: 20,
		widthOfPV: 20,
		inverterPeakPowerAC: 4,
		inverterPeakPowerDC: 5,
		inverterLocation: 'inside',
		inverterType: 'central',
		aboveDepth: 20,
		aboveDistance: 4,
		leftDepth: 10,
		leftDistance: 7,
		rightDepth: 2,
		rightDistance: 10,
	};

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

	it("should error when user submits an empty form", async () => {
		await renderSuspended(PVScreen);
		await user.click(screen.getByRole('button'));
		expect((await screen.findByTestId('name_error'))).toBeDefined();
		expect((await screen.findByTestId('peakPower_error'))).toBeDefined();
		expect((await screen.findByTestId('ventilationStrategy_error'))).toBeDefined();
		expect((await screen.findByTestId('pitch_error'))).toBeDefined();
		expect((await screen.findByTestId('orientation_error'))).toBeDefined();
		expect((await screen.findByTestId('elevationalHeight_error'))).toBeDefined();
		expect((await screen.findByTestId('lengthOfPV_error'))).toBeDefined();
		expect((await screen.findByTestId('widthOfPV_error'))).toBeDefined();
		expect((await screen.findByTestId('inverterPeakPowerAC_error'))).toBeDefined();
		expect((await screen.findByTestId('inverterPeakPowerDC_error'))).toBeDefined();
		expect((await screen.findByTestId('inverterLocation_error'))).toBeDefined();
		expect((await screen.findByTestId('inverterType_error'))).toBeDefined();

		expect((await screen.findByTestId('photovoltaicErrorSummary'))).toBeDefined();
	});

	it("data is saved to store when form is valid", async () => {
		await renderSuspended(PVScreen);
		await populateValidForm();
		await user.click(screen.getByRole('button'));

		const { data = [] } = store.pvAndBatteries.pvSystem;
		
		expect(data[0]).toEqual(pvSystem);
	});

	it("should navigate to pv and electric batteries page when valid form is completed", async ()=> {
		await renderSuspended(PVScreen);
		await populateValidForm();
		await user.click(screen.getByRole('button'));
		expect(navigateToMock).toHaveBeenCalledWith('/pv-and-batteries');
	});

	
});
