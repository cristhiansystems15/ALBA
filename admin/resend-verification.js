(() => {
  const SUPABASE_URL = "https://xuilkvsehlnkqtlfkblw.supabase.co";
  const SUPABASE_KEY = "sb_publishable_Mdr55DRXLuqCXIYjh5hepQ_Lx3T3-Pg";
  const REDIRECT_URL = `${window.location.origin}${window.location.pathname}`;

  function setStatus(text, ok = false) {
    const el = document.getElementById("authMessage");
    if (!el) return;
    el.textContent = text;
    el.style.color = ok ? "#159a68" : "";
  }

  async function resendVerification() {
    const email = document.getElementById("authEmail")?.value.trim();
    if (!email) {
      setStatus("Escribe tu correo electrónico primero.");
      return;
    }

    const button = document.getElementById("resendVerification");
    if (button) {
      button.disabled = true;
      button.textContent = "Enviando…";
    }

    try {
      const response = await fetch(`${SUPABASE_URL}/auth/v1/resend`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: "signup",
          email,
          options: { emailRedirectTo: REDIRECT_URL }
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.msg || data.message || data.error_description || "No fue posible reenviar el correo.");
      setStatus("Correo de confirmación reenviado. Revisa tu bandeja de entrada y spam.", true);
    } catch (error) {
      setStatus(error.message || "No fue posible reenviar el correo.");
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = "Reenviar correo de confirmación";
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("resendVerification");
    const message = document.getElementById("authMessage");
    if (!button || !message) return;

    button.addEventListener("click", resendVerification);

    const updateVisibility = () => {
      const text = message.textContent || "";
      button.classList.toggle("hidden", !/cuenta creada|correo de confirmación/i.test(text));
    };

    new MutationObserver(updateVisibility).observe(message, { childList: true, characterData: true, subtree: true });
    updateVisibility();
  });
})();
