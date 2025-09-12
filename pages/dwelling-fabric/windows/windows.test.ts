import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import Windows from "./index.vue";
import WindowsForm from "./[window].vue";
import { screen } from "@testing-library/vue";
import { within } from "@testing-library/dom";
import formStatus from "~/constants/formStatus";

describe("windows", () => {
  const store = useEcaasStore();
  const user = userEvent.setup();
  const navigateToMock = vi.hoisted(() => vi.fn());

  mockNuxtImport("navigateTo", () => {
    return navigateToMock;
  });

  afterEach(() => {
    store.$reset();
  });

  const window1: EcaasForm<WindowData> = {
    data: {
      name: "Window 1",
      orientation: 1,
      surfaceArea: 1,
      height: 1,
      width: 1,
      uValue: 1,
      pitchOption: "90",
      pitch: 90,
      solarTransmittance: 0.1,
      elevationalHeight: 1,
      midHeight: 1,
      numberOpenableParts: "0",
      openingToFrameRatio: 0.2,
      curtainsOrBlinds: false,
    },
    complete: true,
  };

  const window2: EcaasForm<WindowData> = {
    data: {
      ...window1.data,
      name: "Window 2",
    },
    complete: true,
  };

  const window3: EcaasForm<WindowData> = {
    data: {
      ...window1.data,
      name: "Window 3",
    },
    complete: true,
  };

  test("window is removed when remove link is clicked", async () => {
    store.$patch({
      dwellingFabric: {
        dwellingSpaceWindows: {
          data: [window1],
        },
      },
    });

    await renderSuspended(Windows);

    expect(screen.getAllByTestId("windows_items")).toBeDefined();

    await user.click(screen.getByTestId("windows_remove_0"));

    expect(screen.queryByTestId("windows_items")).toBeNull();
  });

  test("should only remove the window object thats is clicked", async () => {
    store.$patch({
      dwellingFabric: {
        dwellingSpaceWindows: {
          data: [window1, window2, window3],
        },
      },
    });

    await renderSuspended(Windows);
    await user.click(screen.getByTestId("windows_remove_1"));

    const populatedList = screen.getByTestId("windows_items");

    expect(within(populatedList).getByText("Window 1")).toBeDefined();
    expect(within(populatedList).getByText("Window 3")).toBeDefined();
    expect(within(populatedList).queryByText("Window 2")).toBeNull();
  });

  test("window is duplicated when duplicate link is clicked", async () => {
    store.$patch({
      dwellingFabric: {
        dwellingSpaceWindows: {
          data: [window1, window2],
        },
      },
    });

    await renderSuspended(Windows);
    await userEvent.click(screen.getByTestId("windows_duplicate_0"));
    await userEvent.click(screen.getByTestId("windows_duplicate_0"));
    await userEvent.click(screen.getByTestId("windows_duplicate_2"));
    await userEvent.click(screen.getByTestId("windows_duplicate_2"));

    expect(screen.queryAllByTestId("windows_item").length).toBe(6);
    expect(screen.getByText("Window 1")).toBeDefined();
    expect(screen.getByText("Window 1 (1)")).toBeDefined();
    expect(screen.getByText("Window 1 (2)")).toBeDefined();
    expect(screen.getByText("Window 1 (1) (1)")).toBeDefined();
    expect(screen.getByText("Window 1 (1) (2)")).toBeDefined();
  });

  test("disables the mark section as complete button when window element is incomplete", async () => {
    store.$patch({
      dwellingFabric: {
        dwellingSpaceWindows: {
          data: [{ data: { ...window1.data }, complete: false }],
        },
      },
    });

    await renderSuspended(Windows);
    expect(
      screen.getByRole("button", { name: "Mark section as complete" })
    ).not.toBeNull();
  });

  test("marks windows as complete when mark section as complete button is clicked", async () => {
    await renderSuspended(Windows);
    expect(
      screen.getByRole("button", { name: "Mark section as complete" })
    ).not.toBeNull();

    const completedStatusElement = screen.queryByTestId(
      "completeSectionCompleted"
    );
    expect(completedStatusElement?.style.display).toBe("none");

    await user.click(screen.getByTestId("markAsCompleteButton"));

    const { complete } = store.dwellingFabric.dwellingSpaceWindows;

    expect(complete).toBe(true);
    expect(
      screen.queryByRole("button", { name: "Mark section as complete" })
    ).toBeNull();
    expect(completedStatusElement?.style.display).not.toBe("none");

    expect(navigateToMock).toHaveBeenCalledWith("/dwelling-fabric");
  });

  test("marks windows as not complete when complete button is clicked then user removes an item", async () => {
    store.$patch({
      dwellingFabric: {
        dwellingSpaceWindows: {
          data: [window1, window2],
        },
      },
    });

    await renderSuspended(Windows);
    await user.click(screen.getByTestId("markAsCompleteButton"));

    expect(store.dwellingFabric.dwellingSpaceWindows.complete).toBe(true);

    await user.click(screen.getByTestId("windows_remove_0"));

    expect(store.dwellingFabric.dwellingSpaceWindows.complete).toBe(false);
    expect(
      screen.getByRole("button", { name: "Mark section as complete" })
    ).not.toBeNull();
  });

  test("marks windows as not complete when complete button is clicked then user duplicates an item", async () => {
    store.$patch({
      dwellingFabric: {
        dwellingSpaceWindows: {
          data: [window1],
        },
      },
    });

    await renderSuspended(Windows);
    await user.click(screen.getByTestId("markAsCompleteButton"));

    expect(store.dwellingFabric.dwellingSpaceWindows.complete).toBe(true);

    await user.click(screen.getByTestId("windows_duplicate_0"));

    expect(store.dwellingFabric.dwellingSpaceWindows.complete).toBe(false);
    expect(
      screen.getByRole("button", { name: "Mark section as complete" })
    ).not.toBeNull();
  });

  test("marks windows as not complete when user saves a new or edited form after marking section as complete", async () => {
    store.$patch({
      dwellingFabric: {
        dwellingSpaceWindows: {
          data: [window1],
        },
      },
    });

    await renderSuspended(Windows);
    await user.click(screen.getByTestId("markAsCompleteButton"));
    expect(store.dwellingFabric.dwellingSpaceWindows.complete).toBe(true);

    await renderSuspended(WindowsForm, {
      route: {
        params: { window: "0" },
      },
    });
    await user.clear(screen.getByTestId("name"));
    await user.type(screen.getByTestId("name"), "Updated window");
    await user.tab();
    await user.click(screen.getByTestId("saveAndComplete"));
    expect(store.dwellingFabric.dwellingSpaceWindows.complete).toBe(false);

    await renderSuspended(Windows);
    expect(
      screen.getByRole("button", { name: "Mark section as complete" })
    ).not.toBeNull();
  });

  test("marks windows as not complete when window item is complete, then user adds another window item and makes first edit", async () => {
    store.$patch({
      dwellingFabric: {
        dwellingSpaceWindows: {
          data: [window1],
          complete: true,
        },
      },
    });

    await renderSuspended(WindowsForm, {
      route: {
        params: { window: "create" },
      },
    });
    await user.type(screen.getByTestId("name"), "Window 2");
    await user.tab();
    expect(store.dwellingFabric.dwellingSpaceWindows.complete).toBe(false);
  });

  test("should display an in-progress indicator when an entry is not marked as complete", async () => {
    store.$patch({
      dwellingFabric: {
        dwellingSpaceWindows: {
          data: [{ data: { ...window1.data }, complete: false }],
        },
      },
    });

    await renderSuspended(Windows);

    expect(screen.getByTestId("windows_status_0").textContent).toBe(
      formStatus.inProgress.text
    );
  });

  test("should display a complete indicator when an entry is marked as complete", async () => {
    store.$patch({
      dwellingFabric: {
        dwellingSpaceWindows: {
          data: [window1],
        },
      },
    });

    await renderSuspended(Windows);

    expect(screen.getByTestId("windows_status_0").textContent).toBe(
      formStatus.complete.text
    );
  });

  test("should navigate to the dwelling fabric overview page when return to overview is clicked", async () => {
    await renderSuspended(Windows);

    const returnToOverviewButton = screen.getByRole("button", {
      name: "Return to dwelling fabric",
    });
    expect(returnToOverviewButton.getAttribute("href")).toBe(
      "/dwelling-fabric"
    );
  });
});
