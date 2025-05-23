import { z } from "zod";

export const formSchema = z.object({
    company_name: z.string().min(2, {
        message: "Company name must be at least 2 characters.",
    }),
    client_name: z.string().min(2, {
        message: "Client name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().length(10, {
        message: "Phone number must be only 10 digits.",
    }),
    state: z.string().min(1, {
        message: "Please select a state.",
    }),
    city: z.string().min(1, {
        message: "Please select a district.",
    }),
    segment: z.string().min(1, {
        message: "Please select a segment.",
    }),
    purchase_order: z.string().optional(),
    invoice: z.array(z.string()).optional(),
    handing_over_report: z.string().optional(),
    pms_report: z.array(z.string()).optional(),
});

export type FormData = z.infer<typeof formSchema>;
