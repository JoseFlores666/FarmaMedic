import { z } from "zod";

export const userSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  apellidos: z.string().min(3, { message: "Los apellidos deben tener al menos 3 caracteres" }),
  edad: z.number().min(18, { message: "Debes tener al menos 18 años" }).max(100, { message: "Edad no válida" }),
  telefono: z.string().length(10, { message: "El número de teléfono debe tener 10 dígitos" }),
  correo: z.string().email({ message: "Por favor, introduce un correo electrónico válido" }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }).max(50, { message: "La contraseña no puede tener más de 50 caracteres" }),
  confirmPassword: z.string().min(8, { message: "Por favor, confirma tu contraseña" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas deben coincidir",
  path: ["confirmPassword"],
});
