const commentInput = document.getElementById("commentInput");

const normalExampleBtn = document.getElementById("normalExampleBtn");
const xssExampleBtn = document.getElementById("xssExampleBtn");
const sendVulnerableBtn = document.getElementById("sendVulnerableBtn");
const sendSafeBtn = document.getElementById("sendSafeBtn");
const clearAllBtn = document.getElementById("clearAllBtn");

const vulnerableOutput = document.getElementById("vulnerableOutput");
const safeOutput = document.getElementById("safeOutput");

const vulnerableCount = document.getElementById("vulnerableCount");
const safeCount = document.getElementById("safeCount");

const lastAction = document.getElementById("lastAction");

const simulatedModal = document.getElementById("simulatedModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const confirmModalBtn = document.getElementById("confirmModalBtn");
const modalMessage = document.querySelector(".sim-modal__message");

const normalExample = "Gostei muito da aula de Segurança da Informação!";
const xssExample = '<script>alert("Demonstração de XSS")<\/script>';

let vulnerableItems = 0;
let safeItems = 0;

function setLastAction(text) {
  lastAction.textContent = text;
}

function updateCounters() {
  vulnerableCount.textContent = `${vulnerableItems} ${vulnerableItems === 1 ? "item" : "itens"}`;
  safeCount.textContent = `${safeItems} ${safeItems === 1 ? "item" : "itens"}`;
}

function resetEmptyState(container) {
  const emptyState = container.querySelector(".empty-state");
  if (emptyState) {
    emptyState.remove();
  }
}

function extractAlertMessage(value) {
  const match = value.match(/alert\s*\(\s*(['"`])([\s\S]*?)\1\s*\)/i);

  if (!match) {
    return "Demonstração de XSS";
  }

  return match[2];
}

function createCommentElement({ title, content, tagText, tagClass, note }) {
  const wrapper = document.createElement("article");
  wrapper.className = "comment-item";

  const top = document.createElement("div");
  top.className = "comment-item__top";

  const itemTitle = document.createElement("span");
  itemTitle.className = "comment-item__title";
  itemTitle.textContent = title;

  const tag = document.createElement("span");
  tag.className = `comment-item__tag ${tagClass}`;
  tag.textContent = tagText;

  top.appendChild(itemTitle);
  top.appendChild(tag);

  const contentEl = document.createElement("p");
  contentEl.className = "comment-item__content";
  contentEl.textContent = content;

  const noteEl = document.createElement("p");
  noteEl.className = "comment-item__note";
  noteEl.textContent = note;

  wrapper.appendChild(top);
  wrapper.appendChild(contentEl);
  wrapper.appendChild(noteEl);

  return wrapper;
}

function openSimulatedModal(message = "Demonstração de XSS") {
  modalMessage.textContent = message;
  simulatedModal.classList.remove("hidden");
  simulatedModal.setAttribute("aria-hidden", "false");
}

function closeSimulatedModal() {
  simulatedModal.classList.add("hidden");
  simulatedModal.setAttribute("aria-hidden", "true");
}

function isDidacticXss(value) {
  return /<\s*script[\s>]/i.test(value) && /alert\s*\(/i.test(value);
}

function addToVulnerable() {
  const value = commentInput.value.trim();
  if (!value) return;

  resetEmptyState(vulnerableOutput);
  vulnerableItems += 1;

  const didacticXssDetected = isDidacticXss(value);

  const item = createCommentElement({
    title: `Comentário ${String(vulnerableItems).padStart(2, "0")}`,
    content: value,
    tagText: didacticXssDetected ? "Interpretado como código" : "Exibido normalmente",
    tagClass: "comment-item__tag--danger",
    note: didacticXssDetected
      ? "Na demonstração vulnerável, este conteúdo foi tratado como se pudesse ser executado."
      : "Como o conteúdo é comum, ele não provoca comportamento anormal nesta simulação.",
  });

  vulnerableOutput.appendChild(item);
  updateCounters();

  if (didacticXssDetected) {
    const alertMessage = extractAlertMessage(value);
    openSimulatedModal(alertMessage);
    setLastAction("Na versão vulnerável, o exemplo XSS didático foi interpretado como código e gerou um alerta simulado.");
  } else {
    setLastAction("Um comentário comum foi enviado para a versão vulnerável e exibido normalmente.");
  }
}

function addToSafe() {
  const value = commentInput.value.trim();
  if (!value) return;

  resetEmptyState(safeOutput);
  safeItems += 1;

  const didacticXssDetected = isDidacticXss(value);

  const item = createCommentElement({
    title: `Comentário ${String(safeItems).padStart(2, "0")}`,
    content: value,
    tagText: "Exibido como texto",
    tagClass: "comment-item__tag--success",
    note: didacticXssDetected
      ? "Na versão corrigida, o mesmo conteúdo foi mostrado somente como texto, sem execução."
      : "O comentário foi exibido de forma segura.",
  });

  safeOutput.appendChild(item);
  updateCounters();

  if (didacticXssDetected) {
    setLastAction("Na versão corrigida, o exemplo XSS didático foi exibido apenas como texto, sem execução.");
  } else {
    setLastAction("Um comentário comum foi enviado para a versão corrigida e exibido com segurança.");
  }
}

function clearAll() {
  commentInput.value = "";
  vulnerableItems = 0;
  safeItems = 0;

  vulnerableOutput.innerHTML = '<p class="empty-state">Nenhum comentário enviado ainda.</p>';
  safeOutput.innerHTML = '<p class="empty-state">Nenhum comentário enviado ainda.</p>';

  updateCounters();
  setLastAction("Todos os campos e resultados foram limpos.");
  closeSimulatedModal();
}

normalExampleBtn.addEventListener("click", () => {
  commentInput.value = normalExample;
  setLastAction("Exemplo de comentário normal inserido no campo.");
});

xssExampleBtn.addEventListener("click", () => {
  commentInput.value = xssExample;
  setLastAction("Exemplo XSS didático inserido no campo.");
});

sendVulnerableBtn.addEventListener("click", addToVulnerable);
sendSafeBtn.addEventListener("click", addToSafe);
clearAllBtn.addEventListener("click", clearAll);

closeModalBtn.addEventListener("click", closeSimulatedModal);
confirmModalBtn.addEventListener("click", closeSimulatedModal);

simulatedModal.addEventListener("click", (event) => {
  if (event.target.classList.contains("sim-modal__backdrop")) {
    closeSimulatedModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSimulatedModal();
  }
});

updateCounters();
