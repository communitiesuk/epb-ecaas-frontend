import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import CeilingsAndRoofs from "./index.vue";
import CeilingForm from "./ceilings/[ceiling].vue";
import RoofForm from "./roofs/[roof].vue";

import { screen } from "@testing-library/vue";
import { within } from "@testing-library/dom";
import type { Component } from "vue";
import formStatus from "~/constants/formStatus";

describe("ceilings and roofs", () => {
	const store = useEcaasStore();
	const user = userEvent.setup();
	const navigateToMock = vi.hoisted(() => vi.fn());

	mockNuxtImport("navigateTo", () => {
		return navigateToMock;
	});

	afterEach(() => {
		store.$reset();
	});

	const ceiling1: EcaasForm<CeilingData> = {
		data: {
			name: "Ceiling 1",
			type: AdjacentSpaceType.heatedSpace,
			surfaceArea: 5,
			kappaValue: 100,
			massDistributionClass: "I",
			pitchOption: "custom",
			pitch: 180,
		},
	};

	const ceiling2: EcaasForm<CeilingData> = {
		data: {
			...ceiling1.data,
			name: "Ceiling 2",
		} };

	const ceiling3: EcaasForm<CeilingData> = {
		data: {
			...ceiling1.data,
			name
			:
		"Ceiling 3",
		},
	};

	const roof1: EcaasForm<RoofData> = {
		data: {
			name: "Roof 1",
			typeOfRoof: "flat",
			pitchOption: "0",
			pitch: 0,
			length: 1,
			width: 1,
			elevationalHeightOfElement: 2,
			surfaceArea: 1,
			solarAbsorptionCoefficient: 0.5,
			uValue: 1,
			kappaValue: 50000,
			massDistributionClass: "I",
		},
	};

	const roof2: EcaasForm<RoofData> = {
		data: {
			...roof1.data,
			name: "Roof 2",
		},
	};

	const roof3: EcaasForm<RoofData> = {
		data: {
			...roof1.data,
			name: "Roof 3",
		},
	};

	describe("ceilings", () => {
	
		test("ceiling is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: {
							data:[ceiling1],
						},
					},
				},
			});
	
			await renderSuspended(CeilingsAndRoofs);
	
			expect(screen.getAllByTestId("ceilings_items")).toBeDefined();
	
			await user.click(screen.getByTestId("ceilings_remove_0"));
	
			expect(screen.queryByTestId("ceilings_items")).toBeNull();
		});
	
		it("should only remove the ceiling object thats is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: {
							data:[ceiling1, ceiling2, ceiling3],
						},
					},
				},
			});
	
			await renderSuspended(CeilingsAndRoofs);
			await user.click(screen.getByTestId("ceilings_remove_1"));
	
			const populatedList = screen.getByTestId("ceilings_items");
	
			expect(within(populatedList).getByText("Ceiling 1")).toBeDefined();
			expect(within(populatedList).getByText("Ceiling 3")).toBeDefined();
			expect(within(populatedList).queryByText("Ceiling 2")).toBeNull();
	
		});
	
		test("ceiling is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: {
							data:[ceiling1, ceiling2],
						},
					},
				},
			});
	
			await renderSuspended(CeilingsAndRoofs);
			await userEvent.click(screen.getByTestId("ceilings_duplicate_0"));
			await userEvent.click(screen.getByTestId("ceilings_duplicate_0"));
			await userEvent.click(screen.getByTestId("ceilings_duplicate_2"));
			await userEvent.click(screen.getByTestId("ceilings_duplicate_2"));
	
			expect(screen.queryAllByTestId("ceilings_item").length).toBe(6);
			expect(screen.getByText("Ceiling 1")).toBeDefined();
			expect(screen.getByText("Ceiling 1 (1)")).toBeDefined();
			expect(screen.getByText("Ceiling 1 (2)")).toBeDefined();
			expect(screen.getByText("Ceiling 1 (1) (1)")).toBeDefined();
			expect(screen.getByText("Ceiling 1 (1) (2)")).toBeDefined();
		});
	});

	describe("roofs", () => {
	
		test("roof is removed when remove link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceRoofs: {
							data:[roof1],
						},
					},
				},
			});
	
			await renderSuspended(CeilingsAndRoofs);
	
			expect(screen.getAllByTestId("roofs_items")).toBeDefined();
	
			await user.click(screen.getByTestId("roofs_remove_0"));
	
			expect(screen.queryByTestId("roofs_items")).toBeNull();
		});
	
		it("should only remove the roof object thats is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceRoofs: {
							data:[roof1, roof2, roof3],
						},
					},
				},
			});
	
			await renderSuspended(CeilingsAndRoofs);
			await user.click(screen.getByTestId("roofs_remove_1"));
	
			const populatedList = screen.getByTestId("roofs_items");
	
			expect(within(populatedList).getByText("Roof 1")).toBeDefined();
			expect(within(populatedList).getByText("Roof 3")).toBeDefined();
			expect(within(populatedList).queryByText("Roof 2")).toBeNull();
	
		});
	
		test("roof is duplicated when duplicate link is clicked", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceRoofs: {
							data:[roof1, roof2],
						},
					},
				},
			});
	
			await renderSuspended(CeilingsAndRoofs);
			await userEvent.click(screen.getByTestId("roofs_duplicate_0"));
			await userEvent.click(screen.getByTestId("roofs_duplicate_0"));
			await userEvent.click(screen.getByTestId("roofs_duplicate_2"));
			await userEvent.click(screen.getByTestId("roofs_duplicate_2"));
	
			expect(screen.queryAllByTestId("roofs_item").length).toBe(6);
			expect(screen.getByText("Roof 1")).toBeDefined();
			expect(screen.getByText("Roof 1 (1)")).toBeDefined();
			expect(screen.getByText("Roof 1 (2)")).toBeDefined();
			expect(screen.getByText("Roof 1 (1) (1)")).toBeDefined();
			expect(screen.getByText("Roof 1 (1) (2)")).toBeDefined();
		});
	});

	describe("mark section as complete", () => {
		const store = useEcaasStore();
		const user = userEvent.setup();
	
		mockNuxtImport("navigateTo", () => navigateToMock);
	
		const addCeilingsAndRoofsDataToStore = async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: { data: [{ ...ceiling1, complete: true }] },
						dwellingSpaceRoofs: { data: [{ ...roof1, complete: true }] },
					},
				},
			});
		};
	
		beforeEach(async () => {
			await addCeilingsAndRoofsDataToStore();
			await renderSuspended(CeilingsAndRoofs);
		});
	
		const getCeilingsAndRoofsData = async (action: string): Promise<{
			key: keyof CeilingsAndRoofsData,
			testId: string,
			form: Component,
			params: string,
		}[]> => ([
			{ key: "dwellingSpaceCeilings", testId: `ceilings_${action}_0`, form: CeilingForm, params: "ceiling" },
			{ key: "dwellingSpaceRoofs", testId: `roofs_${action}_0`, form: RoofForm, params: "roof" },
		]);
	
		type CeilingsAndRoofsType = keyof typeof store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
	
		it("marks ceilings and roofs as complete when mark section as complete button is clicked", async () => {
			expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			const completedStatusElement = screen.queryByTestId("completeSectionCompleted");
			expect(completedStatusElement?.style.display).toBe("none");
	
			await user.click(screen.getByTestId("completeSectionButton"));
	
			const { dwellingSpaceCeilings, dwellingSpaceRoofs } = store.dwellingFabric.dwellingSpaceCeilingsAndRoofs;
	
			expect(dwellingSpaceCeilings?.complete).toBe(true);
			expect(dwellingSpaceRoofs?.complete).toBe(true);
	
			expect(screen.queryByRole("button", { name: "Mark section as complete" })).toBeNull();
			expect(completedStatusElement?.style.display).not.toBe("none");
	
			expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric");
		});
	
		it("marks section as not complete when item is removed after marking complete", async () => {
			const data = await getCeilingsAndRoofsData("remove");
	
			for (const [key] of Object.entries(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs)) {
				const typedKey = key as CeilingsAndRoofsType;
	
				await user.click(screen.getByTestId("completeSectionButton"));
				expect(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs[typedKey]?.complete).toBe(true);
	
				const formData = data.find(d => d.key === typedKey);
				await user.click(screen.getByTestId(formData!.testId));
	
				expect(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs[typedKey]?.complete).toBe(false);
				expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			}
		});
	
		it("marks section as not complete when item is duplicated after marking complete", async () => {
			const data = await getCeilingsAndRoofsData("duplicate");
	
			for (const [key] of Object.entries(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs)) {
				const typedKey = key as CeilingsAndRoofsType;
	
				await user.click(screen.getByTestId("completeSectionButton"));
				expect(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs[typedKey]?.complete).toBe(true);
	
				const formData = data.find(d => d.key === typedKey);
				await user.click(screen.getByTestId(formData!.testId));
	
				expect(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs[typedKey]?.complete).toBe(false);
				expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			}
		});
	
		it("marks section as not complete after saving a new or edited item", async () => {
			const data = await getCeilingsAndRoofsData("");
	
			for (const [key] of Object.entries(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs)) {
				const typedKey = key as CeilingsAndRoofsType;
	
				await user.click(screen.getByTestId("completeSectionButton"));
				expect(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs[typedKey]?.complete).toBe(true);
	
				const ceilingAndRoofItem = data.find(d => d.key === typedKey);
				await renderSuspended(ceilingAndRoofItem?.form, {
					route: { params: { [ceilingAndRoofItem!.params]: "0" } },
				});
				await user.click(screen.getByTestId("saveAndComplete"));
	
				expect(store.dwellingFabric.dwellingSpaceCeilingsAndRoofs[typedKey]?.complete).toBe(false);
				await renderSuspended(CeilingsAndRoofs);
				expect(screen.getByRole("button", { name: "Mark section as complete" })).not.toBeNull();
			}
		});

		it("disables the mark section as complete button when item is incomplete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: {
							data: [{ data: { name: "Ceiling", surfaceArea: 20 }, complete: false }],
						},
					},
				},
			});

			await renderSuspended(CeilingsAndRoofs);
			const markAsCompleteButton = screen.getByRole("button", { name: "Mark section as complete" });
			expect(markAsCompleteButton.hasAttribute("disabled")).toBeTruthy();
		});

		test("an in-progress indicator is shown when an entry is not marked as complete", async () => {
			store.$patch({
				dwellingFabric: {
					dwellingSpaceCeilingsAndRoofs: {
						dwellingSpaceCeilings: {
							data: [ceiling1],
						},
					},
				},
			});

			await renderSuspended(CeilingsAndRoofs);

			expect(screen.getByTestId("ceilings_status_0").textContent).toBe(formStatus.inProgress.text);
		});
	});
});