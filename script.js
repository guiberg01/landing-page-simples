const form = document.getElementById("contato-form");
const statusText = document.getElementById("form-status");

if (form && statusText) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = document.getElementById("nome")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const assunto = document.getElementById("assunto")?.value.trim();
    const mensagem = document.getElementById("mensagem")?.value.trim();

    if (!nome || !email || !assunto || !mensagem) {
      statusText.textContent = "Preencha todos os campos antes de enviar.";
      statusText.className = "form-status error";
      return;
    }

    const emailDestino = "guilherme.goncalves01@hotmail.com";
    const corpo = [
      `Nome: ${nome}`,
      `E-mail: ${email}`,
      "",
      "Mensagem:",
      mensagem,
    ].join("\n");

    const mailtoUrl = `mailto:${emailDestino}?subject=${encodeURIComponent(
      assunto
    )}&body=${encodeURIComponent(corpo)}`;

    window.location.href = mailtoUrl;

    statusText.textContent =
      "Abrimos seu app de e-mail com a mensagem pronta para envio.";
    statusText.className = "form-status success";
    form.reset();
  });
}
