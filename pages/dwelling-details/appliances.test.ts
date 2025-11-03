import Appliances from "./appliances.vue";
import { screen } from "@testing-library/vue";
import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { userEvent } from "@testing-library/user-event";

const navigateToMock = vi.hoisted(() => vi.fn());
mockNuxtImport("navigateTo", () => {
  return navigateToMock;
});
const appliancesState: AppliancesData = {
  applianceType: [
    "Hobs",
    "Oven",
    "Fridge",
    "Freezer",
    "Fridge-Freezer",
    "Dishwasher",
    "Clothes_washing",
    "Clothes_drying",
  ],
};

describe("Appliances", () => {
  const store = useEcaasStore();
  const user = userEvent.setup();

  afterEach(() => {
    store.$reset();
  });

  test("data is saved to store state when form is valid", async () => {
    await renderSuspended(Appliances);
    await user.click(screen.getByTestId("applianceType_Hobs"));
    await user.click(screen.getByTestId("applianceType_Oven"));
    await user.click(screen.getByTestId("applianceType_Fridge"));
    await user.click(screen.getByTestId("applianceType_Freezer"));
    await user.click(screen.getByTestId("applianceType_Fridge-Freezer"));
    await user.click(screen.getByTestId("applianceType_Dishwasher"));
    await user.click(screen.getByTestId("applianceType_Clothes_washing"));
    await user.click(screen.getByTestId("applianceType_Clothes_drying"));

    await user.click(screen.getByTestId("saveAndComplete"));

    const { data, complete } = store.dwellingDetails.appliances;

    expect(data).toEqual(appliancesState);
    expect(complete).toBe(true);
    expect(navigateToMock).toHaveBeenCalledWith("/dwelling-details");
  });

  test("updated form data is automatically saved to store", async () => {
    store.$patch({
      dwellingDetails: {
        appliances: {
          data: appliancesState,
          complete: true,
        },
      },
    });
    await renderSuspended(Appliances);

    await user.click(screen.getByTestId("applianceType_Fridge"));
    await user.click(screen.getByTestId("applianceType_Freezer"));
    await user.click(screen.getByTestId("applianceType_Fridge-Freezer"));
    await user.click(screen.getByTestId("applianceType_Dishwasher"));
    await user.click(screen.getByTestId("applianceType_Clothes_washing"));
    await user.click(screen.getByTestId("applianceType_Clothes_drying"));

    const { data, complete } = store.dwellingDetails.appliances;

    expect(data.applianceType).toEqual(["Hobs", "Oven"]);
    expect(complete).toBe(false);
  });

  test("required error message when user does not add a fridge or fridge freezer", async () => {
    await renderSuspended(Appliances);

    await user.click(screen.getByTestId("applianceType_Hobs"));
    await user.click(screen.getByTestId("saveAndComplete"));

    const errorSummary = await screen.findByTestId("appliancesErrorSummary");

    expect(
      errorSummary.textContent.includes("Fridge or Fridge freezer is required.")
    ).toBe(true);
  });

  test("error summary is displayed when an invalid form in submitted", async () => {
    await renderSuspended(Appliances);
    await user.click(screen.getByTestId("saveAndComplete"));

    expect(await screen.findByTestId("appliancesErrorSummary")).toBeDefined();
  });

  test("save progress button navigates user to the dwelling details overview page", async () => {
    await renderSuspended(Appliances);
    await user.click(screen.getByTestId("saveProgress"));

    expect(navigateToMock).toHaveBeenCalledWith(
      "/dwelling-details"
    );
  });
});
