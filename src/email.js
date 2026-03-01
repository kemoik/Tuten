import emailjs from '@emailjs/browser';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export async function sendOrderEmail({ ref, form, cart, total, subtotal, delivery }) {
  const templateParams = {
    order_ref:        ref,
    timestamp:        new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" }),
    customer_name:    form.name,
    customer_email:   form.email,
    customer_phone:   form.phone,
    order_items:      cart.map(i => `• ${i.name} x${i.qty}  —  KES ${(i.price * i.qty).toLocaleString()}`).join("\n"),
    subtotal:         `KES ${subtotal.toLocaleString()}`,
    delivery_fee:     delivery === 0 ? "Free (Pickup)" : `KES ${delivery.toLocaleString()}`,
    total:            `KES ${total.toLocaleString()}`,
    delivery_method:  form.delivery === "pickup" ? "Pickup – In Motion Delivery, Jundan Meru Rd" : "Home Delivery",
    delivery_address: form.delivery === "pickup" ? "In Motion Delivery, Mombasa" : form.address,
    instructions:     form.instructions || "None",
  };

  return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
}