import type { BuildingElementGroundHeatedBasementFloor_type, BuildingElementGroundSlabEdgeInsulationFloor_type, BuildingElementGroundSlabNoEdgeInsulationFloor_type, BuildingElementGroundSuspendedFloorFloor_type, BuildingElementGroundUnheatedBasementFloor_type, components, SchemaHeatSourceWetBoiler, SchemaHeatSourceWetHeatBattery, SchemaHeatSourceWetHeatPump, SchemaHeatSourceWetHeatPumpWithProductReference, SchemaHeatSourceWetHiu} from "./api-schema.types";
import { MechVentType, PhotovoltaicVentilationStrategy, WasteWaterHeatRecoverySystemType } from "./api-schema.types";

// Some aliases to names in the API schema generated types, sometimes for more graceful backwards compatibility
// as different names get used in the upstream schemas

export { WasteWaterHeatRecoverySystemType as WwhrsType };
export { MechVentType as VentType };
export { PhotovoltaicVentilationStrategy as OnSiteGenerationVentilationStrategy };
export type ApplianceKey = keyof components['schemas']['Appliances'];
export type FloorType = typeof BuildingElementGroundHeatedBasementFloor_type[keyof typeof BuildingElementGroundHeatedBasementFloor_type]
    | typeof BuildingElementGroundSlabEdgeInsulationFloor_type[keyof typeof BuildingElementGroundSlabEdgeInsulationFloor_type]
    | typeof BuildingElementGroundSlabNoEdgeInsulationFloor_type[keyof typeof BuildingElementGroundSlabNoEdgeInsulationFloor_type]
    | typeof BuildingElementGroundSuspendedFloorFloor_type[keyof typeof BuildingElementGroundSuspendedFloorFloor_type]
    | typeof BuildingElementGroundUnheatedBasementFloor_type[keyof typeof BuildingElementGroundUnheatedBasementFloor_type];
export type SchemaHeatSourceWetDetails = SchemaHeatSourceWetBoiler | SchemaHeatSourceWetHeatBattery | SchemaHeatSourceWetHeatPump | SchemaHeatSourceWetHiu;