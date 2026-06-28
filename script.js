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

/* =========================================================
   ABAS DAS DEMONSTRAÇÕES
   ========================================================= */

const demoTabs = document.querySelectorAll('.demo-tab');
const demoViews = document.querySelectorAll('.demo-view');

function setDemoMode(targetId) {
	document.body.classList.toggle('is-reflected-mode', targetId === 'reflectedDemo');
}

function activateDemo(targetId, activeTab) {
	demoTabs.forEach((item) => item.classList.remove('is-active'));
	demoViews.forEach((view) => view.classList.remove('is-active'));

	activeTab.classList.add('is-active');
	document.getElementById(targetId).classList.add('is-active');

	setDemoMode(targetId);

	if (typeof closeSimulatedModal === 'function') {
		closeSimulatedModal();
	}
}

demoTabs.forEach((tab) => {
	tab.addEventListener('click', () => {
		activateDemo(tab.dataset.demoTarget, tab);
	});
});

const initialActiveTab = document.querySelector('.demo-tab.is-active');

if (initialActiveTab) {
	setDemoMode(initialActiveTab.dataset.demoTarget);
}

/* =========================================================
   DEMONSTRAÇÃO 2 — XSS REFLETIDO
   ========================================================= */

const searchInput = document.getElementById("searchInput");
const normalSearchBtn = document.getElementById("normalSearchBtn");
const reflectedExampleBtn = document.getElementById("reflectedExampleBtn");

const runReflectedVulnerableBtn = document.getElementById("runReflectedVulnerableBtn");
const runReflectedSafeBtn = document.getElementById("runReflectedSafeBtn");
const clearReflectedBtn = document.getElementById("clearReflectedBtn");

const simulatedUrl = document.getElementById("simulatedUrl");

const reflectedVulnerableOutput = document.getElementById("reflectedVulnerableOutput");
const reflectedSafeOutput = document.getElementById("reflectedSafeOutput");

const reflectedVulnerableStatus = document.getElementById("reflectedVulnerableStatus");
const reflectedSafeStatus = document.getElementById("reflectedSafeStatus");

const reflectedLastAction = document.getElementById("reflectedLastAction");

const normalSearchExample = "segurança da informação";
const reflectedXssExample = '<script>alert("Demonstração de XSS refletido")<\/script>';

function setReflectedLastAction(text) {
  reflectedLastAction.textContent = text;
}

function updateSimulatedUrl(value) {
  const encodedValue = encodeURIComponent(value);
  simulatedUrl.textContent = `/busca?termo=${encodedValue}`;
}

function clearReflectedEmptyState(container) {
  const emptyState = container.querySelector(".empty-state");

  if (emptyState) {
    emptyState.remove();
  }
}

function createSearchResult({term, mode, note}) {
	const wrapper = document.createElement('article');
	wrapper.className = 'search-term-box';

	if (mode === 'danger') {
		wrapper.classList.add('search-term-box--danger');
	}

	if (mode === 'success') {
		wrapper.classList.add('search-term-box--success');
	}

	const title = document.createElement('h3');
	title.className = 'search-result-google-title';
	title.textContent = `Resultado da busca por: ${term}`;

	const url = document.createElement('p');
	url.className = 'search-result-google-url';
	url.textContent = `/busca?termo=${encodeURIComponent(term)}`;

	const description = document.createElement('p');
	description.className = 'search-result-google-description';
	description.textContent = note;

	wrapper.appendChild(title);
	wrapper.appendChild(url);
	wrapper.appendChild(description);

	return wrapper;
}

function runReflectedVulnerable() {
  const value = searchInput.value.trim();

  if (!value) return;

  clearReflectedEmptyState(reflectedVulnerableOutput);
  reflectedVulnerableOutput.innerHTML = "";

  updateSimulatedUrl(value);

  const didacticXssDetected = isDidacticXss(value);

  const result = createSearchResult({
    term: value,
    mode: "danger",
    note: didacticXssDetected
      ? "Na versão vulnerável, a busca foi refletida como se pudesse ser interpretada como código."
      : "Como a busca é comum, ela aparece normalmente nesta simulação."
  });

  reflectedVulnerableOutput.appendChild(result);
  reflectedVulnerableStatus.textContent = didacticXssDetected ? "Interpretado" : "Normal";

  if (didacticXssDetected) {
    const alertMessage = extractAlertMessage(value);
    openSimulatedModal(alertMessage);

    setReflectedLastAction(
      `Na versão vulnerável, o termo vindo da busca/URL foi refletido e gerou um alerta simulado com a mensagem: "${alertMessage}".`
    );
  } else {
    setReflectedLastAction(
      "Uma busca normal foi refletida na versão vulnerável sem comportamento anormal."
    );
  }
}

function runReflectedSafe() {
  const value = searchInput.value.trim();

  if (!value) return;

  clearReflectedEmptyState(reflectedSafeOutput);
  reflectedSafeOutput.innerHTML = "";

  updateSimulatedUrl(value);

  const didacticXssDetected = isDidacticXss(value);

  const result = createSearchResult({
    term: value,
    mode: "success",
    note: didacticXssDetected
      ? "Na versão corrigida, o termo vindo da busca/URL foi exibido apenas como texto."
      : "A busca comum foi exibida com segurança."
  });

  reflectedSafeOutput.appendChild(result);
  reflectedSafeStatus.textContent = "Texto seguro";

  if (didacticXssDetected) {
    setReflectedLastAction(
      "Na versão corrigida, o exemplo de XSS refletido foi exibido apenas como texto, sem execução."
    );
  } else {
    setReflectedLastAction(
      "Uma busca normal foi exibida com segurança na versão corrigida."
    );
  }
}

function clearReflectedDemo() {
  searchInput.value = "";
  simulatedUrl.textContent = "/busca?termo=";

  reflectedVulnerableOutput.innerHTML = '<p class="empty-state">Nenhuma busca realizada ainda.</p>';
  reflectedSafeOutput.innerHTML = '<p class="empty-state">Nenhuma busca realizada ainda.</p>';

  reflectedVulnerableStatus.textContent = "Aguardando";
  reflectedSafeStatus.textContent = "Aguardando";

  setReflectedLastAction("Todos os campos da demonstração de XSS refletido foram limpos.");
}

normalSearchBtn.addEventListener("click", () => {
  searchInput.value = normalSearchExample;
  updateSimulatedUrl(normalSearchExample);
  setReflectedLastAction("Exemplo de busca normal inserido no campo.");
});

reflectedExampleBtn.addEventListener("click", () => {
  searchInput.value = reflectedXssExample;
  updateSimulatedUrl(reflectedXssExample);
  setReflectedLastAction("Exemplo didático de XSS refletido inserido no campo.");
});

runReflectedVulnerableBtn.addEventListener("click", runReflectedVulnerable);
runReflectedSafeBtn.addEventListener("click", runReflectedSafe);
clearReflectedBtn.addEventListener("click", clearReflectedDemo);