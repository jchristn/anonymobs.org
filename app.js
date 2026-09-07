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
    const uvPill = u.uv ? ` <span class="pill unverified" title="Community-reported / not fully confirmed">community-reported</span>` : "";
    return `
      <div class="u-card">
        <div class="u-head">
          <div><div class="u-name">${u.name}</div><div class="u-role">${u.role || ""}</div></div>
        </div>
        <p class="u-effect">${u.effect}${uvPill}</p>
        <div class="meters">${spec.map(function (s) { return meterRow(s[0], u.stats[s[1]]); }).join("")}</div>
      </div>`;
  }

  /* Section wrapper — each reference section is collapsible. */
  function sectionShell(icon, title, sub, intro, body, open) {
    return `
      <details class="collapsible section-collapse"${open ? " open" : ""}>
        <summary>
          <span class="sum-ico">${icon}</span>
          <span class="sum-text"><span class="sum-title">${title}</span><span class="sum-sub">${sub}</span></span>
          <span class="sum-chev">▾</span>
        </summary>
        <div class="collapsible-body">
          ${intro ? `<p class="section-intro">${intro}</p>` : ""}
          ${body}
        </div>
      </details>`;
  }

  /* ============================================================
     SECTION: ABOUT
     ============================================================ */
  const CLAN_ID = "fe565cfc-8b3b-423c-83a0-b53a9147aec7";
  function clanIdBlock() {
    return `
      <div class="clan-id">
        <span class="clan-id-lab">Clan ID</span>
        <code class="clan-id-code">${CLAN_ID}</code>
        <button class="clan-id-copy" type="button" aria-label="Copy clan identifier to clipboard" title="Copy to clipboard">
          <svg class="ci-copy" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <svg class="ci-check" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12.5l4 4 10-10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span class="ci-label">Copy</span>
        </button>
      </div>`;
  }

  const aboutHTML = `
    <div class="section-head">
      <span class="section-eyebrow">🎯 Welcome</span>
      <h2 class="section-title">Who we are &amp; how to read this hub</h2>
      <p class="section-intro full">
        We are <strong>Anonymobs</strong>, a fun, friendly, and active clan in <em>Mob Control</em>. You can find us
        using <strong>“Anonymobs”</strong> or the identifier below. This site is meant to share advice to our clan and
        beyond on the best loadouts and progression paths through the series of Mob Control events.
      </p>
      ${clanIdBlock()}
    </div>

    <div class="grid cols-2">
      <div class="u-card"><div class="u-head"><div class="u-ico">🤝</div><div><div class="u-name">Clan-first</div><div class="u-role">Sparks &amp; shared pots</div></div></div>
        <p class="u-effect">Every event we all play feeds a shared prize pot. More active players = bigger rewards for <em>everyone</em>. We show up together.</p></div>
      <div class="u-card"><div class="u-head"><div class="u-ico">📈</div><div><div class="u-name">Get good, fast</div><div class="u-role">Loadouts that win</div></div></div>
        <p class="u-effect">Use the builds below, stop wasting coins, and climb the Champions League ladder toward God tier without the trial-and-error.</p></div>
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

  `;

  /* ============================================================
     DATA: CANNONS
     ============================================================ */
  // Cannons — rated meters (fire & power: low|medium|high · charge: bad|normal|good|best).
  // No tier ranking: the best cannon is situational — see the event builds.
  const cannons = [
    { name: "Single Shot", role: "Default starter",
      effect: "The default 'Regular' cannon — shoots mobs one at a time, upgrading in tiny ~0.1 increments. What you learn on; don't level it past ~10.",
      stats: { fire: "low", power: "low", charge: "bad" } },
    { name: "Rapid Fire", role: "Early stream",
      effect: "Unlocks at Base 1 — a constant, unstoppable stream of single mobs. A clear step up from Single Shot's one-at-a-time fire, but low burst and still early-game.",
      stats: { fire: "medium", power: "low", charge: "normal" } },
    { name: "Shotgun", role: "Burst",
      effect: "Fires a clump of ~4 normal mobs per shot — a great chunk of bodies to shove through a multiplier at once.",
      stats: { fire: "high", power: "medium", charge: "good" } },
    { name: "Lucky Shot", role: "RNG burst",
      effect: "Fires a random number of mobs per shot — sometimes a trickle, sometimes a flood. Strong average, streaky in practice.",
      stats: { fire: "high", power: "medium", charge: "good" } },
    { name: "Big Bertha", role: "Giant shots",
      effect: "Fires GIANT mobs instead of normal ones — few bodies, huge power each, but no safety net if your push gets overrun. A Pinata / Arena / Kraken favourite where raw punch beats count.",
      stats: { fire: "low", power: "high", charge: "bad" } },
    { name: "Double", role: "Coverage looter",
      effect: "Two continuous streams — more coverage than a single stream, and it charges your champion FASTER than Triple. A superb all-round looting cannon.",
      stats: { fire: "high", power: "medium", charge: "best" } },
    { name: "Sniper", role: "Precision",
      effect: "A high-power precision cannon — a 'roided-up shotgun' that punches single targets hard, but fast mobs can fly through under-multiplied.",
      stats: { fire: "low", power: "high", charge: "normal" } },
    { name: "Flamethrower", role: "Buff / safety net",
      effect: "Hold the red button to breathe fire — flames roughly DOUBLE your mobs' HP &amp; power (and burn enemies). Runs on fuel that slowly refills. Your safety-net cannon.",
      stats: { fire: "high", power: "high", charge: "good" } },
    { name: "Railshot", role: "Piercing",
      effect: "A piercing high-velocity cannon — clean, reliable clears round to round.",
      stats: { fire: "medium", power: "high", charge: "good" } },
    { name: "Triple", role: "Max output",
      effect: "Three joined streams — the highest raw mob output in the game. Great throughput, though a slower champion charge than Double and often tied to VIP / Elite.",
      stats: { fire: "high", power: "medium", charge: "good" } },
  ];

  /* ============================================================
     DATA: MOBS (grouped)
     ============================================================ */
  // Mobs — meter cards: strength / speed / health (low | medium | high).
  const mobs = [
    { name: "Normie", role: "Backbone all-rounder",
      effect: "The default stickman — cheap, balanced, and multiplies well through gates. Your first big upgrade target and a reliable everyday mob.",
      stats: { strength: "medium", speed: "medium", health: "medium" } },
    { name: "Ninja", role: "Spammable fast",
      effect: "Highly spammable and quick — cheap, fast, floods lanes. Low individual power. Great for fast farming and speed maps.",
      stats: { strength: "low", speed: "high", health: "low" } },
    { name: "Chicken", role: "Filler fast",
      effect: "Fast, weak and spammable — cheap volume and among the weakest per unit. Gets an aura buff from the Giga Chicken champion.",
      stats: { strength: "low", speed: "high", health: "low" } },
    { name: "Bear", role: "Power + pace",
      effect: "Nearly as strong as Knight but moves faster, and pairs beautifully with Flamethrower — the fire buff makes it monstrous. Great for win builds and boss events.",
      stats: { strength: "high", speed: "medium", health: "high" } },
    { name: "Alien", role: "Flexible fast",
      effect: "Fast and flexible across level types — a reliable all-round fast unit, though not the strongest and still folds to tanks.",
      stats: { strength: "medium", speed: "high", health: "low" } },
    { name: "Paper Bag", role: "Balanced",
      effect: "A well-rounded alternative to Normie with a slightly different stat curve. A solid second 'safe' mob to keep leveled for Loadout Challenges.",
      stats: { strength: "medium", speed: "medium", health: "medium" } },
    { name: "Soldier", role: "Consistent",
      effect: "Balanced strength and reliability — mid-tier everywhere, excels nowhere. A solid slow-ish body for farming builds that want fast champion charge.",
      stats: { strength: "medium", speed: "medium", health: "medium" } },
    { name: "Knight", role: "Strongest mob",
      effect: "Repeatedly called the strongest mob — roughly worth 3–5 fast mobs. Massive power for straight fights and boss damage. Slow, which is exactly why farming builds like it (fewer mobs on screen = faster champion charge).",
      stats: { strength: "high", speed: "low", health: "high" } },
    { name: "Bat", role: "Fastest mob",
      effect: "The fastest mob in the game — pure speed, minimal muscle. Ideal spam for speed races where getting there first wins.",
      stats: { strength: "low", speed: "high", health: "low" } },
    { name: "Caveman", role: "Durable wall",
      effect: "Tanky, high HP and hard to stop — a durable wall of bodies for survival/defensive holds, sustained boss damage, and slow-mob farming builds.",
      stats: { strength: "high", speed: "low", health: "high" } },
    { name: "Mini Blob", role: "Blob-family swarm", uv: true,
      effect: "The small unit in the Blob family (the same line as the Big Blob champion) — a swarmy little mob. Exact stats aren't published; ratings below are estimated, so confirm on the in-game card.",
      stats: { strength: "low", speed: "medium", health: "low" } },
    { name: "Raccoon", role: "Event staple",
      effect: "A community-favourite fast mob for Pinatas and Space Race. High throughput, weak per-unit.",
      stats: { strength: "low", speed: "high", health: "low" } },
  ];

  /* ============================================================
     DATA: CHAMPIONS
     ============================================================ */
  const champions = [
    { name: "Great Normie", role: "Looting super-unit",
      effect: "A giant Normie bruiser — massacres enemy champions and loots huge WITH big gates at high level.",
      good: "High loot ceiling; wrecks enemy champions.",
      bad: "Needs big gates + high level (~75+) to loot well; slow otherwise.",
      when: "High-level brick farming on maps with big multiplier gates." },
    { name: "Nexus", role: "Defensive workhorse",
      effect: "A tanky crowd-control bruiser and the most forgiving farming champion — easy to reach the goal and loot.",
      good: "Tanky &amp; reliable; low skill floor; pairs perfectly with Champion Overdrive.",
      bad: "Not a burst threat; lower ceiling than Lootboxer/Mobzilla once those are mastered.",
      when: "The F2P / beginner farming default and survival runs." },
    { name: "Sirion", role: "Ranged buffer",
      effect: "A ranged support champion whose long range keeps it contributing; it buffs your mobs and is the most consistent Pinata champion.",
      good: "Long range; makes your mobs stronger; stacks brilliantly with Champion Overdrive (spawn many Sirions).",
      bad: "Fragile — dies fast in melee.",
      when: "Max-block looting builds (with Overdrive) and Pinata rounds." },
    { name: "Explodon", role: "AoE detonator",
      effect: "Jump-and-crush attacker with a 'Final Boom' area skill; tap to manually detonate.",
      good: "Good AoE burst; works on offense &amp; defense (can defend while you're away).",
      bad: "Hard to time well; low loot output.",
      when: "Win runs, Rumble &amp; defensive holds — for players who like manual timing." },
    { name: "Big Blob", role: "Instant-win burst",
      effect: "'Pops' and instantly defeats ~80 of almost anything (mobs or champions); popped enemies respawn on YOUR side. Charges its ultimate meter very fast.",
      good: "Instant dominance; hard walls melt; fastest ultimate charge.",
      bad: "Lowest loot output of any champion — bad for farming.",
      when: "When you just need to WIN a hard level, not when you're grinding loot." },
    { name: "Captain Kaboom", role: "Explosive speedster",
      effect: "An explosive champion built to bomb enemy mobs and towers fast — a speed/clash specialist.",
      good: "Excellent for timed &amp; clash events — a top pick for World Clash and Space Race.",
      bad: "Weak brick output — poor at looting / max-block takes.",
      when: "Timed &amp; clash-style events where you clear fast, not resource-max battles." },
    { name: "Mobzilla", role: "Ranged brick farmer",
      effect: "A giant ranged 'kaiju' champion that evolves from an egg form — a top brick-limit farmer on death-gate maps.",
      good: "Ranged attack shines on death-gate maps; hits the brick limit with the fewest champions needed.",
      bad: "Slow to charge; the egg form is tricky to play well.",
      when: "Piggy-race / brick-limit farming once you've mastered it." },
    { name: "Lootboxer", role: "Star generator",
      effect: "The only champion that directly generates STARS. Anchors the top 'LB/PP' (Lootboxer + Pinata Party) farming meta.",
      good: "Direct Star output; multiplies hugely with Champion Overdrive clones.",
      bad: "Higher skill ceiling than Nexus — needs many clones to shine.",
      when: "Star-focused progression once you have Overdrive / Pinata Party leveled." },
    { name: "Stack Troopers", role: "Seasonal trooper", uv: true,
      effect: "A seasonal soldier/trooper-themed champion from the 'Stack Attacks' Troopers season.",
      good: "Seasonal collectible with a trooper-stacking theme.",
      bad: "Ability specifics are thin in public sources.",
      when: "If you unlocked it during its season — verify its exact kit in-game." },
    { name: "Giga Chicken", role: "Evolving buffer", uv: true,
      effect: "A season champion with two skills — 'Evolution' (grows/upgrades in battle) and 'Big Cluck Aura' (buffs your Chicken mobs).",
      good: "In-battle evolution plus an aura buff for Chicken mobs.",
      bad: "Combat role &amp; tier aren't reliably documented yet.",
      when: "Chicken-mob synergy builds; unlocked via its season's missions/blueprints." },
  ];

  /* ============================================================
     DATA: ULTIMATES
     ============================================================ */
  const ultimates = [
    { name: "Rocket Barrage", role: "Offense / boss",
      effect: "Bombs the enemy crowd — area bombardment that destroys towers and opens the loot window.",
      good: "High damage; the early-game workhorse; best for boss &amp; tower clears.",
      bad: "Needs manual aim; less loot-efficient than the farming ultimates late.",
      when: "Boss damage (Kraken), Rumble win runs, tower-destruction challenges &amp; early progression." },
    { name: "Mass Abduction", role: "Looting",
      effect: "Abducts enemy units out of the crowd (removing defenders) and is STACKABLE onto the final base.",
      good: "Strong looting; stack it on the enemy gate to overlap the loot window.",
      bad: "Weak until its duration passes ~5s (roughly level 35+).",
      when: "Brick farming — stack on the final base." },
    { name: "Rainbow Rage", role: "Buff",
      effect: "Buffs your mobs' damage &amp; survivability, keeping more units alive into the loot window.",
      good: "Versatile; works across many champions.",
      bad: "Polarizing &amp; timing-dependent; some prefer the farming ultimates.",
      when: "A flexible buff if you'd rather keep mobs alive than abduct." },
    { name: "Summon Gate", role: "Multiplier / fuel",
      effect: "Drops an EXTRA multiplier gate into the lane — more mobs, loot &amp; fuel per wave.",
      good: "Multiplies output; the signature Space Race trick (place it BEFORE fuel gates).",
      bad: "Very specific — not an all-purpose pick.",
      when: "Space Race and gate-multiplication farming." },
    { name: "MobCopter", role: "Looting / sustain",
      effect: "An aerial mob-drop / abduction tool — a survivability-leaning looting ultimate.",
      good: "Great loot &amp; staying power; stacks on enemy gates.",
      bad: "Same low-level caveat — weak until its duration is upgraded.",
      when: "Loot runs where you want survivability over pure abduction." },
    { name: "Champion Overdrive", role: "Champion multiplier",
      effect: "Spawns additional champion CLONES to swarm the loot phase — the key to hitting the Piggy brick limit.",
      good: "Best all-purpose farming ultimate; the default for Nexus, Lootboxer &amp; Mobzilla.",
      bad: "A farming tool — less useful in pure speed or defence.",
      when: "Brick/Star maximization. Unlocking it is a major milestone (pre- vs post-Overdrive play)." },
    { name: "Rainbowl", role: "Rolling damage + buff", uv: true,
      effect: "Rolls like a bowling ball, hits hard, and gives your mobs a power glow-up.",
      good: "Combines area damage with a mob-power buff.",
      bad: "Has seen balance nerfs; best-use context isn't well documented.",
      when: "Offense-heavy pushes." },
    { name: "Pinata Party", role: "Brick / Star converter",
      effect: "Drag a targeting circle — enemy mobs inside convert to pinata mobs; blue pinatas drop BRICKS on kill, yellow drop STARS, banked immediately (before the loot window). Raises the brick ceiling from 20k to 25k.",
      good: "Banks resources pre-loot; core of the LB/PP farming meta; strong on Pinata levels.",
      bad: "Converted mobs still advance — an uncontested one still counts as a loss; extra casts become purely defensive after the cap.",
      when: "Brick/Star farming, especially paired with Lootboxer." },
    { name: "Lucky Roll", role: "Dice RNG", uv: true,
      effect: "A dice-themed ultimate — 'roll the dice to rule the battle' for an RNG payoff.",
      good: "High-variance upside.",
      bad: "RNG-dependent; the exact effect isn't well documented publicly.",
      when: "A situational RNG pick; unlocked via missions/blueprints." },
  ];

  /* Towers — base-DEFENSE structures that protect your base during Base Invasions /
     revenge raids. Their exact in-game stats aren't publicly documented, so the roles
     below are described from each tower's name + how base defense works — confirm in-game. */
  const towers = [
    { name: "Reinforced Tower", role: "Armored wall", uv: true,
      effect: "A high-HP defensive tower — a tanky wall that soaks incoming mobs and slows a raid down.",
      good: "Raw durability; buys your damage towers time to work.",
      bad: "Deals little damage itself.",
      when: "The backbone of any base — level it so raiders can't punch straight through." },
    { name: "Machine Gun Tower", role: "Anti-swarm", uv: true,
      effect: "A rapid-fire tower that shreds streams of weak, fast mobs before they pile up.",
      good: "High rate of fire — melts swarms of fast mobs.",
      bad: "Struggles against high-HP giants.",
      when: "Against fast-mob / spam attackers." },
    { name: "Rocket Launcher Tower", role: "AoE splash", uv: true,
      effect: "Fires explosive rockets that deal splash damage to clustered mobs.",
      good: "Area damage clears big multiplied crowds at once.",
      bad: "Slower fire rate; weaker against single tanky units.",
      when: "Against large multiplied crowds pouring through gates." },
    { name: "Fire Blaster Tower", role: "Burn / DoT", uv: true,
      effect: "Burns attackers with damage-over-time flames that chew through dense pushes.",
      good: "Sustained area burn melts slow, heavy waves.",
      bad: "Ramp-up time; weak against fast lone runners.",
      when: "Against slow, high-HP pushes that linger in range." },
  ];

  /* ============================================================
     DATA: EVENTS (with multiple loadouts each)
     ============================================================ */
  const specRow = (lab, val) =>
    `<div class="bspec-row"><span class="bspec-lab">${lab}</span><span class="bspec-val">${val}</span></div>`;

  function buildBlock(b) {
    let rows = "";
    if (b.cannon) rows += specRow("Cannon", b.cannon);
    if (b.mob) rows += specRow("Mob", b.mob);
    if (b.champion) rows += specRow("Champion", b.champion);
    if (b.ultimate) rows += specRow("Ultimate", b.ultimate);
    if (b.boosters) rows += specRow("Power-ups", b.boosters);
    const how = b.how ? `<p class="ebuild-how"><span class="how-lab">How to play</span> ${b.how}</p>` : "";
    const why = b.why ? `<p class="ebuild-how"><span class="how-lab">Why</span> ${b.why}</p>` : "";
    return `
      <div class="ebuild ebuild-${b.tier.toLowerCase()}">
        <div class="ebuild-head">
          <span class="ebuild-badge tier-${b.tier}">${b.tier}-Tier</span>
          ${b.name ? `<span class="ebuild-name">${b.name}</span>` : ""}
        </div>
        <div class="bspec">${rows}</div>
        ${how}${why}
      </div>`;
  }

  const events = [
    {
      name: "Piggy Flash", sub: "Short-burst brick-looting race",
      goal: "Bank as many <strong>lines (bricks)</strong> as possible in a short window.",
      where: "Play where bricks looted is maxed: <strong>Arena → Competitive</strong> (max 43,500 bricks, with an additional multiplier), then <strong>Arena → Friendly</strong> (max 20,000 bricks, but you get the extra ×2 multiplier), then <strong>Loot</strong> (standard multipliers). Also play in <strong>Loot mode for brick piñatas</strong> — see Strategy.",
      builds: [
        { tier: "S", name: "Arena Competitive — max bricks",
          cannon: "<strong>Big Bertha</strong> (biggest mobs, most damage, fast champion spawn, least safety) <em>or</em> <strong>Double / Flamethrower</strong> (fast mob &amp; champion spawn, less mob damage, more safety) — what you pick here isn't super important.",
          champion: "A champion whose damage scales with multipliers — <strong>Sirion</strong> (scales mob damage), <strong>Nexus</strong>, <strong>Giga Chicken</strong>, or <strong>Mobzilla</strong> (fastest damage scaling, least safety).",
          mob: "Prefer <strong>slow mobs</strong> (Knight, Blob, Caveman, Soldier) to get your champions out in front doing damage, which reduces time to fire your ultimate.",
          ultimate: "<strong>Champion Overdrive</strong> — multiply your champions.",
          how: "Push for the full 43,500 brick cap. The slow mob keeps your champions charging and pushes them to the front; stack Overdrive on a group of champions to multiply your damage." },
        { tier: "S", name: "Arena Friendly / Loot — rush to 20K",
          cannon: "<strong>Double / Flamethrower / Triple</strong> — pick for safety and speed (skip Big Bertha here).",
          champion: "<strong>Sirion</strong>, <strong>Nexus</strong>, <strong>Giga Chicken</strong>, or <strong>Lootboxer</strong> — <em>not Mobzilla</em> (too slow to rush a quick 20K).",
          mob: "Still prefer <strong>slow mobs</strong> (Knight, Blob, Caveman, Soldier) to push your champions out front doing damage.",
          ultimate: "<strong>Champion Overdrive</strong> — multiply your champions.",
          how: "Arena → Friendly and Loot cap at 20,000 bricks, so the goal is to hit 20K fast and safely rather than grind the absolute max — a faster, safer cannon plus Lootboxer gets you there quickly." },
      ],
    },
    {
      name: "Piggy Race", sub: "Longer-window brick-looting race",
      goal: "Bank as many <strong>lines (bricks)</strong> as possible — the same as Piggy Flash, just with a longer run window.",
      where: "Same as Piggy Flash: <strong>Arena → Competitive</strong> (max 43,500 bricks + a multiplier), then <strong>Arena → Friendly</strong> (max 20,000 but the extra ×2 multiplier), then <strong>Loot</strong>. Play <strong>Loot mode for brick piñatas</strong> too.",
      note: "Piggy Race is essentially a longer Piggy Flash — same approach, just more time to rack up bricks.",
      builds: [
        { tier: "S", name: "Arena Competitive — max bricks",
          cannon: "<strong>Big Bertha</strong> (max damage, least safety) <em>or</em> <strong>Double / Flamethrower</strong> (more safety) — pick isn't critical.",
          champion: "Damage that scales with multipliers — <strong>Sirion</strong>, <strong>Nexus</strong>, <strong>Giga Chicken</strong>, or <strong>Mobzilla</strong> (fastest scaling, least safety).",
          mob: "Slow mobs (Knight, Blob, Caveman, Soldier) to push champions to the front doing damage.",
          ultimate: "<strong>Champion Overdrive</strong> — multiply your champions.",
          how: "Push for the full 43,500 brick cap — slow mobs to get champions out front, then spam Overdrive on a grouped set of champions to multiply damage and bricks." },
        { tier: "S", name: "Arena Friendly / Loot — rush to 20K",
          cannon: "<strong>Double / Flamethrower / Triple</strong> — pick for safety and speed (skip Big Bertha here).",
          champion: "<strong>Sirion</strong>, <strong>Nexus</strong>, <strong>Giga Chicken</strong>, or <strong>Lootboxer</strong> — <em>not Mobzilla</em> (too slow to rush a quick 20K).",
          mob: "Still prefer <strong>slow mobs</strong> (Knight, Blob, Caveman, Soldier) to push champions out front doing damage.",
          ultimate: "<strong>Champion Overdrive</strong> — multiply your champions.",
          how: "Friendly and Loot cap at 20,000 bricks — hit 20K fast and safely rather than grinding the max. A faster, safer cannon plus Lootboxer gets you there quickly." },
      ],
    },
    {
      name: "Space Race", sub: "Collect Space Race tickets",
      goal: "Maximize collection of <strong>Space Race tickets</strong> — they multiply with your multipliers!",
      where: "Play where multipliers are maxed. <strong>Save</strong> your Arena → Competitive (it also has an increased brick-cap limit) — use <strong>Arena → Friendly</strong> for the extra multipliers, or <strong>Loot</strong> mode (standard multipliers).",
      builds: [
        { tier: "S",
          cannon: "<strong>Double / Triple / Flamethrower</strong>.",
          champion: "<strong>Sirion</strong> — but don't use Sirion unless you have to.",
          mob: "A <strong>fast mob</strong> (Bat, Raccoon).",
          ultimate: "<strong>Champion Overdrive</strong> — but hold it until the very end.",
          how: "Unlike Piggy, the goal is to safely clear while collecting every ticket. Run Double + a fast mob; only bring Sirion if you must, and <strong>don't fire Overdrive until the end</strong>, after you've collected all the Space Race tickets." },
      ],
    },
    {
      name: "World Clash", sub: "Loot-mode battle rush",
      goal: "Win as many battles as you can, as fast as you can — aim for <strong>15 wins, or 30+</strong>.",
      where: "Played in <strong>Loot mode</strong>.",
      builds: [
        { tier: "S",
          cannon: "<strong>Double / Triple / Flamethrower</strong>.",
          champion: "<strong>Lootboxer / Nexus / Sirion</strong>.",
          mob: "A <strong>slow</strong> mob type.",
          ultimate: "<strong>Champion Overdrive</strong>.",
          how: "Max out blocks — but not at the cost of speed. You're racing to rack up wins, so keep every battle moving." },
      ],
    },
    {
      name: "Kraken", sub: "Knock out challenges → fight the Kraken",
      goal: "Knock out the challenges to earn <strong>tickets</strong>, then fight the Kraken and do <strong>as much damage to it as possible</strong>.",
      where: "<strong>Loot mode</strong>, or the event-specific goals to earn tickets.<br>Then fight the Kraken by clicking the Kraken (octopus) on the home screen or in the quick-links bar.",
      note: "It'll be hard to spawn your ultimate thanks to the Kraken's tentacle-slap — build around that.",
      builds: [
        { tier: "S",
          cannon: "<strong>Big Bertha</strong>.",
          champion: "<strong>Sirion</strong>.",
          ultimate: "<strong>Summon Gate</strong> (multiplier gate).",
          boosters: "A good time to spend <strong>tickets</strong> — grab <strong>charge rate</strong> (to get your ultimate off despite the tentacle-slap) plus <strong>fire-rate or an extra cannon</strong> so you can cover more lanes.",
          how: "Do as much damage as possible. Summon Gate multiplies your mobs, which then get a damage boost from Sirion.",
          why: "Why not Nexus? You'll be lucky to keep even a few champions on screen, so there's little benefit — and the accelerators in some lanes can send them off the edge into the water. Why not Overdrive? It doesn't help when your ultimates only last a short time." },
      ],
    },
    {
      name: "Pinata Levels", sub: "Bonus rounds — FAST DAMAGE",
      goal: "The name of the game is <strong>FAST DAMAGE</strong> — smash piñatas as fast as you possibly can.",
      builds: [
        { tier: "S",
          cannon: "<strong>Big Bertha</strong>.",
          champion: "<strong>Sirion</strong>.",
          mob: "A <strong>fast mob</strong> (Bat, Raccoon).",
          boosters: "Use your power-ups — especially <strong>Fast Charge</strong>, <strong>Fire-rate</strong>, and <strong>multiplier gates</strong>.",
          how: "You don't get to use an ultimate on this level, so lean entirely on power-ups and raw damage output. Fast Charge + Fire-rate + multiplier gates and just melt everything." },
      ],
    },
  ];

  /* ============================================================
     RENDERERS
     ============================================================ */
  function unitCard(u) {
    const uvPill = u.uv ? `<span class="pill unverified" title="Community-reported / not fully confirmed">community-reported</span>` : "";
    return `
      <div class="u-card">
        <div class="u-head">
          <div><div class="u-name">${u.name}</div><div class="u-role">${u.role}</div></div>
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
    el("cannons").innerHTML = sectionShell("🔫", "Cannons", "Your turret — one loadout slot",
      "There's no single 'best' cannon — it's situational (see the event builds). Always <strong>upgrade fire-rate first</strong>; it boosts every cannon. Then pick by goal: <strong>Double</strong> gives coverage and the fastest champion charge (great for farming), <strong>Flamethrower</strong> is your safety net, <strong>Big Bertha</strong> hits hardest with no safety net, and <strong>Triple</strong> has the highest raw output. Each card rates fire rate, mob power &amp; champion-charge speed.",
      `<div class="grid cols-auto">${cannons.map(function (c) { return meterCard(c, CANNON_SPEC); }).join("")}</div>`,
      true);
  }

  const MOB_SPEC = [["Strength", "strength"], ["Speed", "speed"], ["Health", "health"]];

  function renderMobs() {
    el("mobs").innerHTML = sectionShell("🏃", "Mobs", "The units you fire — one loadout slot",
      "Golden rule: <strong>faster = weaker, slower = tankier.</strong> Fast mobs reach the base first (races); slow, high-strength mobs win fights AND — because fewer are on screen — charge your champion faster, which is exactly why farming builds pair a slow mob with a fast cannon. Each card rates <strong>strength</strong>, <strong>speed</strong> and <strong>health</strong>. Enemy card level is matched within ~±7 of yours.",
      `<div class="grid cols-auto">${mobs.map(function (m) { return meterCard(m, MOB_SPEC); }).join("")}</div>`,
      true);
  }

  function renderChampions() {
    el("champions").innerHTML = sectionShell("🦸", "Champions", "Big hero units — one loadout slot",
      "Deploy a champion for boss waves &amp; dense fights, and keep it <strong>~7–10 levels above your mob card</strong>. <strong>Nexus</strong> is the forgiving farming default, <strong>Lootboxer</strong> generates Stars, <strong>Mobzilla</strong> farms bricks, <strong>Sirion</strong> buffs your mobs (huge with Champion Overdrive), and <strong>Captain Kaboom</strong> rules clash events.",
      `<div class="grid cols-auto">${champions.map(unitCard).join("")}</div>`,
      true);
  }

  function renderUltimates() {
    el("ultimates").innerHTML = sectionShell("⚡", "Ultimates", "Chargeable supers — one loadout slot",
      "Your ultimate is the heart of the <strong>loot window</strong> — <strong>don't fire early.</strong> <strong>Champion Overdrive</strong> multiplies champions for brick farming, <strong>Pinata Party</strong> banks bricks/Stars before the loot window, <strong>Rocket Barrage</strong> rules bosses &amp; early game, and <strong>Summon Gate</strong> is the Space Race trick.",
      `<div class="grid cols-auto">${ultimates.map(unitCard).join("")}</div>`,
      true);
  }

  function renderTowers() {
    el("towers").innerHTML = sectionShell("🏰", "Towers", "Base-defense structures",
      "Towers defend your base during <strong>Base Invasions</strong> &amp; revenge raids — a strong base means raiders lose and your coins, bricks &amp; stars stay safe. Mix a durable wall with damage towers that counter what attackers bring. <em>Exact tower stats aren't published; the roles below are described from each tower's name — confirm in-game.</em>",
      `<div class="grid cols-auto">${towers.map(unitCard).join("")}</div>`,
      false);
  }

  function eventBlock(ev, i) {
    const where = ev.where ? `<div class="ekv"><span class="ekv-lab">Where</span><span>${ev.where}</span></div>` : "";
    const note = ev.note ? `<div class="callout note"><span class="c-ico">📍</span><span>${ev.note}</span></div>` : "";
    return `
      <details class="collapsible"${i === 0 ? " open" : ""}>
        <summary>
          <span class="sum-text"><span class="sum-title">${ev.name}</span><span class="sum-sub">${ev.sub}</span></span>
          <span class="sum-chev">▾</span>
        </summary>
        <div class="collapsible-body">
          <div class="ekv"><span class="ekv-lab">Goal</span><span>${ev.goal}</span></div>
          ${where}
          ${note}
          ${ev.builds.map(buildBlock).join("")}
        </div>
      </details>`;
  }

  function renderEvents() {
    el("events").innerHTML = `
      <div class="section-head">
        <span class="section-eyebrow">📅 Event Playbook</span>
        <h2 class="section-title">Event playbook</h2>
        <p class="section-intro full">Every recurring event: the <strong>goal</strong>, <strong>where to play</strong> it, and the <strong>S-tier build</strong> (cannon · mob · champion · ultimate) with how to play it. Tap an event to expand. Builds are starting points — adapt to your card levels and the map.</p>
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
        <p class="section-intro full">Three levers move your account: <strong>how you loot</strong>, <strong>how you spend upgrades</strong>, and <strong>how you climb the ladder</strong>. Get these right and you'll out-pace players who've been grinding twice as long.</p>
      </div>

      <details class="collapsible" open>
        <summary><span class="sum-ico">💰</span><span class="sum-text"><span class="sum-title">1 · Looting — farm bricks &amp; rewards</span><span class="sum-sub">Chests, ads, and the loot window</span></span><span class="sum-chev">▾</span></summary>
        <div class="collapsible-body">
          <p class="section-intro" style="font-size:.98rem">Looting comes down to one of two goals — <strong>max blocks (bricks) fast</strong> or <strong>farm stars</strong>. Both use the same trick: a <strong>fast cannon + a slow mob</strong> so your champion charges quickly, then an ultimate that multiplies your champions.</p>
          <div class="sub-title">Goal: Maximize blocks fast</div>
          ${buildBlock({ tier: "S", name: "Sirion + Overdrive", cannon: "Double (coverage &amp; fast charge) · Flamethrower (safety net) · Big Bertha (if you're OK with no safety net)", mob: "Knight / Soldier / Caveman / Blob (slow)", champion: "Sirion — buffs your mobs", ultimate: "Champion Overdrive",
            how: "The slow mob keeps your champion charging fast; spam as many Sirions as you can with Overdrive to buff and flood the base. Double gives more coverage than Single and a faster champion charge than Triple." })}
          <div class="sub-title">Goal: Farm stars</div>
          ${buildBlock({ tier: "S", name: "Lootboxer + Overdrive", cannon: "Double / Flamethrower (fast)", mob: "Knight / Caveman (slow)", champion: "Lootboxer — generates stars", ultimate: "Champion Overdrive (or Pinata Party if leveled)",
            how: "Same idea: the slow mob lets your Lootboxers get out in front, then Overdrive multiplies them. Once it's leveled, swap Overdrive for Pinata Party to bank stars before the loot window." })}
          <div class="sub-title">Always</div>
          <ul class="checklist">
            <li><strong>Upgrade fire-rate first</strong> — it compounds your income.</li>
            <li><strong>Multiply your loot</strong> at the end of every run (unless the roll is terrible) and watch the reward-multiplier ad.</li>
            <li><strong>Speed up gift/event chests with ads</strong> (or Skip'Its) and claim the free daily coin/card offers.</li>
            <li><strong>During races, don't craft shields</strong> — staying attackable farms high-value revenge attacks.</li>
          </ul>
        </div>
      </details>

      <details class="collapsible">
        <summary><span class="sum-ico">🃏</span><span class="sum-text"><span class="sum-title">2 · Leveling cards — go narrow, not wide</span><span class="sum-sub">The single biggest F2P mistake to avoid</span></span><span class="sum-chev">▾</span></summary>
        <div class="collapsible-body">
          <p class="section-intro" style="font-size:.98rem">Collect cards to level them, and use your coins to level them up once you have enough cards. Costs scale up fast, so spreading resources across many cards stalls your power everywhere. <strong>Commit to one or two of each slot and pour everything in.</strong></p>
          <div class="sub-title">Upgrade order</div>
          <ol class="steps">
            <li><strong>Cannon fire-rate first</strong> — it applies to every cannon, so it's never wasted. Highest-value early spend.</li>
            <li><strong>One main mob</strong> — Normie is cheap &amp; balanced to ~75; then a tank (Knight/Bear) or Paper Bag.</li>
            <li><strong>One main champion</strong> — Nexus early (forgiving); then chase <strong>Lootboxer, Sirion or Mobzilla</strong>, depending on what you enjoy playing the most. Keep it 7–10 levels above your mob.</li>
            <li><strong>Anchor on two main ultimates</strong> as soon as you can. You start with Rocket Barrage, but switch to <strong>Mass Abduction or MobCopter</strong> as soon as you can — unless you really like the way Rocket Barrage plays. Then shift focus to <strong>Champion Overdrive</strong> (the most valuable ultimate) and <strong>Summon Gate</strong>.</li>
          </ol>
          <div class="grid cols-2">
            <div class="u-card"><div class="u-name" style="margin-bottom:6px">✔ Upgrade first</div>
              <ul class="checklist" style="margin-top:4px">
                <li>Cannon fire-rate</li><li>Flamethrower (once unlocked) or Shotgun/Double early</li>
                <li>One main mob (Normie → a tank)</li><li>Nexus → Lootboxer / Mobzilla</li>
              </ul></div>
            <div class="u-card"><div class="u-name" style="margin-bottom:6px">✕ Don't sink coins into (yet)</div>
              <ul class="checklist crosslist" style="margin-top:4px">
                <li>Great Normie / Explodon / Big Blob as upgrade targets</li><li>Single-shot cannons</li>
                <li>Tiny-duration new ultimates</li><li>Spreading across many cards "to try them"</li>
              </ul></div>
          </div>
        </div>
      </details>

      <details class="collapsible">
        <summary><span class="sum-ico">👑</span><span class="sum-text"><span class="sum-title">3 · Tiers — reach God tier as fast as possible</span><span class="sum-sub">Champions League ladder</span></span><span class="sum-chev">▾</span></summary>
        <div class="collapsible-body">
          <p class="section-intro" style="font-size:.98rem">The competitive ladder is the <strong>Champions League</strong>, driven by <strong>Championship Stars</strong> (win battles, defend your base, place in tournaments). Climb the leagues; reaching the final league unlocks the exclusive <strong>God Tier</strong> tournament.</p>
          <div class="ladder">
            ${tierLadder.map(r => `<div class="rung${r.peak ? " peak" : ""}"><span class="rung-ico">${r.ico}</span><span class="rung-name">${r.name}</span><span class="rung-desc">${r.desc}</span></div>`).join("")}
          </div>
          <div class="callout tip"><span class="c-ico">💡</span><span><strong>Spam Champion Overdrive.</strong> Once you have more than one champion (Sirion / Lootboxer) on the map, spam Overdrive — and try to deploy your champions in <em>similar locations</em> so Overdrive multiplies a whole group instead of just one.</span></div>
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
        <p class="section-intro full">We are a casual, friendly, active, and fun clan here to help one another get better and have more fun. We encourage players to participate in as many events as they can, since event pools are generally shared amongst all players. Meaning, even if you're not going from 2nd place to 1st place, if you keep playing, you're still growing the pot!</p>
        ${clanIdBlock()}
      </div>

      <div class="join-card">
        <div class="join-steps">
          <div class="sub-title" style="justify-content:center;text-align:center;display:block">How to join</div>
          <ol class="steps">
            <li>Open <strong>Mob Control</strong> → tap the <strong>Clan</strong> menu.</li>
            <li>Hit <strong>Search</strong> and look up <strong>“anonymobs”</strong>, then request to join.</li>
            <li><strong>Join before an event starts</strong> and stay through reward-claim — you only keep a race's Sparks if you're in the same clan from start to claim. Don't clan-hop mid-event or your Sparks are voided. When you leave a clan, your Sparks disappear.</li>
            <li>Show up for Piggy Race &amp; Space Race, coordinate on Kraken, and climb with us.</li>
          </ol>
        </div>

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
        <div class="contribute-btns">
          <a class="btn btn-primary" href="https://github.com/jchristn/anonymobs.org/issues/new" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="flex-shrink:0"><path fill="currentColor" d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.75.81 1.2 1.84 1.2 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z"/></svg>
            Open an issue on GitHub
          </a>
          <a class="btn btn-ghost" href="https://github.com/jchristn/anonymobs.org" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="flex-shrink:0"><path fill="currentColor" d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.77 6.2 20.36l1.11-6.46-4.7-4.58 6.49-.94z"/></svg>
            Give us a star on GitHub
          </a>
        </div>
      </div>
    `;
  }

  /* ============================================================
     INTERACTIONS: theme, menu, scroll-spy, progress
     ============================================================ */
  function initClipboard() {
    const buttons = document.querySelectorAll(".clan-id-copy");
    buttons.forEach(function (btn) {
      const code = btn.parentNode.querySelector(".clan-id-code");
      if (!code) return;
      let resetTimer = null;
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
      const fallback = function () {
        try {
          const r = document.createRange(); r.selectNodeContents(code);
          const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
          const ok = document.execCommand("copy"); sel.removeAllRanges(); done(ok);
        } catch (e) { done(false); }
      };
      btn.addEventListener("click", function () {
        const text = code.textContent.trim();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
        } else { fallback(); }
      });
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
    // Reference sections (cannons/mobs/champions/ultimates/towers) are hidden for now.
    // Re-add their <section> containers + nav links and re-enable these to restore:
    // renderCannons(); renderMobs(); renderChampions(); renderUltimates(); renderTowers();
    renderEvents();
    renderStrategy();
    renderJoin();
    renderContribute();

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
