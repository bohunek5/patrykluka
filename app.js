const body = document.body;
const mobileNavItems = [
  ["Start", "index.html"],
  ["Oferta", "oferta.html"],
  ["Rezerwacja", "rezerwacja.html"],
  ["Kontakt", "kontakt.html"]
];

function ensureFooter() {
  if (document.querySelector(".footer")) return;
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `
    <div class="footer-brand">
      <span class="footer-mark" aria-hidden="true">PŁ</span>
      <div>
        <strong>PATRYK ŁUKA</strong>
        <p>Spokój ma swoją polisę!</p>
      </div>
    </div>
    <nav class="footer-links" aria-label="Linki w stopce">
      <a href="oferta.html">Oferta</a>
      <a href="rezerwacja.html">Rezerwacja</a>
      <a href="zgloszenie.html">Szybkie zgłoszenie</a>
      <a href="kontakt.html">Kontakt</a>
    </nav>
    <div class="footer-note">
      <span>Ubezpieczenia osobowe, komunikacyjne, majątkowe i firmowe.</span>
      <small>Szybka wycena, zgłoszenie szkody i kontakt z doradcą w jednym miejscu.</small>
    </div>
  `;
  document.body.insertBefore(footer, document.querySelector("script"));
}

function ensureBottomNav() {
  let nav = document.querySelector(".bottom-nav");
  const current = location.pathname.split("/").pop() || "index.html";
  if (!nav) {
    nav = document.createElement("nav");
    nav.className = "bottom-nav";
    nav.setAttribute("aria-label", "Menu mobilne");
    nav.innerHTML = mobileNavItems.map(([label, href]) => `<a href="${href}">${label}</a>`).join("");
    document.body.appendChild(nav);
  }
  nav.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href");
    const target = href === "#start" ? "index.html" : href;
    link.classList.toggle("active", target === current);
  });
}

ensureFooter();
ensureBottomNav();

const quoteForm = document.querySelector("[data-quote-form]");
const steps = [...document.querySelectorAll("[data-step]")];
const nextBtn = document.querySelector("[data-next]");
const prevBtn = document.querySelector("[data-prev]");
const submitBtn = document.querySelector("[data-submit]");
const progressBar = document.querySelector("[data-progress-bar]");
const dynamicFields = document.querySelector("[data-dynamic-fields]");
const dynamicTitle = document.querySelector("[data-dynamic-title]");
const statusEl = document.querySelector("[data-form-status]");
let currentStep = 1;

const fieldSets = {
  auto: {
    title: "Auto: dane pojazdu i kierowcy",
    fields: [
      ["Marka i model", "Np. Toyota Corolla"],
      ["Rok produkcji", "Np. 2021"],
      ["Zakres", "OC, AC, NNW, assistance"],
      ["Historia szkód", "Brak / jedna / kilka"]
    ]
  },
  dom: {
    title: "Dom: lokalizacja i zakres ochrony",
    fields: [
      ["Rodzaj nieruchomości", "Dom, mieszkanie, lokal"],
      ["Powierzchnia", "Np. 72 m2"],
      ["Wartość", "Szacunkowa wartość"],
      ["Ryzyka", "Zalanie, kradzież, przepięcie"]
    ]
  },
  zycie: {
    title: "Życie: potrzeby rodziny",
    fields: [
      ["Wiek osoby ubezpieczonej", "Np. 38"],
      ["Cel ochrony", "Rodzina, kredyt, zdrowie"],
      ["Suma ubezpieczenia", "Np. 300 000 zł"],
      ["Liczba osób", "Indywidualnie lub rodzinnie"]
    ]
  },
  firma: {
    title: "Firma: profil działalności",
    fields: [
      ["Branża", "Np. usługi budowlane"],
      ["Liczba pracowników", "Np. 5"],
      ["Majątek / sprzęt", "Szacunkowa wartość"],
      ["Ryzyka", "OC, lokal, cyber, transport"]
    ]
  },
  podroz: {
    title: "Podróż: kierunek i aktywności",
    fields: [
      ["Kraj wyjazdu", "Np. Włochy"],
      ["Termin", "Daty wyjazdu"],
      ["Liczba osób", "Dorośli i dzieci"],
      ["Aktywności", "Sport, narty, praca"]
    ]
  },
  szkoda: {
    title: "Szkoda: co się wydarzyło",
    fields: [
      ["Typ szkody", "Auto, dom, zdrowie, firma"],
      ["Data zdarzenia", "Kiedy doszło do szkody"],
      ["Miejsce", "Adres lub lokalizacja"],
      ["Pilność", "Czy potrzebna pomoc natychmiast"]
    ]
  }
};

function renderFields(type) {
  const config = fieldSets[type] || fieldSets.auto;
  dynamicTitle.textContent = config.title;
  dynamicFields.innerHTML = config.fields.map(([label, placeholder]) => `
    <label>${label}
      <input name="${label.toLowerCase().replaceAll(" ", "-")}" placeholder="${placeholder}">
    </label>
  `).join("");
}

function setStep(step) {
  currentStep = Math.max(1, Math.min(3, step));
  steps.forEach((el) => el.classList.toggle("active", Number(el.dataset.step) === currentStep));
  prevBtn.disabled = currentStep === 1;
  nextBtn.classList.toggle("hidden", currentStep === 3);
  submitBtn.classList.toggle("hidden", currentStep !== 3);
  progressBar.style.width = `${currentStep * 33.333}%`;
  if (quoteForm && window.matchMedia("(max-width: 980px)").matches) {
    quoteForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

nextBtn?.addEventListener("click", () => {
  if (currentStep === 1) {
    const selected = quoteForm.querySelector("input[name='type']:checked");
    if (!selected) {
      statusEl.textContent = "Najpierw wybierz rodzaj sprawy.";
      return;
    }
    renderFields(selected.value);
    statusEl.textContent = "";
  }
  setStep(currentStep + 1);
});

prevBtn?.addEventListener("click", () => setStep(currentStep - 1));

quoteForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  statusEl.textContent = "Formularz gotowy. W produkcji dane trafią do e-maila, CRM albo panelu agenta.";
  quoteForm.reset();
  setStep(1);
});

document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem("sp-theme", body.classList.contains("dark") ? "dark" : "light");
});

document.querySelectorAll("[data-scroll-top]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

if (localStorage.getItem("sp-theme") === "dark") body.classList.add("dark");

document.querySelectorAll("[data-a11y]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.a11y;
    const className = mode === "contrast" ? "contrast" : mode === "text" ? "large-text" : "reduce-motion";
    body.classList.toggle(className);
  });
});

const chatLog = document.querySelector("[data-chat-log]");
const replies = {
  auto: "Przy aucie najlepiej przygotować dowód rejestracyjny, obecny zakres OC/AC i informację o szkodach z ostatnich lat.",
  zalanie: "Przy zalaniu zrób zdjęcia źródła szkody, uszkodzeń i zabezpiecz miejsce. Formularz poprosi o datę, opis i dokumenty.",
  firma: "Dla firmy ważna jest branża, przychód, liczba pracowników, sprzęt oraz to, czy pracujesz u klienta."
};

document.querySelectorAll("[data-chat]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const text = btn.dataset.chat;
    const key = text.includes("auto") ? "auto" : text.includes("zalanie") ? "zalanie" : "firma";
    chatLog.insertAdjacentHTML("beforeend", `<p><strong>Ty:</strong> ${text}</p><p><strong>Agent:</strong> ${replies[key]}</p>`);
    chatLog.scrollTop = chatLog.scrollHeight;
  });
});
