(function () {
  "use strict";

  const toastIcons = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M8 12.5 L11 15.5 L16 9.5"></path></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5 L22 20 H2 Z"></path><path d="M12 10 V14.5 M12 17.4 h.01"></path></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M9 9 L15 15 M15 9 L9 15"></path></svg>'
  };

  let toastTimer = 0;
  let lastDialogTrigger = null;

  function syncCounter(input) {
    const wrapper = input.closest(".cf-input-wrap, .cf-textarea-wrap");
    const counter = wrapper?.querySelector(".cf-input-count, .cf-textarea-count");
    const maximum = input.maxLength;

    if (!counter || maximum < 0) return;

    const length = input.value.length;
    counter.textContent = `${length} / ${maximum}`;
    counter.classList.toggle("is-near", length >= maximum * 0.8 && length < maximum);
    counter.classList.toggle("is-max", length >= maximum);
  }

  function syncCreateTopicDialog(dialog) {
    if (!dialog) return;

    dialog.querySelectorAll("input[maxlength], textarea[maxlength]").forEach(syncCounter);
    const name = dialog.querySelector("[data-ds-create-topic-name]");
    const submit = dialog.querySelector("[data-ds-create-topic-submit]");

    if (name && submit) submit.disabled = !name.value.trim();
  }

  function resetCreateTopicDialog(dialog) {
    const form = dialog.querySelector("[data-ds-create-topic-form]");
    form?.reset();

    dialog.querySelectorAll('.tm-chips[role="radiogroup"]').forEach((group) => {
      group.querySelectorAll(".tm-chip").forEach((chip, index) => {
        const selected = index === 0;
        chip.classList.toggle("is-active", selected);
        chip.setAttribute("aria-checked", String(selected));
        chip.tabIndex = selected ? 0 : -1;
      });
    });

    syncCreateTopicDialog(dialog);
  }

  function openDialog(id, trigger) {
    const overlay = document.getElementById(id);
    if (!overlay?.classList.contains("tm-overlay")) return false;

    lastDialogTrigger = trigger || document.activeElement;
    resetCreateTopicDialog(overlay);
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("has-open-dialog");

    window.setTimeout(() => {
      const initialFocus = overlay.querySelector("[data-ds-create-topic-name], button, input, textarea");
      initialFocus?.focus();
    }, 0);

    return true;
  }

  function closeDialog(dialog) {
    const overlay = typeof dialog === "string" ? document.getElementById(dialog) : dialog;
    if (!overlay?.classList.contains("tm-overlay")) return false;

    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".tm-overlay.is-open")) document.body.classList.remove("has-open-dialog");

    if (lastDialogTrigger instanceof HTMLElement) lastDialogTrigger.focus();
    lastDialogTrigger = null;
    return true;
  }

  function showToast(message, type = "success") {
    const normalizedType = Object.hasOwn(toastIcons, type) ? type : "success";
    let toast = document.getElementById("app-toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "app-toast";
      toast.setAttribute("aria-live", "polite");
      toast.setAttribute("aria-atomic", "true");
      document.body.appendChild(toast);
    }

    toast.className = `app-toast ${normalizedType}`;
    toast.setAttribute("role", normalizedType === "success" ? "status" : "alert");
    toast.innerHTML = `<span class="app-toast-ico">${toastIcons[normalizedType]}</span><span class="app-toast-msg"></span>`;
    toast.querySelector(".app-toast-msg").textContent = String(message || "");

    window.clearTimeout(toastTimer);
    window.requestAnimationFrame(() => toast.classList.add("show"));
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 1800);
    return toast;
  }

  function selectChip(chip) {
    const group = chip.closest('.tm-chips[role="radiogroup"]');
    if (!group) return;

    group.querySelectorAll(".tm-chip").forEach((item) => {
      const selected = item === chip;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-checked", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
  }

  document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-ds-modal-open]");
    if (opener) {
      openDialog(opener.dataset.dsModalOpen, opener);
      return;
    }

    const toastTrigger = event.target.closest("[data-ds-toast]");
    if (toastTrigger) {
      const separator = toastTrigger.dataset.dsToast.indexOf("|");
      const type = separator >= 0 ? toastTrigger.dataset.dsToast.slice(0, separator) : "success";
      const message = separator >= 0 ? toastTrigger.dataset.dsToast.slice(separator + 1) : toastTrigger.dataset.dsToast;
      showToast(message, type);
      return;
    }

    const closer = event.target.closest("[data-ds-modal-close]");
    if (closer) {
      closeDialog(closer.closest(".tm-overlay"));
      return;
    }

    if (event.target.classList.contains("tm-overlay")) {
      closeDialog(event.target);
      return;
    }

    const chip = event.target.closest('.tm-chips[role="radiogroup"] .tm-chip');
    if (chip) selectChip(chip);
  });

  document.addEventListener("input", (event) => {
    if (!event.target.matches(".tm-panel input[maxlength], .tm-panel textarea[maxlength]")) return;

    syncCounter(event.target);
    syncCreateTopicDialog(event.target.closest(".tm-panel"));
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-ds-create-topic-form]");
    if (!form) return;

    event.preventDefault();
    const nameInput = form.querySelector("[data-ds-create-topic-name]");
    const submit = form.querySelector("[data-ds-create-topic-submit]");
    if (!nameInput?.value.trim() || submit?.disabled) return;

    const selectedField = form.querySelector(".tm-chip.is-active")?.textContent.trim() || "通用";
    const description = form.querySelector("[data-ds-create-topic-desc]")?.value.trim() || "";
    const overlay = form.closest(".tm-overlay");

    document.dispatchEvent(new CustomEvent("interninkstone:topic-created", {
      detail: { name: nameInput.value.trim(), field: selectedField, description }
    }));

    if (overlay) closeDialog(overlay);
    showToast("课题创建成功", "success");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const openDialogs = Array.from(document.querySelectorAll(".tm-overlay.is-open"));
      const topDialog = openDialogs.at(-1);
      if (topDialog) {
        event.preventDefault();
        closeDialog(topDialog);
      }
      return;
    }

    const chip = event.target.closest('.tm-chips[role="radiogroup"] .tm-chip');
    if (!chip || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;

    const chips = Array.from(chip.closest(".tm-chips").querySelectorAll(".tm-chip"));
    const direction = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    const next = chips[(chips.indexOf(chip) + direction + chips.length) % chips.length];
    event.preventDefault();
    selectChip(next);
    next.focus();
  });

  document.querySelectorAll(".tm-panel input[maxlength], .tm-panel textarea[maxlength]").forEach(syncCounter);
  document.querySelectorAll(".tm-overlay").forEach(syncCreateTopicDialog);

  window.InternInkStoneUI = Object.freeze({
    openDialog,
    closeDialog,
    showToast
  });
})();
