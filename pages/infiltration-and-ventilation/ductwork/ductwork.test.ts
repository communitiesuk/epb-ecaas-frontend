import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import DuctworkOverview from "./index.vue";
import DuctworkForm from "./[ductwork].vue";
import userEvent from "@testing-library/user-event";
import type { DuctworkData } from "../../../stores/ecaasStore.schema";
import formStatus from "~/constants/formStatus";

describe("ductwork", async () => {
	const user = userEvent.setup();
	const store = useEcaasStore();

	const navigateToMock = vi.hoisted(() => vi.fn());
	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	const ductwork1: DuctworkData = {
		name: "Ductwork 1",
		mvhrUnit: "",
		ductworkCrossSectionalShape: "circular",
		ductType: "intake",
		internalDiameterOfDuctwork: 300,
		externalDiameterOfDuctwork: 1000,
		insulationThickness: 100,
		lengthOfDuctwork: 100,
		thermalInsulationConductivityOfDuctwork: 10,
		surfaceReflectivity: true,
	};
	const ductwork2: DuctworkData = {
		name: "Ductwork 2",
		mvhrUnit: "",
		ductworkCrossSectionalShape: "circular",
		ductType: "supply",
		internalDiameterOfDuctwork: 30,
		externalDiameterOfDuctwork: 100,
		insulationThickness: 10,
		lengthOfDuctwork: 10,
		thermalInsulationConductivityOfDuctwork: 9,
		surfaceReflectivity: true,
	};
	const ductwork3: DuctworkData = {
		name: "Ductwork 3",
		mvhrUnit: "",
		ductworkCrossSectionalShape: "rectangular",
		ductType: "exhaust",
		internalDiameterOfDuctwork: 30,
		externalDiameterOfDuctwork: 100,
		insulationThickness: 100,
		lengthOfDuctwork: 200,
		thermalInsulationConductivityOfDuctwork: 1,
		surfaceReflectivity: true,
	};
	afterEach(() => {
		store.$reset();
	});

	it("should have the correct heading", async () => {
		await renderSuspended(DuctworkOverview);
		expect(screen.getByRole("heading", { name: "MVHR ductwork" }));
	});

	it("should allow users to remove a ductwork when remove button is clicked", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				ductwork: {
					data: [{ data: ductwork1 }],
				},
			},
		});

		await renderSuspended(DuctworkOverview);

		expect(screen.getAllByTestId("ductwork_items")).toBeDefined();
		await user.click(screen.getByTestId("ductwork_remove_0"));
		expect(screen.queryByTestId("ductwork_items")).toBeNull();
	});

	it("removes the correct ductwork if there are multiple ductworks", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				ductwork: {
					data: [
						{ data: ductwork1 },
						{ data: ductwork2 },
						{ data: ductwork3 },
					],
				},
			},
		});
		await renderSuspended(DuctworkOverview);
		await user.click(screen.getByTestId("ductwork_remove_1"));
		expect(screen.getByText("Ductwork 1")).toBeDefined();
		expect(screen.queryByText("Ductwork 2")).toBeNull();
		expect(screen.getByText("Ductwork 3")).toBeDefined();
	});

	it("should allow users to duplicate a ductwork when duplicate button is clicked", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				ductwork: {
					data: [
						{ data: ductwork1 },
						{ data: ductwork2 },
					],
				},
			},
		});
		await renderSuspended(DuctworkOverview);
		await user.click(screen.getByTestId("ductwork_duplicate_0"));
		await user.click(screen.getByTestId("ductwork_duplicate_0"));
		await user.click(screen.getByTestId("ductwork_duplicate_2"));
		await user.click(screen.getByTestId("ductwork_duplicate_2"));
		expect(screen.getByText("Ductwork 1")).toBeDefined();
		expect(screen.getByText("Ductwork 1 (1)")).toBeDefined();
		expect(screen.getByText("Ductwork 1 (2)")).toBeDefined();
		expect(screen.getByText("Ductwork 1 (1) (1)")).toBeDefined();
		expect(screen.getByText("Ductwork 1 (1) (2)")).toBeDefined();
	});

	it("disables the mark section as complete button when shading element is incomplete", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				ductwork: {
					data: [
						{
							data: {
								name: "Ductwork 1",
								ductType: "intake",
							},
							complete: false,
						},
					],
				},
			},
		});

		await renderSuspended(DuctworkOverview);

		const markAsCompleteButton = screen.getByRole("button", {
			name: "Mark section as complete",
		});
		expect(markAsCompleteButton.hasAttribute("disabled")).toBeTruthy();
	});

	it("marks ductwork as complete when mark section as complete button is clicked", async () => {
		await renderSuspended(DuctworkOverview);
		expect(
			screen.getByRole("button", { name: "Mark section as complete" }),
		).not.toBeNull();
		const completedStatusElement = screen.queryByTestId(
			"completeSectionCompleted",
		);
		expect(completedStatusElement?.style.display).toBe("none");

		await user.click(screen.getByTestId("markAsCompleteButton"));

		const { complete } = store.infiltrationAndVentilation.ductwork;

		expect(complete).toBe(true);
		expect(
			screen.queryByRole("button", { name: "Mark section as complete" }),
		).toBeNull();
		expect(completedStatusElement?.style.display).not.toBe("none");

		expect(navigateToMock).toHaveBeenCalledWith(
			"/infiltration-and-ventilation",
		);
	});
	it("marks ductwork as not complete when complete button is clicked then user removes a ductwork item", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				ductwork: {
					data: [
						{ data: ductwork1, complete: true },
						{ data: ductwork2, complete: true },
					],
				},
			},
		});

		await renderSuspended(DuctworkOverview);

		await user.click(screen.getByTestId("markAsCompleteButton"));
		expect(store.infiltrationAndVentilation.ductwork.complete).toBe(true);

		await user.click(screen.getByTestId("ductwork_remove_0"));
		expect(store.infiltrationAndVentilation.ductwork.complete).toBe(false);
		expect(
			screen.getByRole("button", { name: "Mark section as complete" }),
		).not.toBeNull();
	});

	it("marks ductwork as not complete when complete button is clicked then user duplicates a ductwork item", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				ductwork: {
					data: [{ data: ductwork1, complete: true }],
				},
			},
		});

		await renderSuspended(DuctworkOverview);

		await user.click(screen.getByTestId("markAsCompleteButton"));
		expect(store.infiltrationAndVentilation.ductwork.complete).toBe(true);

		await user.click(screen.getByTestId("ductwork_duplicate_0"));
		expect(store.infiltrationAndVentilation.ductwork.complete).toBe(false);
		expect(
			screen.getByRole("button", { name: "Mark section as complete" }),
		).not.toBeNull();
	});

	it("marks ductwork as not complete when user saves a new or edited form after marking section as complete", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				ductwork: {
					data: [{ data: ductwork1 }],
				},
			},
		});

		await renderSuspended(DuctworkOverview);
		await user.click(screen.getByTestId("markAsCompleteButton"));

		await renderSuspended(DuctworkForm, {
			route: {
				params: { ductwork: "0" },
			},
		});

		await user.click(screen.getByTestId("saveAndComplete"));

		const { complete } = store.infiltrationAndVentilation.ductwork;
		expect(complete).toBe(false);

		await renderSuspended(DuctworkOverview);
		expect(
			screen.getByRole("button", { name: "Mark section as complete" }),
		).not.toBeNull();
	});

	it("should navigate to the infiltration and ventilation overview page when return to overview is clicked", async () => {
		await renderSuspended(DuctworkOverview);

		const returnToOverviewButton = screen.getByRole("button", {
			name: "Return to infiltration and ventilation",
		});
		expect(returnToOverviewButton.getAttribute("href")).toBe(
			"/infiltration-and-ventilation",
		);
	});

	it("should display an in-progress indicator when an entry is not marked as complete", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				ductwork: {
					data: [
						{
							data: { name: "Ductwork 1" },
						},
					],
				},
			},
		});

		await renderSuspended(DuctworkOverview);

		expect(screen.getByTestId("ductwork_status_0").textContent).toBe(
			formStatus.inProgress.text,
		);
	});

	it("should display a complete indicator when an entry is marked as complete", async () => {
		store.$patch({
			infiltrationAndVentilation: {
				ductwork: {
					data: [
						{
							data: ductwork1,
							complete: true,
						},
					],
				},
			},
		});

		await renderSuspended(DuctworkOverview);

		expect(screen.getByTestId("ductwork_status_0").textContent).toBe(
			formStatus.complete.text,
		);
	});
});
