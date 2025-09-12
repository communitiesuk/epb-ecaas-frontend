import { mockNuxtImport, renderSuspended } from "@nuxt/test-utils/runtime";
import HeatEmitting from "./index.vue";
import WetDistributionForm from "./wet-distribution/[distribution].vue";
import InstantElectricHeaterForm from "./instant-electric-heater/[heater].vue";
// import ElectricStorageHeaterForm from "./electric-storage-heater/[heater].vue";
// import WarmAirHeatPumpForm from "./warm-air-heat-pump/[pump].vue";

import { screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import formStatus from "~/constants/formStatus";

describe("heat emitting", () => {
  describe("wet distribution", async () => {
    const store = useEcaasStore();
    const user = userEvent.setup();

    const wetDistribution1 = {
      name: "Wet Distribution 1",
    };
    const wetDistribution2 = {
      name: "Wet Distribution 2",
    };
    const wetDistribution3 = {
      name: "Wet Distribution 3",
    };
    afterEach(() => {
      store.$reset();
    });

    it("should remove wet distribution when remove link is clicked", async () => {
      store.$patch({
        heatingSystems: {
          heatEmitting: {
            wetDistribution: {
              data: [wetDistribution1],
            },
          },
        },
      });
      await renderSuspended(HeatEmitting);
      expect(screen.getAllByTestId("wetDistribution_items")).toBeDefined();

      await user.click(screen.getByTestId("wetDistribution_remove_0"));
      expect(screen.queryByTestId("wetDistribution_items")).toBeNull();
    });

    it("should only remove the wet distribution that is clicked if there are multiple wet distributions", async () => {
      store.$patch({
        heatingSystems: {
          heatEmitting: {
            wetDistribution: {
              data: [wetDistribution1, wetDistribution2, wetDistribution3],
            },
          },
        },
      });
      await renderSuspended(HeatEmitting);
      await user.click(screen.getByTestId("wetDistribution_remove_1"));

      expect(screen.getByText("Wet Distribution 1")).toBeDefined();
      expect(screen.getByText("Wet Distribution 3")).toBeDefined();
      expect(screen.queryByText("Wet Distribution 2")).toBeNull();
    });

    it("should duplicate the correct wet distribution when duplicate link is clicked", async () => {
      store.$patch({
        heatingSystems: {
          heatEmitting: {
            wetDistribution: {
              data: [wetDistribution1, wetDistribution2],
            },
          },
        },
      });
      await renderSuspended(HeatEmitting);
      await userEvent.click(screen.getByTestId("wetDistribution_duplicate_0"));
      await userEvent.click(screen.getByTestId("wetDistribution_duplicate_0"));
      await userEvent.click(screen.getByTestId("wetDistribution_duplicate_2"));
      await userEvent.click(screen.getByTestId("wetDistribution_duplicate_2"));

      expect(screen.queryAllByTestId("wetDistribution_item").length).toBe(6);
      expect(screen.getByText("Wet Distribution 1")).toBeDefined();
      expect(screen.getByText("Wet Distribution 1 (1)")).toBeDefined();
      expect(screen.getByText("Wet Distribution 1 (2)")).toBeDefined();
      expect(screen.getByText("Wet Distribution 1 (1) (1)")).toBeDefined();
      expect(screen.getByText("Wet Distribution 1 (1) (2)")).toBeDefined();
    });
  });

  describe("instant electric heater", async () => {
    const store = useEcaasStore();
    const user = userEvent.setup();

    const instantElectricHeater1 = {
      data: {
        name: "Instant Electric Heater 1",
      },
    };
    const instantElectricHeater2 = {
      data: {
        name: "Instant Electric Heater 2",
      },
    };
    const instantElectricHeater3 = {
      data: {
        name: "Instant Electric Heater 3",
      },
    };

    it("should remove instant electric heater when remove link is clicked", async () => {
      store.$patch({
        heatingSystems: {
          heatEmitting: {
            instantElectricHeater: {
              data: [instantElectricHeater1],
            },
          },
        },
      });
      await renderSuspended(HeatEmitting);
      expect(
        screen.getAllByTestId("instantElectricHeater_items")
      ).toBeDefined();

      await user.click(screen.getByTestId("instantElectricHeater_remove_0"));
      expect(screen.queryByTestId("instantElectricHeater_items")).toBeNull();
    });

    it("should only remove the instant electric heater that is clicked if there are multiple instant electric heaters", async () => {
      store.$patch({
        heatingSystems: {
          heatEmitting: {
            instantElectricHeater: {
              data: [
                instantElectricHeater1,
                instantElectricHeater2,
                instantElectricHeater3,
              ],
            },
          },
        },
      });
      await renderSuspended(HeatEmitting);
      await user.click(screen.getByTestId("instantElectricHeater_remove_1"));

      expect(screen.getByText("Instant Electric Heater 1")).toBeDefined();
      expect(screen.getByText("Instant Electric Heater 3")).toBeDefined();
      expect(screen.queryByText("Instant Electric Heater 2")).toBeNull();
    });

    it("should duplicate the correct instant electric heater when duplicate link is clicked", async () => {
      store.$patch({
        heatingSystems: {
          heatEmitting: {
            instantElectricHeater: {
              data: [instantElectricHeater1, instantElectricHeater2],
            },
          },
        },
      });
      await renderSuspended(HeatEmitting);
      await userEvent.click(
        screen.getByTestId("instantElectricHeater_duplicate_0")
      );
      await userEvent.click(
        screen.getByTestId("instantElectricHeater_duplicate_0")
      );
      await userEvent.click(
        screen.getByTestId("instantElectricHeater_duplicate_2")
      );
      await userEvent.click(
        screen.getByTestId("instantElectricHeater_duplicate_2")
      );

      expect(screen.queryAllByTestId("instantElectricHeater_item").length).toBe(
        6
      );
      expect(screen.getByText("Instant Electric Heater 1")).toBeDefined();
      expect(screen.getByText("Instant Electric Heater 1 (1)")).toBeDefined();
      expect(screen.getByText("Instant Electric Heater 1 (2)")).toBeDefined();
      expect(
        screen.getByText("Instant Electric Heater 1 (1) (1)")
      ).toBeDefined();
      expect(
        screen.getByText("Instant Electric Heater 1 (1) (2)")
      ).toBeDefined();
    });

    it("should display an in-progress indicator when an entry is not marked as complete", async () => {
      store.$patch({
        heatingSystems: {
          heatEmitting: {
            instantElectricHeater: {
              data: [
                {
                  data: {
                    name: "Instant electric heater",
                  },
                },
              ],
            },
          },
        },
      });

      await renderSuspended(HeatEmitting);

      expect(
        screen.getByTestId("instantElectricHeater_status_0").textContent
      ).toBe(formStatus.inProgress.text);
    });

    it("should display a complete indicator when an entry is marked as complete", async () => {
      store.$patch({
        heatingSystems: {
          heatEmitting: {
            instantElectricHeater: {
              data: [
                {
                  data: {
                    name: "Instant electric heater",
                    ratedPower: 10,
                    convectionFractionInstant: 0.5,
                  },
                  complete: true,
                },
              ],
            },
          },
        },
      });

      await renderSuspended(HeatEmitting);

      expect(
        screen.getByTestId("instantElectricHeater_status_0").textContent
      ).toBe(formStatus.complete.text);
    });
  });

  // describe("electric storage heater", async () => {
  // 	const store = useEcaasStore();
  // 	const user = userEvent.setup();

  // 	const storageHeater1 = {
  // 		name: "Storage heater 1",
  // 	};
  // 	const storageHeater2 = {
  // 		name: "Storage heater 2",
  // 	};
  // 	const storageHeater3 = {
  // 		name: "Storage heater 3",
  // 	};
  // 	afterEach(() => {
  // 		store.$reset();
  // 	});

  // 	it("should remove electric storage heater when remove link is clicked", async () => {
  // 		store.$patch({
  // 			heatingSystems: {
  // 				heatEmitting: {
  // 					electricStorageHeater: {
  // 						data: [storageHeater1],
  // 					},
  // 				},
  // 			},
  // 		});
  // 		await renderSuspended(HeatEmitting);
  // 		expect(
  // 			screen.getAllByTestId("electricStorageHeater_items")
  // 		).toBeDefined();

  // 		await user.click(screen.getByTestId("electricStorageHeater_remove_0"));
  // 		expect(screen.queryByTestId("electricStorageHeater_items")).toBeNull();
  // 	});

  // 	it("should only remove the heater thats is clicked if there are multiple heaters", async () => {
  // 		store.$patch({
  // 			heatingSystems: {
  // 				heatEmitting: {
  // 					electricStorageHeater: {
  // 						data: [storageHeater1, storageHeater2, storageHeater3],
  // 					},
  // 				},
  // 			},
  // 		});
  // 		await renderSuspended(HeatEmitting);
  // 		await user.click(screen.getByTestId("electricStorageHeater_remove_1"));

  // 		expect(screen.getByText("Storage heater 1")).toBeDefined();
  // 		expect(screen.getByText("Storage heater 3")).toBeDefined();
  // 		expect(screen.queryByText("Storage heater 2")).toBeNull();
  // 	});
  // 	it("should duplicate the correct heater when duplicate link is clicked", async () => {
  // 		store.$patch({
  // 			heatingSystems: {
  // 				heatEmitting: {
  // 					electricStorageHeater: {
  // 						data: [storageHeater1, storageHeater2],
  // 					},
  // 				},
  // 			},
  // 		});
  // 		await renderSuspended(HeatEmitting);
  // 		await userEvent.click(
  // 			screen.getByTestId("electricStorageHeater_duplicate_0")
  // 		);
  // 		await userEvent.click(
  // 			screen.getByTestId("electricStorageHeater_duplicate_0")
  // 		);
  // 		await userEvent.click(
  // 			screen.getByTestId("electricStorageHeater_duplicate_2")
  // 		);
  // 		await userEvent.click(
  // 			screen.getByTestId("electricStorageHeater_duplicate_2")
  // 		);

  // 		expect(screen.queryAllByTestId("electricStorageHeater_item").length).toBe(
  // 			6
  // 		);
  // 		expect(screen.getByText("Storage heater 1")).toBeDefined();
  // 		expect(screen.getByText("Storage heater 1 (1)")).toBeDefined();
  // 		expect(screen.getByText("Storage heater 1 (2)")).toBeDefined();
  // 		expect(screen.getByText("Storage heater 1 (1) (1)")).toBeDefined();
  // 		expect(screen.getByText("Storage heater 1 (1) (2)")).toBeDefined();
  // 	});
  // });
  // describe("warm air heat pump", async () => {
  // 	const store = useEcaasStore();
  // 	const user = userEvent.setup();

  // 	const warmAirHeatPump1 = {
  // 		name: "Warm Air Heat Pump 1",
  // 	};
  // 	const warmAirHeatPump2 = {
  // 		name: "Warm Air Heat Pump 2",
  // 	};
  // 	const warmAirHeatPump3 = {
  // 		name: "Warm Air Heat Pump 3",
  // 	};
  // 	afterEach(() => {
  // 		store.$reset();
  // 	});
  // 	it("should remove warm air heat pump when remove link is clicked", async () => {
  // 		store.$patch({
  // 			heatingSystems: {
  // 				heatEmitting: {
  // 					warmAirHeatPump: {
  // 						data: [warmAirHeatPump1],
  // 					},
  // 				},
  // 			},
  // 		});
  // 		await renderSuspended(HeatEmitting);
  // 		expect(screen.getAllByTestId("warmAirHeatPump_items")).toBeDefined();

  // 		await user.click(screen.getByTestId("warmAirHeatPump_remove_0"));
  // 		expect(screen.queryByTestId("warmAirHeatPump_items")).toBeNull();
  // 	});

  // 	it("should only remove the heat pump that is clicked if there are multiple heat pumps", async () => {
  // 		store.$patch({
  // 			heatingSystems: {
  // 				heatEmitting: {
  // 					warmAirHeatPump: {
  // 						data: [warmAirHeatPump1, warmAirHeatPump2, warmAirHeatPump3],
  // 					},
  // 				},
  // 			},
  // 		});
  // 		await renderSuspended(HeatEmitting);
  // 		await user.click(screen.getByTestId("warmAirHeatPump_remove_1"));

  // 		expect(screen.getByText("Warm Air Heat Pump 1")).toBeDefined();
  // 		expect(screen.getByText("Warm Air Heat Pump 3")).toBeDefined();
  // 		expect(screen.queryByText("Warm Air Heat Pump 2")).toBeNull();
  // 	});

  // 	it("should duplicate the correct heat pump when duplicate link is clicked", async () => {
  // 		store.$patch({
  // 			heatingSystems: {
  // 				heatEmitting: {
  // 					warmAirHeatPump: {
  // 						data: [warmAirHeatPump1, warmAirHeatPump2],
  // 					},
  // 				},
  // 			},
  // 		});
  // 		await renderSuspended(HeatEmitting);
  // 		await userEvent.click(screen.getByTestId("warmAirHeatPump_duplicate_0"));
  // 		await userEvent.click(screen.getByTestId("warmAirHeatPump_duplicate_0"));
  // 		await userEvent.click(screen.getByTestId("warmAirHeatPump_duplicate_2"));
  // 		await userEvent.click(screen.getByTestId("warmAirHeatPump_duplicate_2"));

  // 		expect(screen.queryAllByTestId("warmAirHeatPump_item").length).toBe(6);
  // 		expect(screen.getByText("Warm Air Heat Pump 1")).toBeDefined();
  // 		expect(screen.getByText("Warm Air Heat Pump 1 (1)")).toBeDefined();
  // 		expect(screen.getByText("Warm Air Heat Pump 1 (2)")).toBeDefined();
  // 		expect(screen.getByText("Warm Air Heat Pump 1 (1) (1)")).toBeDefined();
  // 		expect(screen.getByText("Warm Air Heat Pump 1 (1) (2)")).toBeDefined();
  // 	});
  // });
  describe("mark section as complete", () => {
    const store = useEcaasStore();
    const user = userEvent.setup();

    const navigateToMock = vi.hoisted(() => vi.fn());
    mockNuxtImport("navigateTo", () => {
      return navigateToMock;
    });
    const wetDistribution1: WetDistributionData = {
      name: "Wet distribution 1",
      heatSource: "463c94f6-566c-49b2-af27-57e5c68b5c30",
      thermalMass: 2,
      designTempDiffAcrossEmitters: 0.4,
      designFlowTemp: 32,
      designFlowRate: 4,
      typeOfSpaceHeater: "radiator",
      exponent: 1.3,
      constant: 0.08,
      convectionFractionWet: 0.2,
      ecoDesignControllerClass: "1",
      minimumFlowTemp: 20,
      minOutdoorTemp: 0,
      maxOutdoorTemp: 15,
      numberOfRadiators: 1,
    };
    const instantElectricHeater1 = {
      data: {
        name: "Instant Electric Heater 1",
        ratedPower: 30,
        convectionFractionInstant: 1,
      },
      complete: true,
    };
    const addHeatEmittingDataToStore = async () => {
      store.$patch({
        heatingSystems: {
          heatEmitting: {
            wetDistribution: { data: [wetDistribution1] },
            instantElectricHeater: { data: [instantElectricHeater1] },
            // electricStorageHeater: { data: [{ name: "storage 1" }] },
            // warmAirHeatPump: { data: [{ name: "warm air 1" }] },
          },
          heatGeneration: {
            heatPump: {
              data: [
                {
                  data: {
                    id: "463c94f6-566c-49b2-af27-57e5c68b5c30",
                    name: "Heat pump 1",
                  },
                },
              ],
            },
          },
        },
      });
    };

    beforeEach(async () => {
      await addHeatEmittingDataToStore();
      await renderSuspended(HeatEmitting);
    });

    const getEmittersData = async (action: string) => {
      return [
        {
          key: "wetDistribution",
          testId: `wetDistribution_${action}_0`,
          form: WetDistributionForm,
          params: "distribution",
        },
        {
          key: "instantElectricHeater",
          testId: `instantElectricHeater_${action}_0`,
          form: InstantElectricHeaterForm,
          params: "heater",
        },
        // {
        // 	key: "electricStorageHeater",
        // 	testId: `electricStorageHeater_${action}_0`,
        // 	form: ElectricStorageHeaterForm,
        // 	params: "heater"
        // },
        // {
        // 	key: "warmAirHeatPump",
        // 	testId: `warmAirHeatPump_${action}_0`,
        // 	form: WarmAirHeatPumpForm,
        // 	params: "pump"
        // },
      ];
    };

    type HeatEmittingType = keyof typeof store.heatingSystems.heatEmitting;

    it("disables the mark section as complete button when emitter is incomplete", async () => {
      store.$patch({
        heatingSystems: {
          heatEmitting: {
            instantElectricHeater: {
              data: [
                {
                  data: {
                    name: "Instant Electric Heater 1",
                    ratedPower: 30,
                  },
                  complete: false,
                },
              ],
            },
          },
        },
      });

      await renderSuspended(HeatEmitting);
      const markAsCompleteButton = screen.getByRole("button", {
        name: "Mark section as complete",
      });
      expect(markAsCompleteButton.hasAttribute("disabled")).toBeTruthy();
    });

    it("marks heat emitting section as complete when button is clicked", async () => {
      expect(
        screen.getByRole("button", { name: "Mark section as complete" })
      ).not.toBeNull();
      const completedStatusElement = screen.queryByTestId(
        "completeSectionCompleted"
      );
      expect(completedStatusElement?.style.display).toBe("none");

      await user.click(screen.getByTestId("markAsCompleteButton"));

      const {
        wetDistribution,
        instantElectricHeater,
        electricStorageHeater,
        warmAirHeatPump,
      } = store.heatingSystems.heatEmitting;

      expect(wetDistribution?.complete).toBe(true);
      expect(instantElectricHeater?.complete).toBe(true);
      expect(electricStorageHeater?.complete).toBe(true);
      expect(warmAirHeatPump?.complete).toBe(true);
      expect(
        screen.queryByRole("button", { name: "Mark section as complete" })
      ).toBeNull();
      expect(completedStatusElement?.style.display).not.toBe("none");

      expect(navigateToMock).toHaveBeenCalledWith("/heating-systems");
    });

    it("marks as not complete if an item is removed after marking complete", async () => {
      const emitters = await getEmittersData("remove");

      for (const [key] of Object.entries(store.heatingSystems.heatEmitting)) {
        const typedKey = key as HeatEmittingType;

        await user.click(screen.getByTestId("markAsCompleteButton"));
        expect(store.heatingSystems.heatEmitting[typedKey]?.complete).toBe(
          true
        );

        const emitterData = emitters.find((e) => e.key === typedKey);
        if (!emitterData) {
          continue;
        }
        await user.click(screen.getByTestId(emitterData.testId));
        expect(store.heatingSystems.heatEmitting[typedKey]?.complete).toBe(
          false
        );
        expect(
          screen.getByRole("button", { name: "Mark section as complete" })
        ).not.toBeNull();
      }
    });

    it("marks as not complete if an item is duplicated after marking complete", async () => {
      const emitters = await getEmittersData("duplicate");

      for (const [key] of Object.entries(store.heatingSystems.heatEmitting)) {
        const typedKey = key as HeatEmittingType;

        await user.click(screen.getByTestId("markAsCompleteButton"));
        expect(store.heatingSystems.heatEmitting[typedKey]?.complete).toBe(
          true
        );

        const emitterData = emitters.find((e) => e.key === typedKey);
        if (!emitterData) {
          continue;
        }
        await user.click(screen.getByTestId(emitterData.testId));
        expect(store.heatingSystems.heatEmitting[typedKey]?.complete).toBe(
          false
        );
        expect(
          screen.getByRole("button", { name: "Mark section as complete" })
        ).not.toBeNull();
      }
    });

    it("marks as not complete after saving a new or edited emitter item", async () => {
      for (const [key] of Object.entries(store.heatingSystems.heatEmitting)) {
        const emitters = await getEmittersData("");
        const typedKey = key as HeatEmittingType;

        await user.click(screen.getByTestId("markAsCompleteButton"));
        expect(store.heatingSystems.heatEmitting[typedKey]?.complete).toBe(
          true
        );

        const emitterData = emitters.find((e) => e.key === typedKey);
        if (!emitterData) {
          continue;
        }
        const params: string = emitterData.params;
        await renderSuspended(emitterData?.form, {
          route: {
            params: { [params]: "0" },
          },
        });
        await user.click(screen.getByTestId("saveAndComplete"));

        expect(store.heatingSystems.heatEmitting[typedKey].complete).toBe(
          false
        );

        await renderSuspended(HeatEmitting);
        expect(
          screen.getByRole("button", { name: "Mark section as complete" })
        ).not.toBeNull();
      }
    });
  });
});
