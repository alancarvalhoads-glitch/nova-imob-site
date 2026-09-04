/* ═══ MODAL DE QUALIFICAÇÃO — componente compartilhado ═══
   Injeta o modal de agendamento em qualquer pagina que carregue este
   arquivo, e expoe window.openModal() global. Usar em conjunto com
   /assets/cta-modal.css e um botao tipo:
     <button onclick="openModal()">Ver demonstração</button>
   Mudar o modal (perguntas, textos, endpoint) precisa ser feito so aqui —
   atualiza em todo o site de uma vez. */
(function () {
  var LEAD_ENDPOINT = "https://zqalpihwwtrzbcgqrzic.supabase.co/functions/v1/webinar-lead";
  var CAL_LINK = "alan-carvalho-novaimob/30min";

  var MODAL_HTML =
    '<div class="qmodal" id="qmodal" aria-hidden="true">' +
      '<div class="qcard">' +
        '<button class="qclose" id="qclose" aria-label="Fechar">&times;</button>' +
        '<div class="qstep" data-step="contato">' +
          '<h3>Antes de tudo, me fala quem é você 👋</h3>' +
          '<div class="qfield"><label>nome</label><input type="text" id="qNome" autocomplete="name" placeholder="Seu nome" /></div>' +
          '<div class="qfield" style="margin-top:12px"><label>whatsapp</label><input type="tel" id="qWhats" inputmode="tel" autocomplete="tel" placeholder="(11) 99999-9999" /></div>' +
          '<p class="qerr" id="qErrContato" hidden>Preencha seu nome e WhatsApp para continuar.</p>' +
          '<button class="qnext" id="qContatoNext">Continuar →</button>' +
        '</div>' +
        '<div class="qstep" data-step="cargo" hidden>' +
          '<h3>Você é...</h3>' +
          '<div class="qopts">' +
            '<button class="qopt" data-field="cargo" data-val="Dono/Sócio de Imobiliária" data-go="corretores">Dono/Sócio de Imobiliária</button>' +
            '<button class="qopt" data-field="cargo" data-val="Diretor/Gerente Comercial" data-go="corretores">Diretor/Gerente Comercial</button>' +
            '<button class="qopt" data-field="cargo" data-val="Corretor" data-act="corretor-warn">Corretor</button>' +
            '<button class="qopt" data-field="cargo" data-val="Outro" data-act="disq-cargo">Outro</button>' +
          '</div>' +
          '<div class="qwarn" id="qwarnCorretor" hidden>' +
            '<p>Caro corretor, essa solução foi pensada para <strong>donos/gestores de imobiliárias</strong>, visto que é útil para quem já possui <strong>volume</strong> de leads. Se ainda assim você quiser conhecer ou propor parcerias, avance e deixe uma observação.</p>' +
            '<button class="qnext" data-go="corretores">Avançar mesmo assim</button>' +
          '</div>' +
        '</div>' +
        '<div class="qstep" data-step="corretores" hidden>' +
          '<h3>Quantos corretores ativos você possui?</h3>' +
          '<div class="qopts">' +
            '<button class="qopt" data-field="corretores" data-val="Sozinho" data-go="trafego">Sozinho</button>' +
            '<button class="qopt" data-field="corretores" data-val="2 a 5" data-go="trafego">2 a 5</button>' +
            '<button class="qopt" data-field="corretores" data-val="6 a 10" data-go="trafego">6 a 10</button>' +
            '<button class="qopt" data-field="corretores" data-val="11 a 20" data-go="trafego">11 a 20</button>' +
            '<button class="qopt" data-field="corretores" data-val="Mais de 20" data-go="trafego">Mais de 20</button>' +
          '</div>' +
        '</div>' +
        '<div class="qstep" data-step="trafego" hidden>' +
          '<h3>Sua imobiliária já investe em tráfego?</h3>' +
          '<div class="qopts">' +
            '<button class="qopt" data-field="trafego" data-val="Sim, até R$2.000" data-go="obs">Sim, investe até R$2.000</button>' +
            '<button class="qopt" data-field="trafego" data-val="Sim, até R$4.000" data-go="obs">Sim, investe até R$4.000</button>' +
            '<button class="qopt" data-field="trafego" data-val="Sim, mais de R$5.000" data-go="obs">Sim, investe mais de R$5.000</button>' +
            '<button class="qopt" data-field="trafego" data-val="Não, mas queremos começar" data-go="obs">Não investimos, mas queremos começar</button>' +
            '<button class="qopt" data-field="trafego" data-val="Não e não pretende" data-act="disq-trafego">Não investimos e nem pretendemos</button>' +
          '</div>' +
        '</div>' +
        '<div class="qstep" data-step="obs" hidden>' +
          '<h3>Tem alguma observação antes do nosso encontro? <span class="qopt-label">(opcional)</span></h3>' +
          '<textarea id="qObs" rows="4" placeholder="Escreva aqui..."></textarea>' +
          '<button class="qnext" id="qSubmit">Garantir minha vaga</button>' +
        '</div>' +
        '<div class="qstep" data-step="cal" hidden>' +
          '<h3>Quase lá! Escolha o melhor horário 👇</h3>' +
          '<div id="cal-loading" style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:40px 0;color:var(--qm-text2);font-size:.9rem">' +
            '<div style="width:32px;height:32px;border:3px solid rgba(96,165,250,.2);border-top-color:#60A5FA;border-radius:50%;animation:qm-spin .8s linear infinite"></div>' +
            'Carregando calendário...' +
          '</div>' +
          '<div id="cal-inline" class="cal-inline"></div>' +
        '</div>' +
        '<div class="qstep qdisq" data-step="disq" hidden>' +
          '<div class="qdisq-icon">🙏</div>' +
          '<p id="qDisqMsg"></p>' +
          '<button class="qexit" id="qExit">Fechar</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  function loadCal() {
    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal; let ar = arguments;
        if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); }
          else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");
    Cal("init", "30min", { origin: "https://app.cal.com" });
    Cal.config = Cal.config || {};
    Cal.config.forwardQueryParams = true;
    Cal.ns["30min"]("ui", { hideEventTypeDetails: false, layout: "month_view", theme: "dark" });
  }

  function init() {
    if (document.getElementById("qmodal")) return; // ja injetado
    document.body.insertAdjacentHTML("beforeend", MODAL_HTML);
    loadCal();

    var modal = document.getElementById("qmodal");
    var card = modal.querySelector(".qcard");
    var answers = {};
    var calLoaded = false;
    var sel = function (s) { return modal.querySelector(s); };
    var ev = function (n, p) { try { if (window.gtag) gtag('event', n, p || {}); } catch (e) {} };

    function showStep(name) {
      modal.querySelectorAll(".qstep").forEach(function (s) { s.hidden = s.getAttribute("data-step") !== name; });
      if (card) card.scrollTop = 0;
    }

    function open() {
      if (document.fullscreenElement) { try { document.exitFullscreen(); } catch (e) {} }
      answers = {};
      var w = document.getElementById("qwarnCorretor"); if (w) w.hidden = true;
      modal.querySelectorAll(".qopt.sel").forEach(function (o) { o.classList.remove("sel"); });
      var ni = document.getElementById("qNome"); if (ni) ni.value = "";
      var wi = document.getElementById("qWhats"); if (wi) wi.value = "";
      var oi = document.getElementById("qObs"); if (oi) oi.value = "";
      document.getElementById("qErrContato").hidden = true;
      showStep("contato");
      modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(function () { var f = document.getElementById("qNome"); if (f) f.focus(); }, 50);
    }
    function close() {
      modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    window.openModal = open;

    sel("#qclose").addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('open')) close(); });

    document.getElementById("qContatoNext").addEventListener('click', function () {
      var nome = (document.getElementById("qNome").value || "").trim();
      var whats = (document.getElementById("qWhats").value || "").trim();
      var digits = whats.replace(/\D/g, "");
      if (!nome || digits.length < 10) { document.getElementById("qErrContato").hidden = false; return; }
      document.getElementById("qErrContato").hidden = true;
      answers.nome = nome; answers.whatsapp = whats;
      showStep("cargo"); ev('lp_modal_contato');
    });

    modal.querySelectorAll(".qopt").forEach(function (opt) {
      opt.addEventListener('click', function () {
        if (opt.dataset.field) answers[opt.dataset.field] = opt.dataset.val;
        var act = opt.dataset.act;
        if (act === 'corretor-warn') {
          var w = document.getElementById("qwarnCorretor"); w.hidden = false;
          opt.parentElement.querySelectorAll(".qopt").forEach(function (o) { o.classList.remove("sel"); });
          opt.classList.add("sel"); w.scrollIntoView({ block: "nearest", behavior: "smooth" }); return;
        }
        if (act === 'disq-cargo') { disqualify('cargo'); return; }
        if (act === 'disq-trafego') { disqualify('trafego'); return; }
        if (opt.dataset.go) showStep(opt.dataset.go);
      });
    });
    modal.querySelectorAll(".qnext[data-go]").forEach(function (b) { b.addEventListener('click', function () { showStep(b.dataset.go); }); });

    function disqualify(which) {
      sel("#qDisqMsg").innerHTML = which === 'trafego'
        ? 'Obrigado pelo interesse! Essa solução é voltada para imobiliárias que já recebem <strong>volume de leads no WhatsApp</strong>.'
        : 'Obrigado! Essa solução é voltada para <strong>Donos e Gestores de Imobiliárias</strong> com time de corretores.';
      showStep("disq"); ev('lp_desqualificado', { motivo: which });
    }
    sel("#qExit").addEventListener('click', close);

    function getCookie(n) { var m = document.cookie.match('(^|;)\\s*' + n + '\\s*=\\s*([^;]+)'); return m ? decodeURIComponent(m.pop()) : ''; }
    function attribution() {
      var u = new URLSearchParams(location.search), a = {};
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'].forEach(function (k) { var v = u.get(k); if (v) a[k] = v; });
      var fbc = getCookie('_fbc'), fbp = getCookie('_fbp');
      if (fbc) a._fbc = fbc; if (fbp) a._fbp = fbp;
      if (document.referrer) a.referrer = document.referrer;
      a.landing_page = location.href;
      return a;
    }

    document.getElementById("qSubmit").addEventListener('click', function () {
      answers.observacoes = (sel("#qObs").value || "").trim();
      var whats = answers.whatsapp || "";
      var digits = whats.replace(/\D/g, "");
      var eventId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : (digits + "-" + Math.floor(performance.now()));
      try { if (window.fbq) fbq('track', 'Lead', { content_name: 'LP Nova Imob' }, { eventID: eventId }); } catch (e) {}
      ev('lp_lead_enviado');
      var btn = this; btn.disabled = true; btn.textContent = "Enviando...";
      fetch(LEAD_ENDPOINT, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: answers.nome, cargo: answers.cargo, corretores: answers.corretores, trafego: answers.trafego,
          disponibilidade: "Sim", observacoes: answers.observacoes,
          whatsapp: whats, eventId: eventId, url: location.href, userAgent: navigator.userAgent, attribution: attribution()
        })
      }).catch(function () {}).finally(function () {
        btn.disabled = false; btn.textContent = "Garantir minha vaga";
        goCal(whats, answers.observacoes);
      });
    });

    function goCal(whats, obs) {
      showStep("cal");
      var loader = document.getElementById("cal-loading");
      if (calLoaded || !window.Cal) { if (loader) loader.style.display = "none"; return; }
      var digits = whats.replace(/\D/g, "");
      if (digits.length <= 11) digits = "55" + digits;
      try {
        Cal.ns["30min"]("inline", { elementOrSelector: "#cal-inline", calLink: CAL_LINK, config: { layout: "month_view", theme: "dark", attendeePhoneNumber: "+" + digits, notes: obs || undefined } });
        calLoaded = true;
        Cal.ns["30min"]("on", { action: "__iframeReady", callback: function () { if (loader) loader.style.display = "none"; } });
      } catch (e) { console.error("cal embed", e); if (loader) loader.style.display = "none"; }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
