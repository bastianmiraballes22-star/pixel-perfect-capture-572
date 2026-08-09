import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const leadSchema = z.object({
  nombre: z.string().trim().min(1).max(100),
  contacto: z.string().trim().min(1).max(120),
  plan: z.string().trim().max(60).optional().default(""),
  mensaje: z.string().trim().max(1000).optional().default(""),
});

export const saveLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("leads").insert({
      nombre: data.nombre,
      contacto: data.contacto,
      plan: data.plan || null,
      mensaje: data.mensaje || null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
