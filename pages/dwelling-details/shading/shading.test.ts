import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/vue";
import { within } from "@testing-library/dom";
import Shading from "./index.vue";
import ShadingForm from "./[shading].vue";

import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import { ShadingObjectType } from "~/schema/api-schema.types";
import formStatus from "~/constants/formStatus";

describe("shading", () => {
  const store = useEcaasStore();
  const user = userEvent.setup();

  const navigateToMock = vi.hoisted(() => vi.fn());
  mockNuxtImport("navigateTo", () => {
    return navigateToMock;
  });
  const shading1: EcaasForm<ShadingData> = {
    data: {
      name: "Cherry Tree",
      startAngle: 10,
      endAngle: 20,
      objectType: ShadingObjectType.obstacle,
      height: 3,
      distance: 2,
    },
  };

  const shading2: EcaasForm<ShadingData> = {
    data: {
      ...shading1.data,
      name: "Apple Tree",
    },
  };

  const shading3: EcaasForm<ShadingData> = {
    data: {
      ...shading1.data,
      name: "Cherry Tree out front",
    },
  };

  afterEach(() => {
    store.$reset();
  });

  test("shading is removed when remove link is clicked", async () => {
    store.$patch({
      dwellingDetails: {
        shading: {
          data: [shading1],
        },
      },
    });

    await renderSuspended(Shading);

    expect(screen.getAllByTestId("shading_items")).toBeDefined();

    await user.click(screen.getByTestId("shading_remove_0"));

    expect(screen.queryByTestId("shading_items")).toBeNull();
    expect(store.dwellingDetails.shading.complete).toBe(false);
  });

  test("only second shading object is removed when corresponding remove link is clicked", async () => {
    store.$patch({
      dwellingDetails: {
        shading: {
          data: [shading1, shading2],
        },
      },
    });

    await renderSuspended(Shading);
    await user.click(screen.getByTestId("shading_remove_1"));

    const populatedList = screen.getByTestId("shading_items");
    expect(within(populatedList).getByText("Cherry Tree")).toBeDefined();
    expect(within(populatedList).queryByText("Apple Tree")).toBeNull();
  });

  test("shading is duplicated when duplicate link is clicked", async () => {
    store.$patch({
      dwellingDetails: {
        shading: {
          data: [shading1, shading3],
        },
      },
    });

    await renderSuspended(Shading);

    await user.click(screen.getByTestId("shading_duplicate_0"));
    await user.click(screen.getByTestId("shading_duplicate_0"));
    await user.click(screen.getByTestId("shading_duplicate_2"));
    await user.click(screen.getByTestId("shading_duplicate_2"));

    expect(screen.queryAllByTestId("shading_item").length).toBe(6);
    expect(screen.getByText("Cherry Tree")).toBeDefined();
    expect(screen.getByText("Cherry Tree (1)")).toBeDefined();
    expect(screen.getByText("Cherry Tree (2)")).toBeDefined();
    expect(screen.getByText("Cherry Tree (1) (1)")).toBeDefined();
    expect(screen.getByText("Cherry Tree (1) (2)")).toBeDefined();
  });

  it("disables the mark section as complete button when shading element is incomplete", async () => {
    store.$patch({
      dwellingDetails: {
        shading: {
          data: [
            {
              data: {
                name: "Shading 1",
                startAngle: 10,
              },
              complete: false,
            },
          ],
        },
      },
    });

    await renderSuspended(Shading);
    const markAsCompleteButton = screen.getByRole("button", {
      name: "Mark section as complete",
    });
    expect(markAsCompleteButton.hasAttribute("disabled")).toBeTruthy();
  });

  it("marks shading as complete when mark section as complete button is clicked", async () => {
    await renderSuspended(Shading);

    expect(
      screen.getByRole("button", { name: "Mark section as complete" })
    ).not.toBeNull();

    const completedStatusElement = screen.queryByTestId(
      "completeSectionCompleted"
    );
    expect(completedStatusElement?.style.display).toBe("none");

    await user.click(screen.getByTestId("markAsCompleteButton"));

    const { complete } = store.dwellingDetails.shading;

    expect(complete).toBe(true);
    expect(
      screen.queryByRole("button", { name: "Mark section as complete" })
    ).toBeNull();
    expect(completedStatusElement?.style.display).not.toBe("none");

    expect(navigateToMock).toHaveBeenCalledWith("/dwelling-details");
  });

  it("marks shading as not complete when complete button is clicked then user removes a shading item", async () => {
    store.$patch({
      dwellingDetails: {
        shading: {
          data: [
            {
              data: { ...shading1.data },
              complete: true,
            },
            {
              data: { ...shading2.data },
              complete: true,
            },
          ],
        },
      },
    });

    await renderSuspended(Shading);

    await user.click(screen.getByTestId("markAsCompleteButton"));
    expect(store.dwellingDetails.shading.complete).toBe(true);

    await user.click(screen.getByTestId("shading_remove_0"));
    expect(store.dwellingDetails.shading.complete).toBe(false);
    expect(
      screen.getByRole("button", { name: "Mark section as complete" })
    ).not.toBeNull();
  });

  it("marks shading as not complete when complete button is clicked then user duplicates a shading item", async () => {
    store.$patch({
      dwellingDetails: {
        shading: {
          data: [
            {
              data: { ...shading1.data },
              complete: true,
            },
          ],
        },
      },
    });

    await renderSuspended(Shading);
    await user.click(screen.getByTestId("markAsCompleteButton"));
    expect(store.dwellingDetails.shading.complete).toBe(true);

    await user.click(screen.getByTestId("shading_duplicate_0"));
    expect(store.dwellingDetails.shading.complete).toBe(false);
    expect(
      screen.getByRole("button", { name: "Mark section as complete" })
    ).not.toBeNull();
  });

  it("marks shading as not complete when user saves a new or edited form after marking section as complete", async () => {
    store.$patch({
      dwellingDetails: {
        shading: {
          data: [
            {
              data: { ...shading1.data },
              complete: true,
            },
          ],
          complete: true,
        },
      },
    });

    await renderSuspended(Shading);
    await user.click(screen.getByTestId("markAsCompleteButton"));

    await renderSuspended(ShadingForm, {
      route: {
        params: { shading: "0" },
      },
    });

    await user.clear(screen.getByTestId("name"));
    await user.type(screen.getByTestId("name"), "Cherry tree edited");
    await user.tab();
    await user.click(screen.getByTestId("saveAndComplete"));

    const { complete } = store.dwellingDetails.shading;
    expect(complete).toBe(false);

    await renderSuspended(Shading);
    expect(
      screen.getByRole("button", { name: "Mark section as complete" })
    ).not.toBeNull();
  });

  it("should display an in-progress indicator when an entry is not marked as complete", async () => {
    store.$patch({
      dwellingDetails: {
        shading: {
          data: [
            {
              data: { name: "Shading 1" },
            },
          ],
        },
      },
    });

    await renderSuspended(Shading);

    expect(screen.getByTestId("shading_status_0").textContent).toBe(
      formStatus.inProgress.text
    );
  });

  it("should display a complete indicator when an entry is marked as complete", async () => {
    store.$patch({
      dwellingDetails: {
        shading: {
          data: [
            {
              ...shading1,
              complete: true,
            },
          ],
        },
      },
    });

    await renderSuspended(Shading);

    expect(screen.getByTestId("shading_status_0").textContent).toBe(
      formStatus.complete.text
    );
  });
});
