import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import Ductwork from "./[ductwork].vue";
import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/dom";
import { DuctShape, DuctType, VentType } from "~/schema/api-schema.types";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport('navigateTo', () => {
	return navigateToMock;
});
const user = userEvent.setup();

const populateValidForm = async () => {
	await user.type(screen.getByTestId("name"), "Ductwork 1");
	await user.click(screen.getByTestId("mvhrUnit_5124f2fe-f15b-4a56-ba5a-1a7751ac506f"));
	await user.click(
		screen.getByTestId("ductworkCrossSectionalShape_circular")
	);
	await user.click(screen.getByTestId("ductType_intake"));
	await user.type(screen.getByTestId("internalDiameterOfDuctwork"), "300");
	await user.type(screen.getByTestId("externalDiameterOfDuctwork"), "1000");
	await user.type(screen.getByTestId("insulationThickness"), "100");
	await user.type(screen.getByTestId("lengthOfDuctwork"), "100");
	await user.type(
		screen.getByTestId("thermalInsulationConductivityOfDuctwork"),
		"10"
	);
	await user.click(screen.getByTestId("surfaceReflectivity_yes"));
};

const populateValidFormWithRectangularShape = async () => {
	await user.type(screen.getByTestId("name"), "Ductwork 1");
	await user.click(screen.getByTestId("mvhrUnit_5124f2fe-f15b-4a56-ba5a-1a7751ac506f"));
	await user.click(
		screen.getByTestId("ductworkCrossSectionalShape_rectangular")
	);
	await user.click(screen.getByTestId("ductType_intake"));
	await user.type(screen.getByTestId("ductPerimeter"), "200");
	await user.type(screen.getByTestId("insulationThickness"), "100");
	await user.type(screen.getByTestId("lengthOfDuctwork"), "100");
	await user.type(
		screen.getByTestId("thermalInsulationConductivityOfDuctwork"),
		"10"
	);
	await user.click(screen.getByTestId("surfaceReflectivity_yes"));
};

describe("ductwork form", async () => {
	const store = useEcaasStore();

	const addStoreData = () => {
		store.$patch({
			infiltrationAndVentilation: {
				mechanicalVentilation: {
					data: [{
						name: 'MVHR_1',
						id: '5124f2fe-f15b-4a56-ba5a-1a7751ac506f',
						typeOfMechanicalVentilationOptions: VentType.MVHR
					},
					{
						name: 'MVHR_2',
						id: '7184f2fe-a78f-4a56-ba5a-1a7751ac506d',
						typeOfMechanicalVentilationOptions: VentType.MVHR

					}]
				}
			}
		});
	};

	const ductwork1: DuctworkData = {
		name: "Ductwork 1",
		mvhrUnit: "5124f2fe-f15b-4a56-ba5a-1a7751ac506f",
		ductworkCrossSectionalShape: DuctShape.circular,
		ductType: DuctType.intake,
		internalDiameterOfDuctwork: 300,
		externalDiameterOfDuctwork: 1000,
		insulationThickness: 100,
		lengthOfDuctwork: 100,
		thermalInsulationConductivityOfDuctwork: 10,
		surfaceReflectivity: true,
	};

	const ductwork2: DuctworkData = {
		name: "Ductwork 1",
		mvhrUnit: "5124f2fe-f15b-4a56-ba5a-1a7751ac506f",
		ductworkCrossSectionalShape: DuctShape.rectangular,
		ductType: DuctType.intake,
		ductPerimeter: 200,
		insulationThickness: 100,
		lengthOfDuctwork: 100,
		thermalInsulationConductivityOfDuctwork: 10,
		surfaceReflectivity: true,
	};

	afterEach(() => {
		store.$reset();
	});

	it("should have the correct heading", async () => {
		await renderSuspended(Ductwork);
		expect(
			screen.getByRole("heading", { name: "MVHR ductwork" })
		).toBeDefined();
	});

	it("should have the following inputs", async () => {
		await renderSuspended(Ductwork);
		const form = within(document.getElementsByTagName("form")[0]!);
		expect(form.getByText("Name")).toBeDefined();
		expect(form.getByText("MVHR unit")).toBeDefined();
		expect(form.getByText("Ductwork cross sectional shape")).toBeDefined();
		expect(form.getByTestId("ductType_supply")).toBeDefined();
		expect(form.getByTestId("ductType_extract")).toBeDefined();
		expect(form.getByTestId("ductType_intake")).toBeDefined();
		expect(form.getByTestId("ductType_exhaust")).toBeDefined();
		expect(form.queryByText("Internal diameter of ductwork")).toBeNull();
		expect(form.queryByText("External diameter of ductwork")).toBeNull();
		expect(form.queryByText("Perimeter of ductwork")).toBeNull();
		expect(form.getByText("Insulation thickness")).toBeDefined();
		expect(form.getByText("Length of ductwork")).toBeDefined();
		expect(
			form.getByText("Thermal insulation conductivity of ductwork")
		).toBeDefined();
		expect(form.getByText("Surface reflectivity")).toBeDefined();
	});

	it("should list MVHR units previously added", async() => {
		addStoreData();
		await renderSuspended(Ductwork);
		expect(screen.getByText("MVHR_1")).toBeDefined();
		expect(screen.getByText("MVHR_2")).toBeDefined();
	});

	it("should show relevant inputs for circular duct shape", async() => {
		await renderSuspended(Ductwork);
		await user.click(screen.getByTestId("ductworkCrossSectionalShape_circular"));

		expect(screen.getByTestId("internalDiameterOfDuctwork")).toBeDefined();
		expect(screen.getByTestId("externalDiameterOfDuctwork")).toBeDefined();
		expect(screen.queryByTestId("ductPerimeter")).toBeNull();
	});

	it("should show relevant inputs for rectangular duct shape", async() => {
		await renderSuspended(Ductwork);
		await user.click(screen.getByTestId("ductworkCrossSectionalShape_rectangular"));

		expect(screen.queryByTestId("internalDiameterOfDuctwork")).toBeNull();
		expect(screen.queryByTestId("externalDiameterOfDuctwork")).toBeNull();
		expect(screen.getByTestId("ductPerimeter")).toBeDefined();
	});

	test("data with circular shape is saved to store when form is valid", async () => {
		addStoreData();
		await renderSuspended(Ductwork);
		await populateValidForm();
		await user.click(screen.getByRole("button"));
		const { data } = store.infiltrationAndVentilation.ductwork;

		expect(data[0]).toEqual(ductwork1);
	});

	test("data with rectangular shape is saved to store when form is valid", async () => {
		addStoreData();
		await renderSuspended(Ductwork);
		await populateValidFormWithRectangularShape();
		await user.click(screen.getByRole("button"));
		const { data } = store.infiltrationAndVentilation.ductwork;

		expect(data[0]).toEqual(ductwork2);
	});

	test("form populated when data exists in state", async () => {
		addStoreData();
		store.$patch({
			infiltrationAndVentilation: {
				ductwork: {
					data: [ductwork1],
				},
			},
		});

		await renderSuspended(Ductwork, {
			route: {
				params: { ductwork: "0" },
			},
		});
		expect(
			((await screen.findByTestId("name")) as HTMLInputElement).value
		).toBe("Ductwork 1");
		expect(
			((await screen.findByTestId("mvhrUnit_5124f2fe-f15b-4a56-ba5a-1a7751ac506f")) as HTMLInputElement).checked
		).toBe(true);

		expect(
			(
				(await screen.findByTestId(
					"ductworkCrossSectionalShape_circular"
				)) as HTMLInputElement
			).checked
		).toBe(true);
		expect(
			((await screen.findByTestId("ductType_intake")) as HTMLInputElement)
				.checked
		).toBe(true);
		expect(
			(
				(await screen.findByTestId(
					"internalDiameterOfDuctwork"
				)) as HTMLInputElement
			).value
		).toBe("300");
		expect(
			(
				(await screen.findByTestId(
					"externalDiameterOfDuctwork"
				)) as HTMLInputElement
			).value
		).toBe("1000");
		expect(
			((await screen.findByTestId("insulationThickness")) as HTMLInputElement)
				.value
		).toBe("100");
		expect(
			((await screen.findByTestId("lengthOfDuctwork")) as HTMLInputElement).value
		).toBe("100");
		expect(
			(
				(await screen.findByTestId(
					"thermalInsulationConductivityOfDuctwork"
				)) as HTMLInputElement
			).value
		).toBe("10");
		expect(
			(
				(await screen.findByTestId(
					"surfaceReflectivity_yes"
				)) as HTMLInputElement
			).checked
		).toBe(true);
	});
  
	test("required error messages are displayed when empty form is submitted", async () => {
		addStoreData();
		await renderSuspended(Ductwork);

		await user.click(screen.getByRole("button"));

		const initialErrorIds: string[] = [
			"name_error",
			"mvhrUnit_error",
			"ductworkCrossSectionalShape_error",
			"ductType_error",
			"insulationThickness_error",
			"lengthOfDuctwork_error",
			"thermalInsulationConductivityOfDuctwork_error",
			"surfaceReflectivity_error",
		];
		for (const error of initialErrorIds) {
			expect(screen.getByTestId(error)).toBeDefined();
		}
	});
	test("error summary is displayed when an invalid form in submitted", async () => {
		await renderSuspended(Ductwork);
  
		await user.click(screen.getByRole("button"));
  
		expect(
			await screen.findByTestId("ductworkErrorSummary")
		).toBeDefined();
	});

});
