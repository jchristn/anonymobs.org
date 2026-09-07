/* ============================================================
   anonymobs — Mob Control clan hub
   Data-driven rendering + interactions
   Content compiled Sept 2026 from public community guides &
   official Voodoo channels. Mechanics shift with patches.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- tiny helpers ---------- */
  const h = (html) => html; // readability marker
  const el = (id) => document.getElementById(id);
  const lines = (arr) => arr.map(([cls, lab, txt]) =>
    `<div class="u-line ${cls}"><span class="lab">${lab}</span><span>${txt}</span></div>`).join("");

  /* Icon: uses the real game art at assets/icons/<slug>.png if present,
     otherwise falls back to the emoji automatically (no code change needed). */
  function slugify(name) {
    return name.toLowerCase()
      .replace(/\(.*?\)/g, " ")        // drop parentheticals
      .replace(/&amp;/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  function iconMarkup(u) {
    const s = u.slug || slugify(u.name);
    return `<span class="u-ico">` +
      `<img class="ico-img" src="assets/icons/${s}.png" alt="" loading="lazy" ` +
      `onload="this.parentNode.classList.add('has-img')" onerror="this.remove()">` +
      `<span class="ico-emoji">${u.icon}</span></span>`;
  }

  /* Rated meters. 3-step: low|medium|high · 4-step: bad|normal|good|best */
  const RATE_META = {
    low:    { n: 3, i: 1, c: "var(--red)",    t: "Low" },
    medium: { n: 3, i: 2, c: "var(--gold)",   t: "Medium" },
    high:   { n: 3, i: 3, c: "var(--lime)",   t: "High" },
    bad:    { n: 4, i: 1, c: "var(--red)",    t: "Bad" },
    normal: { n: 4, i: 2, c: "var(--orange)", t: "Normal" },
    good:   { n: 4, i: 3, c: "var(--lime)",   t: "Good" },
    best:   { n: 4, i: 4, c: "var(--cyan)",   t: "Best" },
  };
  function meterRow(label, value) {
    const m = RATE_META[value] || RATE_META.medium;
    let segs = "";
    for (let j = 0; j < m.n; j++) {
      segs += `<span class="seg${j < m.i ? " on" : ""}"${j < m.i ? ` style="background:${m.c}"` : ""}></span>`;
    }
    return `<div class="meter"><span class="meter-lab">${label}</span>` +
      `<span class="meter-bar">${segs}</span>` +
      `<span class="meter-val" style="color:${m.c}">${m.t}</span></div>`;
  }
  function meterCard(u, spec) {
    const badge = u.tier ? `<span class="badge tier-${u.tier}">${u.tier === "Niche" ? "Niche" : u.tier + "-tier"}</span>` : "";
    const uvPill = u.uv ? ` <span class="pill unverified" title="Community-reported / not fully confirmed">community-reported</span>` : "";
    return `
      <div class="u-card">
        ${badge}
        <div class="u-head">
          ${iconMarkup(u)}
          <div><div class="u-name">${u.name}</div><div class="u-role">${u.role || ""}</div></div>
        </div>
        <p class="u-effect">${u.effect}${uvPill}</p>
        <div class="meters">${spec.map(function (s) { return meterRow(s[0], u.stats[s[1]]); }).join("")}</div>
      </div>`;
  }

  /* ============================================================
     SECTION: ABOUT
     ============================================================ */
  const aboutHTML = `
    <div class="section-head">
      <span class="section-eyebrow">🎯 Welcome</span>
      <h2 class="section-title">Who we are &amp; how to read this hub</h2>
      <p class="section-intro">
        We are <strong>Anonymobs</strong>, a fun, friendly, and active clan in <em>Mob Control</em>. You can find us
        using <strong>“Anonymobs”</strong> or the identifier below. This site is meant to share advice to our clan and
        beyond on the best loadouts and progression paths through the series of Mob Control events.
      </p>
      <div class="clan-id" id="clanId">
        <span class="clan-id-lab">Clan ID</span>
        <code class="clan-id-code" id="clanIdCode">fe565cfc-8b3b-423c-83a0-b53a9147aec7</code>
        <button class="clan-id-copy" id="clanIdCopy" type="button" aria-label="Copy clan identifier to clipboard" title="Copy to clipboard">
          <svg class="ci-copy" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <svg class="ci-check" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12.5l4 4 10-10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span class="ci-label">Copy</span>
        </button>
      </div>
    </div>

    <div class="grid cols-3">
      <div class="u-card"><div class="u-head"><div class="u-ico">🤝</div><div><div class="u-name">Clan-first</div><div class="u-role">Sparks &amp; shared pots</div></div></div>
        <p class="u-effect">Every Piggy/Space Race we all play feeds a shared prize pot. More active racers = bigger rewards for <em>everyone</em>. We show up together.</p></div>
      <div class="u-card"><div class="u-head"><div class="u-ico">📈</div><div><div class="u-name">Get good, fast</div><div class="u-role">Loadouts that win</div></div></div>
        <p class="u-effect">Copy the builds below, stop wasting coins, and climb the Champions League ladder toward God tier without the trial-and-error.</p></div>
      <div class="u-card"><div class="u-head"><div class="u-ico">🌐</div><div><div class="u-name">Every platform</div><div class="u-role">iOS · Android · Switch · Steam · Xbox</div></div></div>
        <p class="u-effect">Play on your phone, the couch, or PC — <em>Mob Control</em> runs everywhere and so do we.</p></div>
    </div>

    <details class="collapsible" open>
      <summary>
        <span class="sum-ico">📖</span>
        <span class="sum-text"><span class="sum-title">Core glossary — the words we use</span>
        <span class="sum-sub">Gates, sparks, stars, ultimates &amp; the rest</span></span>
        <span class="sum-chev">▾</span>
      </summary>
      <div class="collapsible-body">
        <div class="table-scroll">
          <table class="ref">
            <thead><tr><th>Term</th><th>What it means</th></tr></thead>
            <tbody>
              <tr><td><strong>Gate</strong></td><td>Lane checkpoint that changes your crowd size — <strong>multiplier</strong> (×2, ×3) or <strong>math</strong> (+50, −20). Picking the better gate at each split is the core skill.</td></tr>
              <tr><td><strong>Multiplier</strong></td><td>The exponential engine. Chaining a math gate <em>then</em> a multiplier (e.g. +50 → ×3) usually beats a single big gate.</td></tr>
              <tr><td><strong>Cannon</strong></td><td>Your turret — 1 loadout slot. Changes firing pattern/effect. <strong>Fire-rate</strong> upgrades apply to every cannon → always your first spend.</td></tr>
              <tr><td><strong>Mob</strong></td><td>The little units you fire. Fast mobs = weak; slow mobs = tanky. 1 loadout slot.</td></tr>
              <tr><td><strong>Champion</strong></td><td>A big hero unit you deploy for boss waves / dense fights. 1 loadout slot.</td></tr>
              <tr><td><strong>Ultimate</strong></td><td>A chargeable super button (rockets, abductions, extra gates). 1 loadout slot. Time it — don't waste it early.</td></tr>
              <tr><td><strong>Stars</strong></td><td><em>Individual</em> progression currency → climbs the <strong>Champions League</strong> toward God tier.</td></tr>
              <tr><td><strong>Sparks</strong></td><td><em>Clan</em> contribution currency from race events → ranks the clan on the monthly <strong>Clans League</strong>.</td></tr>
              <tr><td><strong>Bricks</strong> (blue)</td><td>Looting currency → build your base → earn stars.</td></tr>
              <tr><td><strong>Coins</strong></td><td>Soft currency — used only to level up cards.</td></tr>
              <tr><td><strong>Skip'Its</strong></td><td>Consumables that skip rewarded-ad waits / boosters. Precious during tournaments &amp; Pinatas.</td></tr>
              <tr><td><strong>Loot window</strong></td><td>The moment you break the enemy base — stack ultimates &amp; champions here for max loot.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </details>

    <div class="callout note"><span class="c-ico">🧭</span><span>
      <strong>How the quick-reference works.</strong> Each cannon / mob / champion / ultimate card lists
      <span style="color:var(--lime)">strengths</span>, <span style="color:var(--red)">weaknesses</span>, and
      <span style="color:var(--cyan)">when to use it</span>. Tier badges (S / A / B / Niche) reflect current
      community consensus. A <span class="pill unverified">dashed pill</span> means the detail is community-reported
      and not fully confirmed — trust the in-game screen over us when they disagree.
    </span></div>
  `;

  /* ============================================================
     DATA: CANNONS
     ============================================================ */
  // Cannons use their own card with rated meters (not Strong/Weak/Use).
  // fire & power: low | medium | high   ·   charge: bad | normal | good | best
  const cannons = [
    { icon: "🔫", name: "Single / Rapid Fire", role: "Starter", tier: "C",
      effect: "Your default turret — fires one mob at a time (Rapid Fire = a steady continuous stream). What you learn on; move off it fast.",
      stats: { fire: "low", power: "low", charge: "bad" } },
    { icon: "💥", name: "Shotgun", role: "Burst", tier: "B",
      effect: "Fires a clump of ~4 normal mobs per shot — a great chunk of bodies to shove through a multiplier at once.",
      stats: { fire: "high", power: "medium", charge: "good" } },
    { icon: "🎲", name: "Lucky Shot", role: "RNG burst", tier: "B",
      effect: "Fires a random number of mobs per shot — sometimes a trickle, sometimes a flood. Strong average, streaky in practice.",
      stats: { fire: "high", power: "medium", charge: "good" } },
    { icon: "🧨", name: "Big Bertha", role: "Giant shots", tier: "Niche",
      effect: "Fires GIANT mobs instead of normal ones — few bodies, huge power each. A Pinata, Arena / competitive, and Kraken favorite (pairs with Sirion) where raw punch beats count.",
      stats: { fire: "low", power: "high", charge: "bad" } },
    { icon: "🔺", name: "Double Shot", role: "Balanced", tier: "A",
      effect: "Two continuous streams of mobs — the reliable all-rounder and your general-purpose default while you build toward Flamethrower or Triple.",
      stats: { fire: "high", power: "medium", charge: "good" } },
    { icon: "🔱", name: "Triple Shot", role: "Max output", tier: "S",
      effect: "Three joined streams — the highest raw mob output in the game and the looting/farming king. Often tied to VIP / Elite.",
      stats: { fire: "high", power: "medium", charge: "best" } },
    { icon: "🎯", name: "Sniper", role: "Precision", tier: "Niche",
      effect: "A high-power precision cannon — a 'roided-up shotgun' that punches single targets hard, but fast mobs can fly through under-multiplied.",
      stats: { fire: "low", power: "high", charge: "normal" } },
    { icon: "🔥", name: "Flamethrower", role: "Buff / control", tier: "S",
      effect: "Hold the red button to breathe fire — flames roughly DOUBLE your mobs' HP &amp; power (and burn enemies). Runs on fuel that slowly refills. Top-tier offense AND defense.",
      stats: { fire: "high", power: "high", charge: "good" } },
    { icon: "⚡", name: "Railshot", role: "Piercing", tier: "A",
      effect: "A piercing high-velocity cannon featured in community 'Lucky Battles' loadouts — clean, reliable clears round to round.",
      stats: { fire: "medium", power: "high", charge: "good" } },
    { icon: "🟡", name: "Golden", role: "Premium", tier: "B", uv: true,
      effect: "A premium, fast-firing cannon community votes rank among the best — big damage, flashy visuals.",
      stats: { fire: "high", power: "high", charge: "best" } },
    { icon: "🔵", name: "Plasma", role: "Premium", tier: "B", uv: true,
      effect: "Community-described as slicing through enemy units 'like a hot knife through butter.'",
      stats: { fire: "high", power: "high", charge: "good" } },
    { icon: "❄️", name: "Freeze", role: "Crowd control", tier: "Niche", uv: true,
      effect: "A utility cannon reported to slow enemy units, buying your crowd time. Control over raw output.",
      stats: { fire: "medium", power: "low", charge: "normal" } },
  ];

  /* ============================================================
     DATA: MOBS (grouped)
     ============================================================ */
  // Mobs use meter cards: strength / speed / health (low | medium | high).
  const mobs = [
    { icon: "🙂", name: "Normie", role: "Backbone all-rounder",
      effect: "The default stickman — cheap, balanced, and multiplies well through gates. Your first big upgrade target and a reliable everyday mob.",
      stats: { strength: "medium", speed: "medium", health: "medium" } },
    { icon: "🛍️", name: "Paper Bag", role: "Balanced",
      effect: "A well-rounded alternative to Normie with a slightly different stat curve. A solid second 'safe' mob to keep leveled for Loadout Challenges.",
      stats: { strength: "medium", speed: "medium", health: "medium" } },
    { icon: "🪖", name: "Soldier", role: "Consistent",
      effect: "Balanced strength and reliability — mid-tier everywhere, excels nowhere. Good for straightforward win runs when you don't need a specialist.",
      stats: { strength: "medium", speed: "medium", health: "medium" } },
    { icon: "🦇", name: "Bat", role: "Fastest mob",
      effect: "The fastest mob in the game — pure speed, minimal muscle. Ideal spam for looting runs and races where getting there first wins.",
      stats: { strength: "low", speed: "high", health: "low" } },
    { icon: "🦝", name: "Raccoon", role: "Event staple",
      effect: "A community-favorite fast mob for Pinatas, Space Race and 'Lucky Battles' loadouts. High throughput, weak per-unit.",
      stats: { strength: "low", speed: "high", health: "low" } },
    { icon: "🥷", name: "Ninja", role: "Spammable",
      effect: "Highly spammable and quick — cheap, fast, floods lanes. Low individual power. Great for fast farming and speed maps.",
      stats: { strength: "low", speed: "high", health: "low" } },
    { icon: "👽", name: "Alien", role: "Flexible fast",
      effect: "Fast and flexible across level types — a reliable all-round fast unit, though not the strongest and still folds to tanks.",
      stats: { strength: "medium", speed: "high", health: "low" } },
    { icon: "🐔", name: "Chicken", role: "Filler fast",
      effect: "Fast, weak and spammable — cheap volume and among the weakest per unit. A filler fast option early on.",
      stats: { strength: "low", speed: "high", health: "low" } },
    { icon: "⚔️", name: "Knight", role: "Strongest mob",
      effect: "Repeatedly called the strongest mob — roughly worth 3–5 fast mobs. Massive power for straight fights and boss damage, but slow, so a poor looter.",
      stats: { strength: "high", speed: "low", health: "high" } },
    { icon: "🐻", name: "Bear", role: "Power + pace",
      effect: "Nearly as strong as Knight but moves faster, and pairs beautifully with Flamethrower — the fire buff makes it monstrous. Great for win builds and boss events.",
      stats: { strength: "high", speed: "medium", health: "high" } },
    { icon: "🪨", name: "Caveman", role: "Durable wall",
      effect: "Tanky, high HP and hard to stop — a durable wall of bodies for survival/defensive holds and sustained boss damage. Slow, so poor for loot runs.",
      stats: { strength: "high", speed: "low", health: "high" } },
  ];

  /* ============================================================
     DATA: CHAMPIONS
     ============================================================ */
  const champions = [
    { icon: "🤖", name: "Optimus Prime", role: "All-rounder · Transformers collab", tier: "S",
      effect: "Truck form carries &amp; multiplies your mobs, then transforms to fight when the crowds collide. Widely called the best overall champion.",
      good: "Top damage; multiplies your push; can be tapped to activate early; fits almost any event.",
      bad: "Can stutter on older/laggy devices; collab unit (limited availability post-event).",
      when: "Your default S-tier pick for win runs, Kraken, Rumble &amp; general climbing." },
    { icon: "🐝", name: "Bumblebee", role: "Speed striker · Transformers collab", tier: "S",
      effect: "Car ↔ robot 'conversion' with a Stinger-Sword combo — an instant-kill car ram plus melee. Fastest mover in the game.",
      good: "Blazing speed; quick to charge; excellent when leveled ~10+ levels above your mob card.",
      bad: "Melee slightly below Nexus; needs the level lead to shine; collab unit.",
      when: "When your champion is well ahead of your mobs — races &amp; fast aggression." },
    { icon: "🧿", name: "Nexus", role: "Defensive tank", tier: "A",
      effect: "A tanky crowd-control bruiser — the best base-game all-rounder and a strong looting escort.",
      good: "Way tankier than Sirion; great vs enemy champions; helps you reach the goal for looting.",
      bad: "Limited range; not a burst threat.",
      when: "Long/looting runs, survival, anti-champion matchups — the F2P workhorse until you get collab champs." },
    { icon: "🎯", name: "Sirion", role: "Ranged / anti-mob", tier: "Niche",
      effect: "A ranged support unit — good range makes it the most CONSISTENT Pinata champion despite being fragile elsewhere.",
      good: "Long range keeps it contributing; best-in-class for Pinata throughput.",
      bad: "Made of paper — dies fast; struggles to reach the goal in tough fights.",
      when: "Pinata rounds. Elsewhere it's a placeholder until better champions." },
    { icon: "🫧", name: "Big Blob", role: "Instant-win burst", tier: "B",
      effect: "'Pops' and instantly defeats ~80 of almost anything (mobs or champions); popped enemies respawn on YOUR side. Charges its ultimate meter very fast.",
      good: "Instant early dominance; hard walls melt; fastest ultimate charge.",
      bad: "Lowest loot output of any champion — terrible for farming.",
      when: "When you just need to WIN a hard level, not when you're grinding loot." },
    { icon: "💣", name: "Explodon", role: "AoE detonator", tier: "B",
      effect: "Jump-and-crush attacker with a 'Final Boom' area skill; tap to manually detonate. Featured in 'Lucky Battles' loadouts.",
      good: "Good AoE burst; works on offense &amp; defense (can defend while you're away).",
      bad: "Hard to time well; loot output is low.",
      when: "Rumble/Lucky-Battles builds and defensive holds — for players who like manual timing." },
    { icon: "🗿", name: "Great Normie", role: "Looting super-unit", tier: "B",
      effect: "The giant Normie doubling as a champion-class bruiser — massacres enemy champions and loots huge WITH big gates at high level.",
      good: "Highest loot ceiling of the farming builds; wrecks enemy champions.",
      bad: "Needs big gates + high level (~75+) to loot well; weak/slow otherwise.",
      when: "High-level Piggy Race farming with Summon Gate + Ultimate-boost skill." },
    { icon: "🔫", name: "Megatron", role: "Heavy hitter · collab", tier: "B", uv: true,
      effect: "A Transformers-collab champion. Kit specifics are thin in public sources — treat as a premium heavy hitter.",
      good: "Collab prestige unit; strong on paper.",
      bad: "Least-documented of the collab four; availability limited after the event.",
      when: "If you unlocked it during the collab — otherwise informational." },
    { icon: "✈️", name: "Starscream", role: "Ranged stun · collab", tier: "B", uv: true,
      effect: "Dual-form: robot form fires null-ray cannons that STUN enemy champions; jet form does a high-speed missile barrage then returns (cooldown-gated).",
      good: "Ranged pressure + champion stun; flexible form-switching.",
      bad: "Cooldown-gated burst; newest &amp; least community data; limited availability.",
      when: "Situational control pick if you have it." },
  ];

  /* ============================================================
     DATA: ULTIMATES
     ============================================================ */
  const ultimates = [
    { icon: "🛸", name: "Mass Abduct", role: "Looting", tier: "S",
      effect: "Abducts enemy units out of the crowd (removing defenders) and is STACKABLE — you can land more than one on the final base.",
      good: "The top looting ultimate; stack it on the enemy gate to overlap the loot window.",
      bad: "Weak until its duration passes ~5s (roughly level 35+) — needs investment first.",
      when: "Piggy Race / Piggy Flash brick farming — stack on the final base." },
    { icon: "🚁", name: "Mob Copter", role: "Looting", tier: "S",
      effect: "An aerial mob-drop / abduction tool. Paired with Mass Abduct as the best-in-class looting duo.",
      good: "Excellent loot; stacks on enemy gates; the other half of the looting meta.",
      bad: "Same low-level caveat — weak until duration is upgraded.",
      when: "Loot-focused runs; interchangeable with Mass Abduct depending on which you've leveled." },
    { icon: "🚀", name: "Rocket Barrage", role: "Offense / boss", tier: "A",
      effect: "Bombs the enemy crowd — area bombardment that destroys towers and opens the loot window.",
      good: "High damage; the early-game workhorse (dominant through ~the first 50 levels); best for boss &amp; tower clears.",
      bad: "Needs manual aim before the base falls; less loot-efficient than the abduct pair late.",
      when: "Kraken boss damage, Rumble win runs, tower-destruction Loadout Challenges &amp; early progression." },
    { icon: "🌀", name: "Summon Gate", role: "Multiplier / fuel", tier: "A",
      effect: "Drops an EXTRA multiplier gate into the lane — more mobs, more loot, more fuel per wave.",
      good: "Multiplies output; the signature Space Race trick (place it BEFORE fuel gates); pairs with Great Normie.",
      bad: "Very specific — not an all-purpose pick.",
      when: "Space Race (before fuel gates) &amp; high-level Great Normie farming." },
    { icon: "🌈", name: "Rainbow Rage", role: "Buff", tier: "B",
      effect: "Buffs your mobs' damage &amp; survivability, keeping more units alive into the loot window.",
      good: "Versatile; works across many champions (Great Normie, Big Blob, etc.).",
      bad: "Polarizing — some players swear by it, some guides don't recommend it; timing-dependent for loot.",
      when: "A flexible generalist buff if you prefer keeping mobs alive over stacking abductions." },
    { icon: "🛰️", name: "UFO Laser", role: "Advanced looting", tier: "B",
      effect: "A specialized destructive beam — a higher-skill end-of-level looting tool.",
      good: "Better looting payout IF you learn to time it well; high ceiling.",
      bad: "Skill/timing-dependent; not beginner-friendly.",
      when: "Advanced players squeezing extra loot from the final base." },
  ];

  /* ============================================================
     DATA: EVENTS (with multiple loadouts each)
     ============================================================ */
  const slot = (lab, emoji, val) =>
    `<div class="slot"><div class="slot-lab">${lab}</div><div class="slot-val"><span class="slot-emoji">${emoji}</span>${val}</div></div>`;

  function loadoutCard(lo) {
    const boosters = lo.boosters
      ? slot("Boosters", "✨", lo.boosters) : "";
    return `
      <div class="loadout">
        <div class="loadout-top">
          <span class="loadout-name">${lo.name}</span>
          <span class="loadout-tag">${lo.tag}</span>
        </div>
        <div class="slots">
          ${slot("Cannon", "🔫", lo.cannon)}
          ${slot("Champion", "🦸", lo.champion)}
          ${slot("Ultimate", "⚡", lo.ultimate)}
          ${slot("Mob", "🏃", lo.mob)}
          ${boosters}
        </div>
        <div class="loadout-lines">
          <div class="ll good"><span class="lab">Strong</span><span>${lo.good}</span></div>
          <div class="ll bad"><span class="lab">Weak</span><span>${lo.bad}</span></div>
          <div class="ll when"><span class="lab">Use&nbsp;when</span><span>${lo.when}</span></div>
        </div>
      </div>`;
  }

  const events = [
    {
      icon: "🐷⚡", name: "Piggy Flash", sub: "Short-burst looting race",
      what: "A compressed 'flash' version of the Piggy Race that alternates in the schedule with Space Race. Same rules as Piggy Race — loot bricks, multiply, cross milestone 'lines' for a shared prize pool paid out by placement — but a much shorter window, so burst efficiency matters more.",
      strat: [
        "Only play during the <strong>×2 win-streak bonus window</strong> — every line is worth double and you can't grind it back later.",
        "Keep the win-streak bar maxed; the short format punishes idle stretches.",
        "Multiply your loot at the end of every base unless the roll is terrible.",
        "Get <strong>2 champions + at least 1 ultimate</strong> deployed before you win the base for max loot on the finishing hit.",
        "<strong>Don't craft shields</strong> — staying attackable lets you farm high-value revenge attacks (huge during ×2).",
      ],
      loadouts: [
        { name: "Super-Mob Looter", tag: "High ceiling", cannon: "Flamethrower", champion: "Great Normie", ultimate: "Summon Gate", mob: "Highest-level mob",
          good: "Scales hardest at high account level; Summon Gate multiplies loot.", bad: "Dead weight if your Great Normie is under-leveled.", when: "Your Great Normie is high level and you run the Ultimate-boost arsenal skill." },
        { name: "Standard Looter", tag: "Forgiving", cannon: "Flamethrower / Triple", champion: "Optimus Prime / Bumblebee", ultimate: "Mass Abduct or Mob Copter", mob: "Bat / Raccoon (fast)",
          good: "Works at any level; stack abductions on the final base for a loot spike.", bad: "Slightly lower ceiling than the super-mob build.", when: "The safe default — use whenever Great Normie isn't ready." },
      ],
    },
    {
      icon: "🐷", name: "Piggy Race", sub: "Weekend looting race (~50 racers)",
      what: "The flagship weekend looting race. You're placed against ~50 players + bots and progress through milestone 'lines' by looting and spending blue bricks. Each milestone feeds a shared prize pool distributed by final placement. Best-documented event in the game.",
      strat: [
        "Priority order: <strong>time played &gt; multiplying loot &gt; high card levels &gt; the perfect loadout</strong>.",
        "Always multiply your loot at the end of a battle (unless the roll is awful).",
        "Play during the <strong>×2 win-streak window</strong> — it dramatically increases lines.",
        "Farm <strong>revenge attacks</strong> — during ×2 they can pay ~6 lines each. <strong>Never craft shields.</strong>",
        "Deploy 2 champions + 1 ultimate before winning each base for better finishing loot.",
        "Logistics: put ~<strong>2× the points into Loot Time vs Multiplier</strong> unless an Elite gives you the free multiplier. Extra Loot Time beats Teleport for most players.",
        "Always join the <strong>hardest difficulty</strong> offered — bigger pot.",
      ],
      loadouts: [
        { name: "Great Normie Build", tag: "Max ceiling", cannon: "Flamethrower", champion: "Great Normie", ultimate: "Summon Gate", mob: "Highest-level mob",
          good: "Highest loot ceiling; pairs with the Ultimate-boost arsenal skill; super-mobs loot more per unit.", bad: "Needs a high-level Great Normie — weak if under-leveled.", when: "Late-game accounts with Great Normie invested." },
        { name: "Transformer Build", tag: "Reliable", cannon: "Flamethrower / Triple", champion: "Bumblebee / Optimus Prime", ultimate: "Mass Abduct or Mob Copter", mob: "Best fast mob",
          good: "Consistent &amp; level-agnostic; stack ultimates on the final base.", bad: "Slightly lower ceiling than the Great Normie build at max level.", when: "The default for essentially all mid-level players." },
      ],
    },
    {
      icon: "🐙", name: "Kraken (Kraken Clash)", sub: "Clan boss-damage event",
      what: "A CLAN event: your whole clan collectively damages the Kraken boss 'before your clan sinks.' Standard gate-multiplying gameplay, but framed as a boss fight with survival elements across multiple phases. It's a damage race — your contribution stacks with your clanmates' toward shared rewards.",
      strat: [
        "Treat it like a <strong>win-focused, high-throughput battle</strong> — hit every multiplier gate and keep mobs alive to maximise boss damage.",
        "Survival matters ('before your clan sinks') — bring <strong>tanky mobs + a strong champion</strong> so your push isn't wiped before it lands.",
        "Coordinate with the clan — everyone's damage pools toward the shared reward tiers.",
        "Save your ultimate for boss waves / dense phases rather than dumping it early.",
      ],
      note: "Exact scoring &amp; reward tiers aren't fully public — these builds are the documented 'winning battles' meta applied to a boss, not an officially confirmed Kraken loadout.",
      loadouts: [
        { name: "Max Damage", tag: "Burst", cannon: "Flamethrower", champion: "Optimus Prime", ultimate: "Rocket Barrage", mob: "Knight / Bear (tank)",
          good: "Rocket Barrage is the go-to boss-damage ultimate; Flamethrower's fire buff + tanks survive to deal damage.", bad: "Slower push; less loot on the side.", when: "Your clan needs raw damage output on the boss." },
        { name: "Sustain / Survival", tag: "Longevity", cannon: "Flamethrower", champion: "Nexus", ultimate: "Mob Copter or Mass Abduct", mob: "Bear / Caveman",
          good: "Prioritizes staying alive through boss phases for cumulative damage.", bad: "Lower burst than the Rocket build.", when: "Survival phases are wiping your push before it reaches the Kraken." },
      ],
    },
    {
      icon: "🚀", name: "Space Race", sub: "Fuel speed-race with leagues",
      what: "A fuel-focused SPEED race with league progression. Collect fuel through fuel gates, then finish the level as fast as possible — faster completions advance you. You must conquer one league before entering the next; higher league = better prizes. Alternates with Piggy Flash. Stronger clans build bigger prize pots.",
      strat: [
        "Send mobs through <strong>fuel gates immediately</strong>, then end the level fast — speed is the currency, not raw loot.",
        "<strong>Place Summon Gate BEFORE the fuel gates</strong> to multiply the fuel you collect — the signature Space Race trick.",
        "Run <strong>fast mobs</strong> (Raccoon / Alien / Bat) to finish quickly.",
        "Steady participation beats sporadic spikes for placement; coordinate with the clan to raise the pot.",
        "Along with Piggy Race, this is one of the two best events to funnel your clan Sparks into.",
      ],
      loadouts: [
        { name: "Fuel Multiplier", tag: "Default", cannon: "Triple Shot", champion: "Optimus Prime / Nexus", ultimate: "Summon Gate (before fuel gates)", mob: "Raccoon / Alien (fast)",
          good: "Maximizes multiplied fuel per level — the standard Space Race build.", bad: "Relies on hitting the Summon Gate placement right.", when: "Fuel collection is the bottleneck (most maps)." },
        { name: "Speed Finisher", tag: "Rush", cannon: "Flamethrower", champion: "Bumblebee / Optimus Prime", ultimate: "Mass Abduct / Mob Copter", mob: "Bat / Ninja (fastest)",
          good: "Grab fuel then blitz the end gate for the fastest completion times.", bad: "Less fuel multiplication than the Summon Gate build.", when: "Maps where finishing SPEED, not fuel, is the limiter." },
      ],
    },
    {
      icon: "🥊", name: "Rumble", sub: "Themed battle rounds → free Skip'Its",
      what: "A themed battle event (Optimus Prime Rumble, Sirion Rumble, XMAS Rumble, etc.). Its biggest value is FREE Skip'Its — two for 1st place. You play successive rounds and rewards scale up per round, maxing out around round 17.",
      strat: [
        "<strong>Play to round 17, then stop</strong> — that's where Skip'It / reward scaling caps. Further rounds waste time &amp; energy.",
        "Aim for <strong>1st place</strong> in your grouping to bank the 2 free Skip'Its.",
        "Use a reliable WIN loadout — Rumble rewards clean clears, not loot volume.",
      ],
      note: "The 'two Skip'Its for 1st' and 'cap at round 17' figures come from a community playbook, not an official post — verify against your current event screen.",
      loadouts: [
        { name: "Lucky Battles Loadout", tag: "Community pick", cannon: "Railshot", champion: "Explodon", ultimate: "Rocket Barrage", mob: "Raccoon",
          good: "A tested, reliable round-to-round clear used widely by the community.", bad: "Needs those specific cards leveled.", when: "You have the cards — the purpose-built Rumble build." },
        { name: "Standard Win Build", tag: "Fallback", cannon: "Flamethrower", champion: "Optimus Prime", ultimate: "Rocket Barrage", mob: "Knight / Bear (tank)",
          good: "The documented 'winning battles' meta; survives to the base and finishes.", bad: "Lower loot; slower than fast-mob builds.", when: "You lack the Lucky Battles cards — a robust generic win build." },
      ],
    },
    {
      icon: "🎛️", name: "Loadout Challenge", sub: "Twice-weekly · Champions League stars",
      what: "Runs twice a week. You win battles / complete missions using SPECIFIC assigned or constrained cards to earn extra Champions League stars. It's designed to reward card upgrades and force variety — you won't always get your favorite loadout.",
      strat: [
        "Play the assigned cards well rather than fighting the format — the reward is <strong>Champions League stars</strong>, so consistent wins beat a dream loadout.",
        "Lean on fundamentals when handed sub-optimal cards: <strong>split mobs across lanes</strong>, <strong>chain multipliers</strong> (×2→×3 beats a lone ×4), and match cannon movement to moving gates.",
        "Keep a <strong>broad set of cards leveled</strong> (Normie, Paper Bag + a tank) so any assigned loadout is at least mid-viable — that's the whole point of the event.",
      ],
      loadouts: [
        { name: "Clear &amp; Win (when you choose)", tag: "Objective", cannon: "Flamethrower (if allowed)", champion: "Optimus Prime", ultimate: "Rocket Barrage", mob: "Knight / Bear",
          good: "Reliable wins to bank Champions League stars.", bad: "Slower, low loot — but loot isn't the point here.", when: "Standard 'win the battle' objectives." },
        { name: "Tower Destruction", tag: "Aggro", cannon: "Railshot / Triple", champion: "Best available", ultimate: "Rocket Barrage", mob: "Raccoon",
          good: "Rocket Barrage is the go-to for 'destroy the towers' style challenges.", bad: "Needs aggressive aim/timing.", when: "Objectives that ask you to blow up towers / structures fast." },
      ],
    },
    {
      icon: "🪅", name: "Pinata Levels", sub: "Bonus rounds · Star / Coin / Block",
      what: "Bonus rounds where you funnel mobs through gates to smash Piñatas for big payouts. Three reward flavors: STAR pinata (stars — the highest-value type for progression), COIN pinata (coins — economy), and BLOCK pinata (building bricks). Pinata score is speed × multiplication × your two boosters.",
      strat: [
        "The two core Pinata boosters are <strong>Fast Charge</strong> and <strong>×10</strong> — use both whenever you care about the output.",
        "Play at <strong>full aggression the entire duration</strong> and commit to the single best gate path (highest multiplier chain).",
        "<strong>Sirion</strong> is the most consistent Pinata champion — its range keeps it contributing.",
        "<strong>Spend Skip'Its on boosters for STAR pinatas on high-output maps</strong> — that's the best ROI. Don't burn Skip'Its the same way on Coin/Block rounds.",
      ],
      note: "Recent 2026 uploads reference a 'nerfed' Star Pinata — output may be lower than older guides suggest.",
      loadouts: [
        { name: "Signature Pinata Build", tag: "Standard", cannon: "Big Bertha", champion: "Sirion", ultimate: "—", mob: "Raccoon", boosters: "Fast Charge + ×10",
          good: "The community-standard high-output setup — giant shots + ranged Sirion.", bad: "Big Bertha is slow; useless outside high-multiplier Pinata maps.", when: "STAR pinatas on high-output maps — spend Skip'Its on boosters here." },
        { name: "Throughput Build", tag: "Volume", cannon: "Triple / Flamethrower", champion: "Sirion (→ Optimus if it dies early)", ultimate: "Summon Gate", mob: "Raccoon / Alien", boosters: "Fast Charge + ×10",
          good: "Raw mob volume + an extra multiply gate — great for long gate chains &amp; brick volume.", bad: "Less per-hit punch than Big Bertha.", when: "BLOCK pinatas (max bricks) &amp; maps with long multiplier chains." },
      ],
    },
  ];

  /* ============================================================
     RENDERERS
     ============================================================ */
  function unitCard(u) {
    const badge = u.tier ? `<span class="badge tier-${u.tier}">${u.tier === "Niche" ? "Niche" : u.tier + "-tier"}</span>` : "";
    const uvPill = u.uv ? `<span class="pill unverified" title="Community-reported / not fully confirmed">community-reported</span>` : "";
    return `
      <div class="u-card">
        ${badge}
        <div class="u-head">
          ${iconMarkup(u)}
          <div><div class="u-name">${u.name}</div><div class="u-role">${u.role}${uvPill ? " " : ""}</div></div>
        </div>
        <p class="u-effect">${u.effect} ${uvPill}</p>
        <div class="u-lines">
          ${lines([
            ["good", "Strong", u.good],
            ["bad", "Weak", u.bad],
            ["when", "Use", u.when],
          ])}
        </div>
      </div>`;
  }

  const CANNON_SPEC = [["Fire rate", "fire"], ["Mob power", "power"], ["Champion charge", "charge"]];

  function renderCannons() {
    const legend = `
      <div class="legend">
        <span class="pill" style="border-color:rgba(255,203,69,.5);color:var(--gold)">S · meta</span>
        <span class="pill" style="border-color:rgba(126,217,87,.5);color:var(--lime)">A · strong</span>
        <span class="pill" style="border-color:rgba(56,189,248,.5);color:var(--cyan)">B · solid</span>
        <span class="pill" style="border-color:rgba(255,138,61,.5);color:var(--orange)">Niche</span>
        <span class="pill unverified">community-reported</span>
      </div>`;
    el("cannons").innerHTML = `
      <div class="section-head">
        <span class="section-eyebrow">🔫 Cannons</span>
        <h2 class="section-title">Every cannon, ranked</h2>
        <p class="section-intro">Your cannon is one loadout slot. Whatever you run, <strong>upgrade fire-rate first</strong> — it boosts every cannon and is never wasted. The consensus top two are <strong>Flamethrower</strong> (win the fight) and <strong>Triple</strong> (farm the loot). Each card rates <strong>fire rate</strong>, <strong>mob power</strong>, and how fast it charges your <strong>champion &amp; ultimate</strong> meter (more mobs fired = faster charge).</p>
        ${legend}
      </div>
      <div class="grid cols-auto">${cannons.map(function (c) { return meterCard(c, CANNON_SPEC); }).join("")}</div>
      <p class="inline-tip">💡 Golden / Plasma / Freeze are premium/community picks — nice if you own them, but Flamethrower + Triple cover 95% of situations. Ratings are relative and approximate (fire rates shift with card level &amp; patches).</p>
    `;
  }

  const MOB_SPEC = [["Strength", "strength"], ["Speed", "speed"], ["Health", "health"]];

  function renderMobs() {
    el("mobs").innerHTML = `
      <div class="section-head">
        <span class="section-eyebrow">🏃 Mobs</span>
        <h2 class="section-title">Every mob type</h2>
        <p class="section-intro">One golden rule governs all mobs: <strong>the faster a mob, the weaker it is; the slower, the tankier.</strong> Fast mobs reach the base first (great for looting &amp; races); high-strength, high-health mobs win contested lanes &amp; bosses. Match the mob to the job — each card rates <strong>strength</strong>, <strong>speed</strong> and <strong>health</strong>. Enemy card level is matched within ~±7 of yours.</p>
      </div>
      <div class="grid cols-auto">${mobs.map(function (m) { return meterCard(m, MOB_SPEC); }).join("")}</div>
    `;
  }

  function renderChampions() {
    el("champions").innerHTML = `
      <div class="section-head">
        <span class="section-eyebrow">🦸 Champions</span>
        <h2 class="section-title">Every champion</h2>
        <p class="section-intro">A champion is a big hero unit you deploy for boss waves &amp; dense fights. Keep your champion <strong>~7–10 levels above your mob card</strong> for noticeably easier wins. <strong>Optimus Prime</strong> tops the community list; <strong>Nexus</strong> is the best free workhorse; <strong>Sirion</strong> owns Pinatas.</p>
      </div>
      <div class="grid cols-auto">${champions.map(unitCard).join("")}</div>
      <div class="callout note"><span class="c-ico">🤖</span><span>The <strong>Transformers</strong> champions (Optimus, Bumblebee, Megatron, Starscream) came from a crossover that ran ~2024–early 2026. If the collab isn't live, availability may be limited to whatever permanent unlock path Voodoo kept — check in-game.</span></div>
    `;
  }

  function renderUltimates() {
    el("ultimates").innerHTML = `
      <div class="section-head">
        <span class="section-eyebrow">⚡ Ultimates</span>
        <h2 class="section-title">Every ultimate</h2>
        <p class="section-intro">Your ultimate is a chargeable super button — and the heart of the <strong>loot window</strong>. Golden rule: <strong>don't fire early.</strong> Hold for mob congestion, boss waves, or the moment you crack the enemy base. The looting meta lives on <strong>Mass Abduct</strong> + <strong>Mob Copter</strong>; <strong>Rocket Barrage</strong> rules early game &amp; bosses.</p>
      </div>
      <div class="grid cols-auto">${ultimates.map(unitCard).join("")}</div>
    `;
  }

  function eventBlock(ev, i) {
    const note = ev.note ? `<div class="callout warn"><span class="c-ico">⚠️</span><span>${ev.note}</span></div>` : "";
    return `
      <details class="collapsible"${i === 0 ? " open" : ""}>
        <summary>
          <span class="sum-ico">${ev.icon}</span>
          <span class="sum-text"><span class="sum-title">${ev.name}</span><span class="sum-sub">${ev.sub}</span></span>
          <span class="sum-chev">▾</span>
        </summary>
        <div class="collapsible-body">
          <p class="section-intro" style="font-size:.98rem">${ev.what}</p>
          <div class="sub-title" style="margin-top:18px">🧠 Strategy</div>
          <ul class="checklist">${ev.strat.map(s => `<li>${s}</li>`).join("")}</ul>
          ${note}
          <div class="sub-title" style="margin-top:18px">🎒 Loadouts <span class="tag-count">pick based on your account</span></div>
          ${ev.loadouts.map(loadoutCard).join("")}
        </div>
      </details>`;
  }

  function renderEvents() {
    el("events").innerHTML = `
      <div class="section-head">
        <span class="section-eyebrow">📅 Events</span>
        <h2 class="section-title">Event playbook &amp; loadouts</h2>
        <p class="section-intro">Every recurring event, what it rewards, how to attack it, and <strong>at least two tuned loadouts each</strong> with when to run which. Tap any event to expand. These are starting points — adapt to your card levels and the map in front of you.</p>
        <div class="callout tip"><span class="c-ico">🎒</span><span><strong>Two loadouts, one rule of thumb:</strong> the higher-ceiling build wants a high-level account (esp. Great Normie); the <em>forgiving</em> build works at any level. When unsure, run the forgiving one.</span></div>
      </div>
      ${events.map(eventBlock).join("")}
    `;
  }

  /* ============================================================
     STRATEGY SECTION (looting / cards / tiers)
     ============================================================ */
  const tierLadder = [
    { ico: "🥉", name: "Lower Leagues", desc: "Rookie → Bronze/Silver/Gold bands (exact names vary in-game)" },
    { ico: "🏅", name: "Mid Leagues", desc: "Grind stars, tighten your win loadout" },
    { ico: "🔮", name: "Fabled", desc: "Near the top — sits just below Immortal" },
    { ico: "💠", name: "Immortal", desc: "Confirmed top-end league; the final gate before God" },
    { ico: "👑", name: "GOD Tier", desc: "The pinnacle tournament — earn your 'G' tag", peak: true },
  ];

  function renderStrategy() {
    el("strategy").innerHTML = `
      <div class="section-head">
        <span class="section-eyebrow">🧠 Strategy</span>
        <h2 class="section-title">Fast-track to God tier</h2>
        <p class="section-intro">Three levers move your account: <strong>how you loot</strong>, <strong>how you spend upgrades</strong>, and <strong>how you climb the ladder</strong>. Get these right and you'll out-pace players who've been grinding twice as long.</p>
      </div>

      <details class="collapsible" open>
        <summary><span class="sum-ico">💰</span><span class="sum-text"><span class="sum-title">1 · Looting — farm bricks &amp; rewards</span><span class="sum-sub">Chests, ads, and the loot window</span></span><span class="sum-chev">▾</span></summary>
        <div class="collapsible-body">
          <p class="section-intro" style="font-size:.98rem">Loot (blue bricks) builds your base, which earns stars, which climbs the ladder. Cards come from booster packs, league rewards, daily offers, login rewards, events, rewarded ads &amp; purchases.</p>
          <ol class="steps">
            <li><strong>Fire-rate before giants.</strong> Higher rewards/fire-rate cost less of your stack, so income compounds — upgrade this first.</li>
            <li><strong>Run the farm loadout:</strong> Triple Cannon + fast mobs (Bat/Ninja/Raccoon) + Mass Abduct or Mob Copter = fastest brick looting.</li>
            <li><strong>Stack ultimates on the final base.</strong> You can land more than one Mass Abduct / Mob Copter on the enemy gate for a big loot spike.</li>
            <li><strong>Multiply loot every run</strong> (unless the roll is terrible) and <strong>watch the reward-multiplier ad</strong> at the end.</li>
            <li><strong>Speed up gift/event chests with ads</strong> (or Skip'Its), and claim the rotating <strong>free daily coin/card offers</strong> every day.</li>
            <li><strong>During races, don't craft shields</strong> — staying attackable farms high-value revenge attacks.</li>
          </ol>
        </div>
      </details>

      <details class="collapsible">
        <summary><span class="sum-ico">🃏</span><span class="sum-text"><span class="sum-title">2 · Leveling cards — go narrow, not wide</span><span class="sum-sub">The single biggest F2P mistake to avoid</span></span><span class="sum-chev">▾</span></summary>
        <div class="collapsible-body">
          <p class="section-intro" style="font-size:.98rem">Every card levels independently with duplicates + coins, and costs scale up fast. Spreading resources across many cards stalls your power everywhere. <strong>Commit to one of each slot and pour everything in.</strong></p>
          <div class="sub-title">Upgrade order</div>
          <ol class="steps">
            <li><strong>Cannon fire-rate first</strong> — it applies to every cannon, so it's never wasted. Highest-value early spend.</li>
            <li><strong>One main mob</strong> — Normie is cheap &amp; balanced to ~75; then a tank (Knight/Bear) or Paper Bag.</li>
            <li><strong>One main champion</strong> — Nexus/Sirion early; chase the Optimus Prime line. Keep it 7–10 levels above your mob.</li>
            <li><strong>One main ultimate</strong> — Rocket Barrage is worth leveling early; Mass Abduct/Mob Copter only shine once duration &gt; ~5s (level ~35+).</li>
          </ol>
          <div class="grid cols-2">
            <div class="u-card"><div class="u-name" style="margin-bottom:6px">✔ Upgrade first</div>
              <ul class="checklist" style="margin-top:4px">
                <li>Cannon fire-rate</li><li>Flamethrower (once unlocked) or Shotgun/Double early</li>
                <li>One main mob (Normie → a tank)</li><li>Optimus Prime line</li>
              </ul></div>
            <div class="u-card"><div class="u-name" style="margin-bottom:6px">✕ Don't sink coins into (yet)</div>
              <ul class="checklist crosslist" style="margin-top:4px">
                <li>Great Normie / Explodon / Big Blob as upgrade targets</li><li>Single-shot cannons</li>
                <li>Tiny-duration new ultimates</li><li>Spreading across many cards "to try them"</li>
              </ul></div>
          </div>
          <div class="callout tip"><span class="c-ico">💡</span><span>Guides estimate you can max <strong>~6 cards</strong> before running dry — enough to keep a farm loadout <em>and</em> a win loadout. Commit, don't hoard.</span></div>
        </div>
      </details>

      <details class="collapsible">
        <summary><span class="sum-ico">👑</span><span class="sum-text"><span class="sum-title">3 · Tiers — reach God tier as fast as possible</span><span class="sum-sub">Champions League ladder &amp; the fast path</span></span><span class="sum-chev">▾</span></summary>
        <div class="collapsible-body">
          <p class="section-intro" style="font-size:.98rem">The competitive ladder is the <strong>Champions League</strong>, driven by <strong>Championship Stars</strong> (win battles, defend your base, place in tournaments). Climb the leagues; reaching the final league unlocks the exclusive <strong>God Tier</strong> tournament.</p>
          <div class="ladder">
            ${tierLadder.map(r => `<div class="rung${r.peak ? " peak" : ""}"><span class="rung-ico">${r.ico}</span><span class="rung-name">${r.name}</span><span class="rung-desc">${r.desc}</span></div>`).join("")}
          </div>
          <div class="callout warn"><span class="c-ico">⚠️</span><span><strong>On the exact ladder names:</strong> <em>Immortal</em> and <em>Fabled</em> are confirmed near the top, and <em>God Tier</em> is the pinnacle (community reports: top ~10,000 players compete over ~4 weekly periods by stars gained for a permanent 'G' tag, with internal levels inside God tier). The full mid-ladder names and thresholds — and whether 'Sacred' is a real league — <strong>we could not confirm</strong>. Trust your in-game league screen for the exact ladder.</span></div>
          <div class="sub-title">The fast path</div>
          <ol class="steps">
            <li><strong>Win rate is everything.</strong> Build the strongest <em>reliable</em> loadout (maxed cannon + fire-rate, one deep mob, high-level Optimus). Consistency beats peak loot when climbing.</li>
            <li><strong>Defend your base.</strong> Stars come from fortifying too — a strong base means overnight raids don't bleed your stars.</li>
            <li><strong>Push during star-multiplier events</strong> (World Clash, Piggy Races) where stars-gained is the ranking metric.</li>
            <li><strong>Save champions &amp; ultimates for boss waves</strong> to convert hard levels into wins instead of losses.</li>
            <li><strong>Narrow upgrading</strong> (section 2) is the fastest way to out-power your matchmaking bucket.</li>
          </ol>
          <div class="grid cols-2">
            <div class="u-card"><div class="u-name" style="margin-bottom:6px">Common mistakes</div>
              <ul class="checklist crosslist" style="margin-top:4px">
                <li>Spreading upgrades → underpowered everywhere</li><li>Farming loadout when you should be winning (they're different builds!)</li>
                <li>Neglecting base defense → losing stars to raids</li><li>Blowing ultimates early &amp; losing boss waves</li>
              </ul></div>
            <div class="u-card"><div class="u-name" style="margin-bottom:6px">F2P vs paying</div>
              <p class="u-effect" style="margin-top:4px">F2P absolutely climbs — bucketed matchmaking rewards power-in-your-bracket over raw spend. If you do pay, best <em>value</em> is <strong>Remove-Ads/VIP</strong> (unlocks Triple Cannon, discounts the Battle Pass), then the <strong>Battle Pass</strong>, then <strong>Skip'Its</strong> for tournament crunch.</p></div>
          </div>
        </div>
      </details>

      <details class="collapsible">
        <summary><span class="sum-ico">🪙</span><span class="sum-text"><span class="sum-title">Bonus · Economy cheat-sheet</span><span class="sum-sub">What each currency is for</span></span><span class="sum-chev">▾</span></summary>
        <div class="collapsible-body">
          <div class="table-scroll"><table class="ref">
            <thead><tr><th>Currency</th><th>Used for</th><th>Best practice</th></tr></thead>
            <tbody>
              <tr><td><strong>Coins</strong></td><td>Card upgrades only</td><td>Spend narrow; top up via end-of-run ads when short.</td></tr>
              <tr><td><strong>Blue bricks</strong></td><td>Base building → stars → rank</td><td>Farm with Triple + fast mobs + Mass Abduct/Mob Copter.</td></tr>
              <tr><td><strong>Cards / dupes</strong></td><td>Leveling individual units</td><td>Rarity = drop rate; narrow focus levels far faster.</td></tr>
              <tr><td><strong>Skip'Its</strong></td><td>Skip ad-waits / boosters</td><td>Save for tournaments &amp; Star Pinata boosters — highest ROI.</td></tr>
              <tr><td><strong>Gold</strong></td><td>Premium reward tiers / store</td><td>Comes from clan &amp; event rewards — another reason to be in a strong clan.</td></tr>
            </tbody>
          </table></div>
        </div>
      </details>
    `;
  }

  /* ============================================================
     JOIN SECTION
     ============================================================ */
  function renderJoin() {
    el("join").innerHTML = `
      <div class="section-head">
        <span class="section-eyebrow">🤝 Join</span>
        <h2 class="section-title">Run with anonymobs</h2>
        <p class="section-intro">Clans in <em>Mob Control</em> aren't cosmetic — they're your prize pool. Every Piggy Race &amp; Space Race the clan plays feeds a shared pot that pays out by rank, plus a monthly <strong>Clans League</strong> on total <strong>Sparks</strong>. More active members = bigger rewards for all of us. That's the whole pitch.</p>
      </div>

      <div class="join-card">
        <h3>Better rewards. Better players. Better vibes.</h3>
        <div class="join-perks">
          <div class="perk"><div class="perk-ico">🎁</div><b>Shared prize pots</b><span>Race events pay out by placement — a bigger, more active clan means a fatter pot for everyone.</span></div>
          <div class="perk"><div class="perk-ico">🏆</div><b>Clans League climb</b><span>Monthly Sparks leaderboard → name frames, boosters, gold, Skip'Its &amp; booster packs.</span></div>
          <div class="perk"><div class="perk-ico">🧠</div><b>Strategy on tap</b><span>This whole hub, plus live loadout talk for every event as the meta shifts.</span></div>
          <div class="perk"><div class="perk-ico">🐙</div><b>Clan events</b><span>Kraken Clash and friends are only fun with a coordinated crew pulling together.</span></div>
        </div>

        <div class="join-steps">
          <div class="sub-title" style="justify-content:center;text-align:center;display:block">How to join</div>
          <ol class="steps">
            <li>Open <strong>Mob Control</strong> → tap the <strong>Clan</strong> menu.</li>
            <li>Hit <strong>Search</strong> and look up <strong>“anonymobs”</strong>, then request to join.</li>
            <li><strong>Join before an event starts</strong> and stay through reward-claim — you only keep a race's Sparks if you're in the same clan from start to claim. Don't clan-hop mid-event or your Sparks are voided.</li>
            <li>Show up for Piggy Race &amp; Space Race, coordinate on Kraken, and climb with us.</li>
          </ol>
        </div>

        <div class="callout tip" style="text-align:left"><span class="c-ico">📌</span><span><strong>Recruiting tip for members:</strong> the mid-event rule means commitment matters. Tell recruits to join <em>before</em> starting races and stay put until they've claimed rewards.</span></div>

        <p class="edit-note">
          ✏️ <strong>Clan owner:</strong> replace the placeholders above with your real join details — exact clan tag/name spelling, a required trophy/tier minimum, and your Discord invite link — by editing the <code>renderJoin()</code> block in <code>app.js</code>. Everything else on this page is ready to publish.
        </p>
      </div>
    `;
  }

  function renderContribute() {
    el("contribute").innerHTML = `
      <div class="contribute-card">
        <div class="contribute-ico">🛠️</div>
        <h3>Found a problem? Want to improve the site?</h3>
        <p>File an issue or enhancement request on our GitHub repository and we'll get it done!</p>
        <a class="btn btn-primary" href="https://github.com/jchristn/anonymobs.org/issues/new" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="flex-shrink:0"><path fill="currentColor" d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.75.81 1.2 1.84 1.2 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></svg>
          Open an issue on GitHub
        </a>
        <p class="contribute-sub">Repo: <a href="https://github.com/jchristn/anonymobs.org" target="_blank" rel="noopener noreferrer">github.com/jchristn/anonymobs.org</a></p>
      </div>
    `;
  }

  /* ============================================================
     INTERACTIONS: theme, menu, scroll-spy, progress
     ============================================================ */
  function initTheme() {
    const KEY = "anonymobs-theme";
    const root = document.documentElement;
    const stored = (function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } })();
    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    const initial = stored || (prefersLight ? "light" : "dark");
    root.setAttribute("data-theme", initial);

    el("themeToggle").addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
    });
  }

  function initClipboard() {
    const btn = el("clanIdCopy");
    const code = el("clanIdCode");
    if (!btn || !code) return;
    let resetTimer = null;
    btn.addEventListener("click", function () {
      const text = code.textContent.trim();
      const done = function (ok) {
        btn.classList.toggle("copied", ok);
        const lbl = btn.querySelector(".ci-label");
        if (lbl) lbl.textContent = ok ? "Copied!" : "Press ⌘/Ctrl+C";
        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(function () {
          btn.classList.remove("copied");
          if (lbl) lbl.textContent = "Copy";
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { fallback(); });
      } else { fallback(); }
      function fallback() {
        try {
          const r = document.createRange(); r.selectNodeContents(code);
          const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
          const ok = document.execCommand("copy"); sel.removeAllRanges(); done(ok);
        } catch (e) { done(false); }
      }
    });
  }

  function initMenu() {
    const btn = el("menuToggle");
    const nav = el("nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.matches("a")) { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
  }

  function initScroll() {
    const navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
    const sections = navLinks
      .map(a => document.getElementById(a.getAttribute("href").slice(1)))
      .filter(Boolean);
    const progress = el("scrollProgress");

    function onScroll() {
      const st = window.scrollY || document.documentElement.scrollTop;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (docH > 0 ? (st / docH) * 100 : 0) + "%";

      const mid = st + window.innerHeight * 0.32;
      let current = sections[0];
      for (const s of sections) { if (s.offsetTop <= mid) current = s; }
      navLinks.forEach(a => a.classList.toggle("active", current && a.getAttribute("href") === "#" + current.id));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    el("about").innerHTML = aboutHTML;
    renderCannons();
    renderMobs();
    renderChampions();
    renderUltimates();
    renderEvents();
    renderStrategy();
    renderJoin();
    renderContribute();

    initTheme();
    initClipboard();
    initMenu();
    initScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
