import { pgTable, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const simulationState = pgTable("simulation_state", {
  id: serial("id").primaryKey(),
  greenCover: integer("green_cover").notNull().default(0), // 0 to 50
  floodActive: boolean("flood_active").notNull().default(false),
  healthScore: integer("health_score").notNull().default(100),
});

export const insertSimulationStateSchema = createInsertSchema(simulationState).omit({ id: true });

export type InsertSimulationState = z.infer<typeof insertSimulationStateSchema>;
export type SimulationState = typeof simulationState.$inferSelect;
