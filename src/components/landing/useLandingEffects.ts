"use client";

import { useEffect } from "react";

export function useLandingEffects() {
  useEffect(() => {
    const PHRASES = ["Rule-based audit.", "A report link you can send."];
    const wrapEl = document.querySelector("h1 .line2-wrap");
    const innerEl = document.querySelector("#line2-typed");
    if (!wrapEl || !innerEl) return;
    const wrap = wrapEl as HTMLElement;
    const inner = innerEl as HTMLElement;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      inner.textContent = PHRASES[0];
      return;
    }

    let typingTimeoutId: number | null = null;
    let phraseIndex = 0;
    let charIndex = 0;
    const msPerChar = 48;
    const msPerDelete = 34;
    const holdBeforeDeleteMs = 2200;
    const gapBeforeNextPhraseMs = 380;
    const startDelayMs = 240;

    function clearTimer() {
      if (typingTimeoutId !== null) {
        window.clearTimeout(typingTimeoutId);
        typingTimeoutId = null;
      }
    }

    function finishTypingNow() {
      clearTimer();
      inner.textContent = PHRASES[0];
      phraseIndex = 0;
      charIndex = PHRASES[0].length;
      wrap.classList.add("typing-done");
    }

    function stopHeadlineGradient() {
      finishTypingNow();
      wrap.classList.remove("line2-wrap--flow");
      wrap.classList.add("line2-wrap--stopped");
    }

    function startTypingPhrase() {
      charIndex = 0;
      inner.textContent = "";
      wrap.classList.remove("typing-done");
      typeForward();
    }

    function typeForward() {
      const phrase = PHRASES[phraseIndex];
      if (charIndex >= phrase.length) {
        wrap.classList.add("typing-done");
        typingTimeoutId = window.setTimeout(() => {
          wrap.classList.remove("typing-done");
          deleteBackward();
        }, holdBeforeDeleteMs);
        return;
      }
      inner.textContent += phrase.charAt(charIndex);
      charIndex += 1;
      typingTimeoutId = window.setTimeout(typeForward, msPerChar);
    }

    function deleteBackward() {
      if (inner.textContent.length <= 0) {
        phraseIndex = (phraseIndex + 1) % PHRASES.length;
        typingTimeoutId = window.setTimeout(startTypingPhrase, gapBeforeNextPhraseMs);
        return;
      }
      inner.textContent = inner.textContent.slice(0, -1);
      typingTimeoutId = window.setTimeout(deleteBackward, msPerDelete);
    }

    typingTimeoutId = window.setTimeout(() => {
      typingTimeoutId = null;
      wrap.classList.add("line2-wrap--flow");
      startTypingPhrase();
    }, startDelayMs);

    const runAudit = document.getElementById("cta-run-audit");
    const viewSample = document.getElementById("cta-view-sample");
    const stop = () => stopHeadlineGradient();
    runAudit?.addEventListener("click", stop);
    viewSample?.addEventListener("click", stop);

    return () => {
      clearTimer();
      runAudit?.removeEventListener("click", stop);
      viewSample?.removeEventListener("click", stop);
    };
  }, []);

  useEffect(() => {
    const ledgerEl = document.getElementById("ledger-section");
    if (!ledgerEl) return;
    const ledgerSection = ledgerEl;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function fmtCurrency(n: number) {
      return "$" + Math.round(n).toLocaleString("en-US");
    }

    function delay(ms: number) {
      return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
    }

    function countUp(el: HTMLElement, target: number, durationMs: number) {
      return new Promise<void>((resolve) => {
        const start = performance.now();
        function frame(now: number) {
          const t = Math.min(1, (now - start) / durationMs);
          const eased = 1 - Math.pow(1 - t, 3);
          const val = Math.round(target * eased);
          el.textContent = fmtCurrency(val);
          if (t < 1) requestAnimationFrame(frame);
          else {
            el.textContent = fmtCurrency(target);
            resolve();
          }
        }
        requestAnimationFrame(frame);
      });
    }

    function showStaticLedger() {
      const rows = ledgerSection.querySelectorAll("[data-ledger-row]");
      for (let i = 0; i < rows.length; i++) {
        rows[i].classList.add("ledger-row--visible");
        const amtEl = rows[i].querySelector("[data-count]");
        const target = parseInt(rows[i].getAttribute("data-amount") || "0", 10);
        if (amtEl) amtEl.textContent = fmtCurrency(target);
      }
      const totalBlock = document.getElementById("ledger-total-block");
      const totalNum = document.getElementById("ledger-total-num");
      totalBlock?.classList.add("ledger-total-row--visible");
      if (totalNum) totalNum.textContent = fmtCurrency(14400);
    }

    async function runLedgerSequence() {
      const rows = ledgerSection.querySelectorAll("[data-ledger-row]");
      for (let j = 0; j < rows.length; j++) {
        rows[j].classList.add("ledger-row--visible");
        const amtEl = rows[j].querySelector("[data-count]") as HTMLElement | null;
        const target = parseInt(rows[j].getAttribute("data-amount") || "0", 10);
        if (amtEl) await countUp(amtEl, target, 620);
        await delay(115);
      }
      await delay(220);
      const totalBlock = document.getElementById("ledger-total-block");
      const totalNum = document.getElementById("ledger-total-num") as HTMLElement | null;
      totalBlock?.classList.add("ledger-total-row--visible");
      if (totalNum) await countUp(totalNum, 14400, 1050);
    }

    if (prefersReduced) {
      showStaticLedger();
      return;
    }

    let played = false;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || played) return;
          played = true;
          io.disconnect();
          void runLedgerSequence();
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(ledgerSection);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function revealSection(el: HTMLElement | null) {
      if (!el) return;
      if (prefersReduced) {
        el.classList.add("in-view");
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );
      io.observe(el);
    }

    const insightsEl = document.getElementById("insights-section");
    if (!insightsEl) return;
    const insights = insightsEl;

    let cutT: number | null = null;
    let afterT: number | null = null;

    function clearSequenceState() {
      if (cutT != null) {
        window.clearTimeout(cutT);
        cutT = null;
      }
      if (afterT != null) {
        window.clearTimeout(afterT);
        afterT = null;
      }
      insights.classList.remove("insights-sequence-cut", "insights-sequence-after");
    }

    function startSpendSequence() {
      clearSequenceState();
      insights.classList.add("in-view");
      cutT = window.setTimeout(() => {
        cutT = null;
        insights.classList.add("insights-sequence-cut");
      }, 900);
      afterT = window.setTimeout(() => {
        afterT = null;
        insights.classList.add("insights-sequence-after");
      }, 1750);
    }

    let insightsIo: IntersectionObserver | null = null;
    if (prefersReduced) {
      insights.classList.add("in-view", "insights-sequence-cut", "insights-sequence-after");
    } else {
      insightsIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) startSpendSequence();
            else clearSequenceState();
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );
      insightsIo.observe(insights);
    }

    revealSection(document.getElementById("what-it-does"));

    const featuresWrap = document.getElementById("what-it-does");
    let cardIo: IntersectionObserver | null = null;
    if (featuresWrap) {
      const featureCards = featuresWrap.querySelectorAll(".feature-card");
      if (prefersReduced) {
        featureCards.forEach((card) => card.classList.add("feature-card--in-view"));
      } else {
        cardIo = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("feature-card--in-view");
              cardIo?.unobserve(entry.target);
            });
          },
          { threshold: 0.15, rootMargin: "0px 0px -12% 0px" },
        );
        featureCards.forEach((card) => cardIo?.observe(card));
      }
    }

    return () => {
      insightsIo?.disconnect();
      cardIo?.disconnect();
      clearSequenceState();
    };
  }, []);

  /** If scroll observers never run (viewport / timing edge cases), still show below-the-fold content */
  useEffect(() => {
    const reveal = () => {
      document.getElementById("insights-section")?.classList.add("in-view");
      document.getElementById("what-it-does")?.classList.add("in-view");
      document.querySelectorAll(".feature-card").forEach((el) => {
        el.classList.add("feature-card--in-view");
      });
    };
    const t1 = window.setTimeout(reveal, 700);
    const t2 = window.setTimeout(() => {
      document.getElementById("insights-section")?.classList.add("insights-sequence-cut", "insights-sequence-after");
    }, 1600);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);
}
