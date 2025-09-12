import { WindowTreatmentControl, WindowTreatmentType } from "~/schema/api-schema.types";
import { windowDataZod } from "./ecaasStore.schema";

describe("windowData Zod schema", () => {
	it("correctly validates a valid window shape with one openable part", () => {
		const windowFormData: WindowData = {
			name: "bedroom window",
			orientation: 90,
			surfaceArea: 4,
			height: 2,
			width: 2,
			uValue: 0.1,
			pitchOption: "90",
			pitch: 90,
			solarTransmittance: 0.2,
			elevationalHeight: 1,
			midHeight: 2,
			numberOpenableParts: "1",
			overhangDepth: 0.5 ,
			overhangDistance: 0.5,
			sideFinRightDepth: 0.25,
			sideFinRightDistance: 1,
			sideFinLeftDepth: 0.25,
			sideFinLeftDistance: 1,
			curtainsOrBlinds: true,
			treatmentType: WindowTreatmentType.curtains,
			thermalResistivityIncrease: 1,
			solarTransmittanceReduction: 0.1,
			midHeightOpenablePart1: 1,
			openingToFrameRatio: 0.8,
			maximumOpenableArea: 1,
			heightOpenableArea: 1,
			curtainsControlObject: WindowTreatmentControl.auto_motorised,
		};
		expect(
			() => {
				windowDataZod.parse(windowFormData);
			},
		).not.toThrowError();
	});

	it("correctly does not validate a invalid window shape with four openable parts", () => {
		const windowFormData = {
			name: "bedroom window",
			orientation: 90,
			surfaceArea: 4,
			height: 2,
			width: 2,
			uValue: 0.1,
			pitchOption: "90",
			pitch: 90,
			solarTransmittance: 0.2,
			elevationalHeight: 1,
			midHeight: 2,
			numberOpenableParts: "4",
			overhangDepth: 0.5 ,
			overhangDistance: 0.5,
			sideFinRightDepth: 0.25,
			sideFinRightDistance: 1,
			sideFinLeftDepth: 0.25,
			sideFinLeftDistance: 1,
			curtainsOrBlinds: true,
			treatmentType: WindowTreatmentType.curtains,
			thermalResistivityIncrease: 1,
			solarTransmittanceReduction: 0.1,
			midHeightOpenablePart1: 1,
			openingToFrameRatio: 0.8,
			maximumOpenableArea: 1,
			heightOpenableArea: 1,
			curtainsControlObject: WindowTreatmentControl.auto_motorised,
		};
		expect(
			() => {
				windowDataZod.parse(windowFormData);
			},
		).toThrowError();
	});

	it("correctly does not validate a invalid window shape with one openable part and an overhang depth missing", () => {
		const windowFormData = {
			name: "bedroom window",
			orientation: 90,
			surfaceArea: 4,
			height: 2,
			width: 2,
			uValue: 0.1,
			pitchOption: "90",
			pitch: 90,
			solarTransmittance: 0.2,
			elevationalHeight: 1,
			midHeight: 2,
			numberOpenableParts: "1",
			overhangDistance: 0.5,
			sideFinRightDepth: 0.25,
			sideFinRightDistance: 1,
			sideFinLeftDepth: 0.25,
			sideFinLeftDistance: 1,
			curtainsOrBlinds: true,
			treatmentType: WindowTreatmentType.curtains,
			thermalResistivityIncrease: 1,
			solarTransmittanceReduction: 0.1,
			midHeightOpenablePart1: 1,
			openingToFrameRatio: 0.8,
			maximumOpenableArea: 1,
			heightOpenableArea: 1,
			curtainsControlObject: WindowTreatmentControl.auto_motorised,
		};
		expect(
			() => {
				windowDataZod.parse(windowFormData);
			},
		).toThrowError();
	});
});