import * as z from 'zod';
import type { DimensionName } from "./types";
import { units } from "./units";

export function zodUnit(dimension: DimensionName) {
    return z.object({
        amount: z.number(),
        unit: z.enum(units.filter(unit => unit.dimension === dimension).map(unit => unit.name))
    });
}