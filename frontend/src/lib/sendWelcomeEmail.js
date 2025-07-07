import emailjs from "@emailjs/browser";

export async function sendWelcomeEmail({ firstName, email, password }) {
  try {
    const result = await emailjs.send(
      "service_7fdwial",
      "template_z91vw6s",
      {
        to_name: firstName,
        user_email: email,
        user_password: password,
      },
      "Z3uw9_XGXyHLHue1C"
    );

    console.log("EmailJS sent:", result.text);
    return true;
  } catch (error) {
    console.error("EmailJS error:", error);
    return false;
  }
}
