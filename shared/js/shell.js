(function () {
  "use strict";

  const frame = document.querySelector("[data-home-frame]");
  const nav = document.querySelector("[data-site-nav]");
  const menuButton = document.querySelector("[data-site-menu]");
  const dialog = document.getElementById("cooperation-dialog");
  const form = dialog?.querySelector("[data-cooperation-form]");
  const toast = document.getElementById("shell-toast");
  const discoveryUrl = window.SiteLinkConfig?.discoveryWebApp || "https://discovery.intern-ai.org.cn/";
  const allowedAnchors = new Set(["home-advantages", "home-workflow", "home-research-foundation", "home-research-cases", "home-cooperation", "home-downloads"]);
  const isLocalFileContext = window.location.protocol === "file:" || window.location.origin === "null";
  const messageTargetOrigin = isLocalFileContext ? "*" : window.location.origin;
  const inertBackground = [document.querySelector(".site-header"), document.querySelector(".site-main")].filter(Boolean);
  let pendingAnchor = null;
  let lastAnchorRequestId = "";
  let lastDialogTrigger = null;
  let toastTimer = 0;
  const successToastIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M8 12.5 L11 15.5 L16 9.5"></path></svg>';

  document.querySelectorAll(".site-header-action").forEach((link) => { link.href = discoveryUrl; });

  function postToHome(message) {
    const target = frame?.contentWindow;
    if (!target) return;
    try {
      target.postMessage(message, messageTargetOrigin);
    } catch (error) {
      if (messageTargetOrigin === "*") throw error;
      target.postMessage(message, "*");
    }
  }

  function flushPendingAnchor() {
    if (pendingAnchor) postToHome(pendingAnchor);
  }

  frame?.addEventListener("load", flushPendingAnchor);

  function requestAnchor(anchorId) {
    if (!allowedAnchors.has(anchorId)) return;
    const request = { type: "home:anchor:scroll", requestId: `anchor-${Date.now()}`, anchorId, behavior: "smooth" };
    lastAnchorRequestId = request.requestId;
    pendingAnchor = request;
    flushPendingAnchor();
    nav?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "打开导航菜单");
  }

  function setActiveAnchor(anchorId) {
    document.querySelectorAll("[data-anchor-id]").forEach((button) => {
      if (!button.closest(".site-nav")) return;
      const current = button.dataset.anchorId === anchorId;
      if (current) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
  }

  function showToast(message) {
    if (!toast) return;
    toast.className = "app-toast success";
    toast.setAttribute("role", "status");
    toast.innerHTML = `<span class="app-toast-ico">${successToastIcon}</span><span class="app-toast-msg"></span>`;
    toast.querySelector(".app-toast-msg").textContent = String(message || "");
    window.clearTimeout(toastTimer);
    window.requestAnimationFrame(() => toast.classList.add("show"));
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 1800);
  }

  function setRadio(chip) {
    const group = chip.closest('[role="radiogroup"]');
    group?.querySelectorAll('[role="radio"]').forEach((item) => {
      const selected = item === chip;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-checked", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    const error = form?.querySelector("[data-form-error]");
    if (error) error.textContent = "";
  }

  function openDialog(trigger) {
    if (!dialog || dialog.classList.contains("is-open")) return;
    lastDialogTrigger = trigger || document.activeElement;
    dialog.classList.add("is-open");
    dialog.setAttribute("aria-hidden", "false");
    inertBackground.forEach((element) => { element.inert = true; });
    document.body.classList.add("has-open-dialog");
    window.setTimeout(() => dialog.querySelector("input, textarea, button")?.focus(), 0);
  }

  function closeDialog() {
    if (!dialog) return;
    const restoreFocusInHome = lastDialogTrigger === frame;
    dialog.classList.remove("is-open");
    dialog.setAttribute("aria-hidden", "true");
    inertBackground.forEach((element) => { element.inert = false; });
    document.body.classList.remove("has-open-dialog");
    if (restoreFocusInHome) postToHome({ type: "home:cooperation-dialog:closed" });
    else if (lastDialogTrigger instanceof HTMLElement) lastDialogTrigger.focus();
    lastDialogTrigger = null;
  }

  function validateForm() {
    if (!form) return false;
    let valid = true;
    form.querySelectorAll("[required]").forEach((field) => {
      if (field.type === "checkbox" || field.type === "radio") return;
      const invalid = !field.value.trim();
      field.classList.toggle("is-error", invalid);
      field.setAttribute("aria-invalid", String(invalid));
      valid = valid && !invalid;
    });
    const research = form.querySelector('[role="radiogroup"] [aria-checked="true"]');
    const methods = Array.from(form.querySelectorAll('input[name="cooperationMethod"]:checked'));
    const methodField = form.querySelector("[data-method-field]");
    methodField?.classList.toggle("is-error", methods.length === 0);
    methodField?.setAttribute("aria-invalid", String(methods.length === 0));
    valid = valid && Boolean(research) && methods.length > 0;
    const error = form.querySelector("[data-form-error]");
    if (error) error.textContent = valid ? "" : "请补全所有必填字段";
    return valid;
  }

  function formDataObject() {
    const selectedResearch = form.querySelector('[role="radiogroup"] [aria-checked="true"]')?.textContent.trim() || "";
    return {
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      organization: form.elements.organization.value.trim(),
      position: form.elements.position.value.trim(),
      researchDirection: selectedResearch,
      researchContent: form.elements.researchContent.value.trim(),
      cooperationMethods: Array.from(form.querySelectorAll('input[name="cooperationMethod"]:checked')).map((item) => item.value),
      cooperationContent: form.elements.cooperationContent.value.trim()
    };
  }

  document.addEventListener("click", (event) => {
    const anchor = event.target.closest("[data-anchor-id]");
    if (anchor) {
      requestAnchor(anchor.dataset.anchorId);
      return;
    }
    if (event.target.closest("[data-refresh-page]")) {
      window.location.reload();
      return;
    }
    const menu = event.target.closest("[data-site-menu]");
    if (menu) {
      const open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "关闭导航菜单" : "打开导航菜单");
      return;
    }
    if (event.target.closest("[data-dialog-close]") || event.target === dialog) {
      closeDialog();
      return;
    }
    const chip = event.target.closest('[role="radiogroup"] [role="radio"]');
    if (chip) setRadio(chip);
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    postToHome({ type: "home:cooperation-dialog:submit", requestId: `cooperation-${Date.now()}`, formData: formDataObject() });
    closeDialog();
    showToast("提交成功");
  });

  form?.addEventListener("input", (event) => {
    const field = event.target;
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      field.classList.remove("is-error");
      field.removeAttribute("aria-invalid");
    }
    if (field instanceof HTMLInputElement && field.name === "cooperationMethod") {
      const methodField = form.querySelector("[data-method-field]");
      methodField?.classList.remove("is-error");
      methodField?.removeAttribute("aria-invalid");
    }
    const error = form.querySelector("[data-form-error]");
    if (error) error.textContent = "";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dialog?.classList.contains("is-open")) {
      event.preventDefault();
      closeDialog();
      return;
    }
    const radio = event.target.closest?.('[role="radiogroup"] [role="radio"]');
    if (radio && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
      const radios = Array.from(radio.closest('[role="radiogroup"]').querySelectorAll('[role="radio"]'));
      const currentIndex = radios.indexOf(radio);
      let nextIndex = currentIndex;
      if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = radios.length - 1;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + radios.length) % radios.length;
      else nextIndex = (currentIndex + 1) % radios.length;
      event.preventDefault();
      setRadio(radios[nextIndex]);
      radios[nextIndex].focus();
      return;
    }
    if (event.key !== "Tab" || !dialog?.classList.contains("is-open")) return;
    const focusable = Array.from(dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled])')).filter((item) => item.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  window.addEventListener("message", (event) => {
    if (event.source !== frame?.contentWindow || !event.data || typeof event.data !== "object") return;
    if (messageTargetOrigin !== "*" && event.origin !== messageTargetOrigin) return;
    if (event.data.type === "home:ready") {
      flushPendingAnchor();
    } else if (event.data.type === "home:section:active" && allowedAnchors.has(event.data.anchorId)) {
      setActiveAnchor(event.data.anchorId);
    } else if (event.data.type === "home:anchor:scrolled" && event.data.requestId === lastAnchorRequestId && allowedAnchors.has(event.data.anchorId)) {
      if (pendingAnchor?.requestId === event.data.requestId) pendingAnchor = null;
      lastAnchorRequestId = "";
      setActiveAnchor(event.data.anchorId);
    } else if (event.data.type === "home:cooperation-dialog:open") {
      const requestId = typeof event.data.requestId === "string" ? event.data.requestId : "";
      openDialog(document.querySelector("[data-home-frame]"));
      postToHome({ type: "home:cooperation-dialog:opened", requestId });
    }
  });
})();
