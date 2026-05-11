/* Auto-generated from legacy landing-preview.html */
export function LandingBodyMarkup() {
  return (
    <>
      <div className="shell">
            <header>
              <a className="logo" href="/" aria-label="Credex home">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3L20 19H4L12 3Z" fill="currentColor" />
                </svg>
                Credex
              </a>
              <a className="header-cta" href="/audit">Run audit</a>
            </header>
      
            <section className="hero" id="hero">
              <h1>
                <span className="line1">Know your stack.</span>
                <span className="line2-wrap" aria-label="Headline cycles between two phrases">
                  <span className="line2-inner" id="line2-typed" aria-live="polite"></span><span className="type-cursor" aria-hidden="true">|</span>
                </span>
              </h1>
              <p className="sub">
                For anyone paying for AI tools—teams, founders, or students. Rule-based audit, optional summary, a
                report link you can send—no login.
              </p>
              <div className="cta-row">
                <a className="btn-pill btn-pill-primary" id="cta-run-audit" href="/audit">
                  Run free audit
                  <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a className="btn-pill btn-pill-secondary" id="cta-view-sample" href="#ledger-section">
                  View sample
                </a>
              </div>
            </section>
      
            <section className="ledger-section" id="ledger-section" aria-labelledby="ledger-heading">
              <div className="ledger-inner">
                <div className="ledger-head">
                  <span id="ledger-heading">AI waste — individual contributor ledger</span>
                  <span className="ledger-source"
                    ><a href="https://www.getverbal.ai/" target="_blank" rel="noopener noreferrer">Verbal</a></span
                  >
                </div>
                <div className="ledger-rows">
                  <div className="ledger-row" data-ledger-row data-amount="600">
                    <span className="ledger-label">Stacked subscriptions (ChatGPT + Claude + Copilot)</span>
                    <span className="ledger-leader" aria-hidden="true"></span>
                    <span className="ledger-amt"><span data-count>$0</span></span>
                  </div>
                  <div className="ledger-row" data-ledger-row data-amount="1920">
                    <span className="ledger-label">Max-plan premium over mid-tier</span>
                    <span className="ledger-leader" aria-hidden="true"></span>
                    <span className="ledger-amt"><span data-count>$0</span></span>
                  </div>
                  <div className="ledger-row" data-ledger-row data-amount="4800">
                    <span className="ledger-label">Wrong-model usage (premium for mini-class tasks)</span>
                    <span className="ledger-leader" aria-hidden="true"></span>
                    <span className="ledger-amt"><span data-count>$0</span></span>
                  </div>
                  <div className="ledger-row" data-ledger-row data-amount="2400">
                    <span className="ledger-label">Idle / forgotten API budget</span>
                    <span className="ledger-leader" aria-hidden="true"></span>
                    <span className="ledger-amt"><span data-count>$0</span></span>
                  </div>
                  <div className="ledger-row" data-ledger-row data-amount="1800">
                    <span className="ledger-label">Failed re-runs & retries</span>
                    <span className="ledger-leader" aria-hidden="true"></span>
                    <span className="ledger-amt"><span data-count>$0</span></span>
                  </div>
                  <div className="ledger-row" data-ledger-row data-amount="2880">
                    <span className="ledger-label">Duplicate-tool overlap</span>
                    <span className="ledger-leader" aria-hidden="true"></span>
                    <span className="ledger-amt"><span data-count>$0</span></span>
                  </div>
                </div>
                <div className="ledger-divider">
                  <div className="ledger-total-row" id="ledger-total-block">
                    <span className="ledger-total-label">Total waste / yr</span>
                    <span className="ledger-total-num-wrap">
                      <span className="ledger-total-num" id="ledger-total-num" aria-live="polite">$0</span>
                    </span>
                  </div>
                </div>
                <p className="ledger-foot">
                  Annual category totals from
                  <a href="https://www.getverbal.ai/" target="_blank" rel="noopener noreferrer">Verbal</a>.
                </p>
              </div>
            </section>
      
            <section className="insights-section" id="insights-section" aria-labelledby="insights-heading">
              <div className="insights-inner">
                <h2 id="insights-heading">Current spend</h2>
                <p className="insights-lead">Illustrative model mix—then the same workload after rule-based swaps (illustrative).</p>
                <div className="insights-stack">
                  <div className="insights-panel insights-panel--current" aria-label="Current monthly spend by model">
                    <h3 className="insights-panel-title">By model</h3>
                    <div className="insights-row">
                      <span className="insights-model">Claude 3.5 Sonnet</span>
                      <div className="insights-bar-track"><div className="insights-bar insights-bar--current" style={{ width: "100%" }}></div></div>
                      <span className="insights-price">$1,240</span>
                    </div>
                    <div className="insights-row">
                      <span className="insights-model">GPT-4o</span>
                      <div className="insights-bar-track"><div className="insights-bar insights-bar--current-muted" style={{ width: "71.8%" }}></div></div>
                      <span className="insights-price">$890</span>
                    </div>
                    <div className="insights-row">
                      <span className="insights-model">Claude 3.5 Haiku</span>
                      <div className="insights-bar-track"><div className="insights-bar insights-bar--current-muted" style={{ width: "25.8%" }}></div></div>
                      <span className="insights-price">$320</span>
                    </div>
                    <div className="insights-row">
                      <span className="insights-model">GPT-4o-mini</span>
                      <div className="insights-bar-track"><div className="insights-bar insights-bar--current-muted" style={{ width: "6.9%" }}></div></div>
                      <span className="insights-price">$85</span>
                    </div>
                    <div className="insights-total insights-total--current">
                      <span>Total/mo</span>
                      <strong className="insights-total-amount insights-total-amount--before">$2,535</strong>
                    </div>
                  </div>
      
                  <div className="insights-after" aria-label="Optimized monthly spend after Credex-style changes">
                    <h3 className="insights-panel-title insights-panel-title--after">After Credex</h3>
                    <div className="insights-row">
                      <span className="insights-model">Claude 3.5 Haiku</span>
                      <div className="insights-bar-track"><div className="insights-bar insights-bar--opt" style={{ width: "100%" }}></div></div>
                      <span className="insights-price">$640</span>
                    </div>
                    <div className="insights-row">
                      <span className="insights-model">GPT-4o-mini</span>
                      <div className="insights-bar-track"><div className="insights-bar insights-bar--opt" style={{ width: "27.3%" }}></div></div>
                      <span className="insights-price">$175</span>
                    </div>
                    <div className="insights-row">
                      <span className="insights-model">Claude 3.5 Sonnet</span>
                      <div className="insights-bar-track"><div className="insights-bar insights-bar--opt-muted" style={{ width: "43.75%" }}></div></div>
                      <span className="insights-price">$280</span>
                    </div>
                    <div className="insights-row">
                      <span className="insights-model">GPT-4o</span>
                      <div className="insights-bar-track"><div className="insights-bar insights-bar--opt-muted" style={{ width: "25%" }}></div></div>
                      <span className="insights-price">$160</span>
                    </div>
                    <div className="insights-total insights-total--after">
                      <span>Total/mo</span><strong>$1,255</strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>
      
            <section className="features-section features-section--bottom" id="what-it-does" aria-labelledby="features-heading">
              <div className="features-inner">
                <h2 id="features-heading">From your stack to numbers you can forward</h2>
                <p className="features-lead">
                  Free AI spend audit—no login.
                  <br />
                  One stack snapshot, defensible savings math, a report link for finance or your team.
                </p>
                <div className="features-grid">
                  <article className="feature-card feature-card--a">
                    <div className="feature-card-visual" aria-hidden="true">
                      <svg viewBox="0 0 200 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect className="fc-live-metric" x="8" y="8" width="56" height="28" rx="4" fill="rgba(56,189,248,0.12)" stroke="rgba(56,189,248,0.35)" />
                        <text x="14" y="22" fill="#94a3b8" fontSize="9" fontFamily="system-ui, sans-serif">Spend</text>
                        <text x="14" y="32" fill="#e2e8f0" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="600">$2.8k</text>
                        <rect className="fc-live-metric" x="72" y="8" width="56" height="28" rx="4" fill="rgba(167,139,250,0.1)" stroke="rgba(167,139,250,0.35)" />
                        <text x="78" y="22" fill="#94a3b8" fontSize="9" fontFamily="system-ui, sans-serif">Tools</text>
                        <text x="78" y="32" fill="#e2e8f0" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="600">6</text>
                        <rect className="fc-live-metric" x="136" y="8" width="56" height="28" rx="4" fill="rgba(74,222,128,0.1)" stroke="rgba(74,222,128,0.35)" />
                        <text x="142" y="22" fill="#94a3b8" fontSize="9" fontFamily="system-ui, sans-serif">Save</text>
                        <text x="142" y="32" fill="#4ade80" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="600">18%</text>
                        <rect className="fc-live-frame" x="12" y="46" width="176" height="54" rx="6" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.08)" />
                        <path
                          className="fc-live-line"
                          d="M22 88 L44 72 L68 78 L92 58 L118 64 L142 48 L178 52"
                          stroke="url(#viz-a-line)"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                        <path
                          className="fc-live-fill"
                          d="M22 88 L44 72 L68 78 L92 58 L118 64 L142 48 L178 52 V96 H22 Z"
                          fill="url(#viz-a-fill)"
                          opacity="0.35"
                        />
                        <circle className="fc-live-dot" cx="178" cy="52" r="4" fill="#34d399" />
                        <defs>
                          <linearGradient id="viz-a-line" x1="22" y1="58" x2="178" y2="88" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#38bdf8" />
                            <stop offset="1" stopColor="#34d399" />
                          </linearGradient>
                          <linearGradient id="viz-a-fill" x1="22" y1="48" x2="178" y2="96" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#38bdf8" stopOpacity="0.5" />
                            <stop offset="1" stopColor="#34d399" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="feature-card-bottom">
                      <div className="feature-card-head">
                        <span className="feature-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M4 19h16M4 15l4-4 4 4 4-6 4 4" />
                          </svg>
                        </span>
                        <h3>Log your AI stack</h3>
                      </div>
                      <p className="feature-card-desc">
                        Tools, spend, seats, use case—saved if you reload.
                      </p>
                    </div>
                  </article>
      
                  <article className="feature-card feature-card--b">
                    <div className="feature-card-visual" aria-hidden="true">
                      <svg viewBox="0 0 200 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect className="fc-live-panel" x="16" y="16" width="168" height="80" rx="8" fill="rgba(0,0,0,0.35)" stroke="rgba(74,222,128,0.25)" />
                        <path className="fc-live-dashes" d="M32 36h96M32 52h120M32 68h72" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
                        <rect className="fc-live-bar" x="40" y="78" width="28" height="22" rx="3" fill="rgba(74,222,128,0.35)" />
                        <rect className="fc-live-bar" x="76" y="72" width="28" height="28" rx="3" fill="rgba(74,222,128,0.55)" />
                        <rect className="fc-live-bar" x="112" y="64" width="28" height="36" rx="3" fill="rgba(74,222,128,0.75)" />
                        <rect className="fc-live-bar" x="148" y="76" width="28" height="24" rx="3" fill="rgba(74,222,128,0.4)" />
                        <circle className="fc-live-ring" cx="168" cy="28" r="14" fill="rgba(74,222,128,0.15)" stroke="#4ade80" strokeWidth="1.5" />
                        <path className="fc-live-check" d="M162 28l4 4 8-10" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="feature-card-bottom">
                      <div className="feature-card-head">
                        <span className="feature-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="4" y="4" width="16" height="16" rx="2" />
                            <path d="M9 9h6M9 13h4M9 17h6" strokeLinecap="round" />
                          </svg>
                        </span>
                        <h3>Rule-based audit</h3>
                      </div>
                      <p className="feature-card-desc">
                        Plan fit, cheaper tiers, alternatives—priced from PRICING_DATA.md, not vibes.
                      </p>
                    </div>
                  </article>
      
                  <article className="feature-card feature-card--c">
                    <div className="feature-card-visual" aria-hidden="true">
                      <svg viewBox="0 0 200 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect className="fc-live-panel" x="24" y="20" width="152" height="72" rx="10" fill="#0f1114" stroke="rgba(167,139,250,0.45)" strokeWidth="1.5" />
                        <rect className="fc-live-skeleton" x="36" y="32" width="128" height="8" rx="2" fill="rgba(148,163,184,0.25)" />
                        <rect className="fc-live-skeleton" x="36" y="46" width="96" height="6" rx="2" fill="rgba(148,163,184,0.15)" />
                        <rect className="fc-live-skeleton" x="36" y="58" width="112" height="6" rx="2" fill="rgba(148,163,184,0.15)" />
                        <circle className="fc-live-ring" cx="156" cy="38" r="16" fill="rgba(167,139,250,0.25)" />
                        <path className="fc-live-cross" d="M148 38h16M156 30v16" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="feature-card-bottom">
                      <div className="feature-card-head">
                        <span className="feature-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" />
                          </svg>
                        </span>
                        <h3>Report in one link</h3>
                      </div>
                      <p className="feature-card-desc">
                        One public report page with a rich link preview—no personal details on it.
                      </p>
                    </div>
                  </article>
      
                  <article className="feature-card feature-card--d">
                    <div className="feature-card-visual" aria-hidden="true">
                      <svg viewBox="0 0 200 112" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g className="fc-live-mail">
                          <rect x="40" y="28" width="120" height="68" rx="8" fill="#0f1114" stroke="rgba(251,191,36,0.45)" strokeWidth="1.5" />
                          <path className="fc-live-mail-edge" d="M40 36l60 38 60-38" stroke="rgba(251,191,36,0.5)" strokeWidth="1.5" strokeLinecap="round" />
                        </g>
                        <rect className="fc-live-skeleton" x="56" y="54" width="88" height="8" rx="2" fill="rgba(148,163,184,0.2)" />
                        <rect className="fc-live-skeleton" x="56" y="68" width="64" height="6" rx="2" fill="rgba(148,163,184,0.12)" />
                        <circle className="fc-live-stamp" cx="158" cy="44" r="18" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="1.5" />
                        <path className="fc-live-plus" d="M152 44h12M158 38v12" stroke="#fcd34d" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="feature-card-bottom">
                      <div className="feature-card-head">
                        <span className="feature-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <path d="m22 6-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <h3>Email after value</h3>
                      </div>
                      <p className="feature-card-desc">
                        Email optional after results—confirmation plus summary when they opt in.
                      </p>
                    </div>
                  </article>
                </div>
              </div>
            </section>
          </div>
    </>
  );
}
