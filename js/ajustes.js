/* ajustes.js — PROFIT 4.0 (v17)
   1) × para apagar o texto da busca de alimento.
   2) Quantidade (gramas) já selecionada ao tocar, para digitar por cima.
   3) Mínimo e máximo (90% e 110% da meta) escritos abaixo das barras do Início.
   4) Botão flutuante de atalhos por gesto fica oculto na tela: as opções ficam só em Configuração. */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }

  /* 4) Oculta a caixa de atalhos fora da Configuração (os gestos continuam funcionando). */
  (function () {
    var s = document.createElement('style');
    s.textContent = '#swipeShortcut{display:none!important}';
    document.head.appendChild(s);
  })();

  /* 1) × na busca */
  function ligarX() {
    var inp = $('busca');
    if (!inp || inp.dataset.xOk) return;
    inp.dataset.xOk = '1';
    var wrap = document.createElement('div');
    wrap.style.position = 'relative';
    inp.parentNode.insertBefore(wrap, inp);
    wrap.appendChild(inp);
    inp.style.paddingRight = '40px';
    var x = document.createElement('button');
    x.type = 'button';
    x.textContent = '×';
    x.setAttribute('aria-label', 'Apagar busca');
    x.style.cssText = 'position:absolute;right:8px;top:50%;transform:translateY(-50%);border:0;background:transparent;color:var(--muted);font-size:22px;line-height:1;cursor:pointer;padding:4px 8px;display:none';
    wrap.appendChild(x);
    function mostrar() { x.style.display = inp.value ? 'block' : 'none'; }
    x.addEventListener('click', function () {
      inp.value = '';
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.focus();
      mostrar();
    });
    inp.addEventListener('input', mostrar);
    mostrar();
  }

  /* 2) Gramas selecionadas ao tocar */
  function ligarSelecao() {
    var g = $('gramas');
    if (!g || g.dataset.selOk) return;
    g.dataset.selOk = '1';
    g.addEventListener('focus', function () { setTimeout(function () { g.select(); }, 10); });
    g.addEventListener('mouseup', function (e) { e.preventDefault(); g.select(); });
    g.addEventListener('touchend', function (e) { e.preventDefault(); g.focus(); setTimeout(function () { g.select(); }, 10); });
  }

  /* 3) Mín e máx abaixo das barras */
  function metas() {
    var kcal = Number(localStorage.getItem('nutri_meta') || 0);
    var p = {};
    try { p = JSON.parse(localStorage.getItem('profit_nutrition_profile_v31') || '{}'); } catch (e) {}
    return { kcal: kcal, p: Number(p.proteina) || 0, c: Number(p.carbo) || 0, g: Number(p.gordura) || 0 };
  }
  function txt(meta, unidade) {
    if (!meta) return 'Calcule sua recomendação no Perfil';
    var mn = Math.round(meta * 0.9), mx = Math.round(meta * 1.1);
    return 'mín ' + mn.toLocaleString('pt-BR') + unidade + ' · máx ' + mx.toLocaleString('pt-BR') + unidade;
  }
  function rotulo(id, depoisDe) {
    var el = $(id);
    if (!el && depoisDe) {
      el = document.createElement('div');
      el.id = id;
      el.style.cssText = 'font-size:11px;color:var(--muted);margin-top:3px;';
      depoisDe.parentNode.insertBefore(el, depoisDe.nextSibling);
    }
    return el;
  }
  function atualizarRotulos() {
    var m = metas();
    var bK = $('progressBar'), bP = $('barP'), bC = $('barC'), bG = $('barG');
    var rK = bK && rotulo('rotuloKcal', bK.parentElement);
    if (rK) rK.textContent = txt(m.kcal, ' kcal');
    var pares = [['rotuloP', bP, m.p], ['rotuloC', bC, m.c], ['rotuloG', bG, m.g]];
    pares.forEach(function (x) {
      if (!x[1]) return;
      var r = rotulo(x[0], x[1].parentElement);
      if (r) r.textContent = txt(x[2], ' g');
    });
  }

  function iniciar() {
    ligarX();
    ligarSelecao();
    atualizarRotulos();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
  setInterval(function () { ligarX(); ligarSelecao(); atualizarRotulos(); }, 1500);
})();
