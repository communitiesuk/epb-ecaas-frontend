import { windowDataZod, type EcaasForm, type EcaasFormList } from "./ecaasStore.schema";

describe("windowData Zod schema", () => {
	it("correctly validates a valid window shape with one openable part", () => {
		const windowFormData: WindowData = {
			id: "80fd1ffe-a83a-4d95-bd2c-ad8fdc37b321",
			name: "bedroom window",
			taggedItem: "c9ec4b19-5ed9-4d13-8d88-1f284294ac43",
			height: 2,
			width: 2,
			uValue: 0.1,
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
			treatmentType: "curtains",
			thermalResistivityIncrease: 1,
			solarTransmittanceReduction: 0.1,
			midHeightOpenablePart1: 1,
			openingToFrameRatio: 0.8,
			maximumOpenableArea: 1,
			heightOpenableArea: 1,
			curtainsControlObject: "auto_motorised",
			securityRisk: false,
		};
		expect(
			() => {
				windowDataZod.parse(windowFormData);
			},
		).not.toThrowError();
	});

	it("correctly does not validate a invalid window shape with four openable parts", () => {
		const windowFormData = {
			id: "80fd1ffe-a83a-4d95-bd2c-ad8fdc37b321",
			name: "bedroom window",
			orientation: 90,
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
			treatmentType: "curtains",
			thermalResistivityIncrease: 1,
			solarTransmittanceReduction: 0.1,
			midHeightOpenablePart1: 1,
			openingToFrameRatio: 0.8,
			maximumOpenableArea: 1,
			heightOpenableArea: 1,
			curtainsControlObject: "auto_motorised",
		};
		expect(
			() => {
				windowDataZod.parse(windowFormData);
			},
		).toThrowError();
	});

	it("correctly does not validate a invalid window shape with one openable part and an overhang depth missing", () => {
		const windowFormData = {
			id: "80fd1ffe-a83a-4d95-bd2c-ad8fdc37b321",
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
			treatmentType: "curtains",
			thermalResistivityIncrease: 1,
			solarTransmittanceReduction: 0.1,
			midHeightOpenablePart1: 1,
			openingToFrameRatio: 0.8,
			maximumOpenableArea: 1,
			heightOpenableArea: 1,
			curtainsControlObject: "auto_motorised",
		};
		expect(
			() => {
				windowDataZod.parse(windowFormData);
			},
		).toThrowError();
	});
});

describe("ECaaS form types", () => {
	test("check an EcaasFormList is assignable to EcaasForm", () => {
		expectTypeOf<EcaasFormList<unknown>>().toExtend<EcaasForm<unknown>>();
	});

	type DuckType = {
		beakSize: number,
		quackVolume: number,
		feet: "webbed"
	};

	test("check an EcaasForm with no second generic parameter declares incomplete data partial", () => {
		type ExpectedDuckTypeForm = {
			data: {
				beakSize: number;
				quackVolume: number;
				feet: "webbed";
			};
			complete: true;
		} | {
			data: {
				beakSize?: number | undefined;
				quackVolume?: number | undefined;
				feet?: "webbed" | undefined;
			};
			complete?: false;
		};
		expectTypeOf<EcaasForm<DuckType>>().toExtend<ExpectedDuckTypeForm>();
	});

	test("check an EcaasForm with second generic parameter set to some keys declares incomplete data partial except for those keys", () => {
		type ExpectedDuckTypeFormWithBeakSizeRequired = {
			data: {
				beakSize: number;
				quackVolume: number;
				feet: "webbed";
			};
			complete: true;
		} | {
			data: {
				beakSize: number;
				quackVolume?: number;
				feet?: "webbed";
			};
			complete?: false;
		};
		expectTypeOf<EcaasForm<DuckType, "beakSize">>().branded.toEqualTypeOf<ExpectedDuckTypeFormWithBeakSizeRequired>();
	});
});