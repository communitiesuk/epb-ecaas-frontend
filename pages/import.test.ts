import { renderSuspended } from "@nuxt/test-utils/runtime";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/vue";
import Import from "./import.vue";

describe("import page", () => {
	let store: ReturnType<typeof useEcaasStore>;

	beforeEach(() => {
		// GOV.UK Frontend emits a warning when trying to initialise components without this class 
		// we manually add this here to parralell what the real app does (set in nuxt.config.ts in the real app)
		document.body.classList.add("govuk-frontend-supported");

		store = useEcaasStore();
		store.$patch({
			...getInitialState(),
		});
	});

	afterEach(() => {
		document.body.classList.remove("govuk-frontend-supported");
		store.$reset();
	});

	const goodFileName = "exported-form.json";

	const goodFile = new File(
		['{"dwellingDetails":{"generalSpecifications":{"data":{"typeOfDwelling":"house","storeysInDwelling":2,"numOfBedrooms":3,"coolingRequired":true},"typeOfDwelling":"house","storeysInDwelling":2,"numOfBedrooms":3,"coolingRequired":true,"complete":true},"shading":{"data":[]},"externalFactors":{"data":{}}},"infiltrationAndVentilation":{"mechanicalVentilation":{"data":[]},"ductwork":{"data":[]},"vents":{"data":[]},"combustionAppliances":{"open_fireplace":{"data":[]},"closed_with_fan":{"data":[]},"open_gas_flue_balancer":{"data":[]},"open_gas_kitchen_stove":{"data":[]},"open_gas_fire":{"data":[]},"closed_fire":{"data":[]}},"naturalVentilation":{"data":{}},"airPermeability":{"data":{}}},"domesticHotWater":{"waterHeating":{"hotWaterCylinder":{"data":[]},"immersionHeater":{"data":[]},"solarThermal":{"data":[]},"pointOfUse":{"data":[]},"heatPump":{"data":[]},"combiBoiler":{"data":[]},"heatBattery":{"data":[]},"smartHotWaterTank":{"data":[]},"heatInterfaceUnit":{"data":[]}},"hotWaterOutlets":{"mixedShower":{"data":[]},"electricShower":{"data":[]},"bath":{"data":[]},"otherOutlets":{"data":[]}},"pipework":{"primaryPipework":{"data":[]},"secondaryPipework":{"data":[]}},"wwhrs":{"data":[]}},"dwellingFabric":{"dwellingSpaceFloors":{"dwellingSpaceGroundFloor":{"data":[]},"dwellingSpaceInternalFloor":{"data":[]},"dwellingSpaceExposedFloor":{"data":[]}},"dwellingSpaceWalls":{"dwellingSpaceExternalWall":{"data":[]},"dwellingSpaceInternalWall":{"data":[]},"dwellingSpaceWallToUnheatedSpace":{"data":[]},"dwellingSpacePartyWall":{"data":[]}},"dwellingSpaceCeilingsAndRoofs":{"dwellingSpaceCeilings":{"data":[]},"dwellingSpaceRoofs":{"data":[]},"dwellingSpaceUnheatedPitchedRoofs":{"data":[]}},"dwellingSpaceDoors":{"dwellingSpaceExternalUnglazedDoor":{"data":[]},"dwellingSpaceExternalGlazedDoor":{"data":[]},"dwellingSpaceInternalDoor":{"data":[]}},"dwellingSpaceWindows":{"data":[]},"dwellingSpaceThermalBridging":{"dwellingSpaceLinearThermalBridges":{"data":[]},"dwellingSpacePointThermalBridges":{"data":[]}},"dwellingSpaceZoneParameters":{"data":{}}},"spaceHeating":{"heatGeneration":{"heatPump":{"data":[]},"boiler":{"data":[]},"heatBattery":{"data":[]},"heatNetwork":{"data":[]},"heatInterfaceUnit":{"data":[]}},"energySupply":{"data":{}},"heatEmitting":{"wetDistribution":{"data":[]},"instantElectricHeater":{"data":[]},"electricStorageHeater":{"data":[]},"warmAirHeatPump":{"data":[]}}},"pvAndBatteries":{"pvSystem":{"data":[]},"electricBattery":{"data":[]}},"cooling":{"airConditioning":{"data":[]}}}'],
		goodFileName,
		{ type: "application/json" },
	);

	const badFile = new File(
		["i am not a valid JSON file"],
		"nonjson.json",
		{ type: "application/json" },
	);

	const user = userEvent.setup();

	const renderAndUploadFile = async (file: File) => {
		await renderSuspended(Import);

		// GOV.UK Frontend hides the native input, renames its id to "<id>-input" and points the label at its own button
		expect(screen.getByLabelText("Upload a JSON file").tagName).toBe("BUTTON");
		const input = document.getElementById("import-input")!;

		return user.upload(input, file);
	};

	it("merges the file contents into the store if the file is good", async () => {
		await renderAndUploadFile(goodFile);

		await user.click(screen.getByTestId("import-button"));

		await waitFor(() => expect(store.dwellingDetails.generalSpecifications.data.typeOfDwelling).toBe("house"), { timeout: 500 });
	});

	it("shows error message if import is bad", async () => {
		await renderAndUploadFile(badFile);

		await user.click(screen.getByTestId("import-button"));

		await screen.findByText("The provided file is not recognised as containing JSON.");
	});
});