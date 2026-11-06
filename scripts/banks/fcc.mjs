import { make, otherValues } from "../engine.mjs";

const uv = (n) => `${n} µV/m`;
const db = (n) => `${n} dBµV`;

export function fccBank() {
  const b = make("fcc");
  const { add, tf } = b;

  const classB = [
    ["30–88 MHz", 100],
    ["88–216 MHz", 150],
    ["216–960 MHz", 200],
    ["above 960 MHz", 500],
  ];
  const classA = [
    ["30–88 MHz", 90],
    ["88–216 MHz", 150],
    ["216–960 MHz", 210],
    ["above 960 MHz", 300],
  ];
  const bPool = classB.map(([, n]) => uv(n));
  const aPool = [...new Set(classA.map(([, n]) => uv(n)))];

  for (const [band, n] of classB) {
    add({
      difficulty: "medium",
      stem: `What is the §15.109(a) Class B radiated limit at 3 m for ${band}?`,
      choices: [uv(n), ...otherValues(uv(n), [...bPool, uv(90), uv(210), uv(300)])],
      answer: uv(n),
      explanation: `Section 15.109(a) sets ${n} µV/m at 3 m in this band. At a shared band edge the tighter of the two limits applies.`,
      citation: "47 CFR §15.109(a), (c)",
      area: "radiated-limits",
    });
  }
  for (const [band, n] of classA) {
    add({
      difficulty: "medium",
      stem: `What is the §15.109(b) Class A radiated limit at 10 m for ${band}?`,
      choices: [uv(n), ...otherValues(uv(n), [...aPool, uv(100), uv(200), uv(500)])],
      answer: uv(n),
      explanation: `Section 15.109(b) sets the Class A limit at 10 m, not 3 m, to ${n} µV/m in this band. The tighter limit applies at the band edges.`,
      citation: "47 CFR §15.109(b), (c)",
      area: "radiated-limits",
    });
  }

  const edges = [
    ["88 MHz", "Class B", "3 m", uv(100), "100 µV/m is tighter than 150 µV/m"],
    ["216 MHz", "Class B", "3 m", uv(150), "150 µV/m is tighter than 200 µV/m"],
    ["960 MHz", "Class B", "3 m", uv(200), "200 µV/m is tighter than 500 µV/m"],
    ["88 MHz", "Class A", "10 m", uv(90), "90 µV/m is tighter than 150 µV/m"],
  ];
  for (const [freq, klass, dist, ans, why] of edges) {
    add({
      difficulty: "hard",
      stem: `At exactly ${freq}, which ${klass} radiated limit applies (${dist})?`,
      choices: [ans, ...otherValues(ans, [uv(90), uv(100), uv(150), uv(200), uv(210), uv(300), uv(500)])],
      answer: ans,
      explanation: `Section 15.109(c) says the tighter limit applies at the band edges. ${why}.`,
      citation: "47 CFR §15.109(c)",
      area: "radiated-limits",
    });
  }

  const dbCases = [
    [100, "40.0 dBµV/m"],
    [150, "43.5 dBµV/m"],
    [200, "46.0 dBµV/m"],
    [500, "54.0 dBµV/m"],
    [90, "39.1 dBµV/m"],
    [300, "49.5 dBµV/m"],
  ];
  const dbPool = dbCases.map(([, d]) => d);
  for (const [n, d] of dbCases) {
    add({
      difficulty: "hard",
      stem: `Which value is closest to 20·log10(${n} µV/m)?`,
      choices: [d, ...otherValues(d, dbPool)],
      answer: d,
      explanation: `Field strength in dBµV/m is 20·log10 of the value in µV/m. ${n} µV/m converts to about ${d}.`,
      citation: "47 CFR §15.109 (µV/m limits); conversion is 20·log10",
      area: "radiated-limits",
    });
  }

  add({
    difficulty: "hard",
    stem: "Using the 20 dB/decade factor, the Class B limit of 500 µV/m at 3 m above 1 GHz is what at 10 m?",
    choices: [uv(150), uv(50), uv(500), uv(167)],
    answer: uv(150),
    explanation: "Inverse-distance extrapolation multiplies by 3/10, so 500 µV/m at 3 m is 150 µV/m at 10 m. Section 15.109(g)(2) states that example.",
    citation: "47 CFR §15.109(g)(2); §15.31(f)(1)",
    area: "measurement",
  });
  add({
    difficulty: "hard",
    stem: "A 200 µV/m reading is taken at 3 m and must be reported at a 30 m limit distance above 30 MHz. Which extrapolated value follows §15.31(f)(1)?",
    choices: [uv(20), uv(2), uv(63), uv(200)],
    answer: uv(20),
    explanation: "At and above 30 MHz the factor is 20 dB/decade, so field strength scales as 1/distance. 200 µV/m × (3/30) is 20 µV/m.",
    citation: "47 CFR §15.31(f)(1)",
    area: "measurement",
  });
  add({
    difficulty: "hard",
    stem: "Below 30 MHz, a 200 µV/m reading at 3 m is extrapolated to 30 m with the default §15.31(f)(2) factor. What is reported?",
    choices: [uv(2), uv(20), uv(63), uv(200)],
    answer: uv(2),
    explanation: "Below 30 MHz the default factor is 40 dB/decade, the square of inverse distance. 200 × (3/30)² equals 2 µV/m.",
    citation: "47 CFR §15.31(f)(2)",
    area: "measurement",
  });

  const bCond = [
    ["0.15–0.5 MHz", "66 to 56 dBµV quasi-peak and 56 to 46 dBµV average", "easy"],
    ["0.5–5 MHz", "56 dBµV quasi-peak and 46 dBµV average", "medium"],
    ["5–30 MHz", "60 dBµV quasi-peak and 50 dBµV average", "medium"],
  ];
  for (const [band, ans, difficulty] of bCond) {
    add({
      difficulty,
      stem: `§15.107(a) Class B conducted limits on the AC mains, ${band}?`,
      choices: [
        ans,
        "79 dBµV quasi-peak and 66 dBµV average",
        "73 dBµV quasi-peak and 60 dBµV average",
        "1000 µV, quasi-peak only",
      ],
      answer: ans,
      explanation: `Those are the Class B mains limits in §15.107(a) for ${band}. The lower limit applies at the band edges, and the sloping band falls with the log of frequency.`,
      citation: "47 CFR §15.107(a)",
      area: "conducted-limits",
    });
  }
  add({
    difficulty: "medium",
    stem: "§15.107(b) Class A conducted limits from 0.5 MHz to 30 MHz are:",
    choices: [
      "73 dBµV quasi-peak and 60 dBµV average",
      "56 dBµV quasi-peak and 46 dBµV average",
      "60 dBµV quasi-peak and 50 dBµV average",
      "79 dBµV quasi-peak and 66 dBµV average",
    ],
    answer: "73 dBµV quasi-peak and 60 dBµV average",
    explanation: "Class A from 0.5 MHz to 30 MHz is 73 dBµV quasi-peak and 60 dBµV average. From 0.15 MHz to 0.5 MHz the Class A limits are 79 and 66 dBµV.",
    citation: "47 CFR §15.107(b)",
    area: "conducted-limits",
  });
  add({
    difficulty: "medium",
    stem: "§15.107(b) Class A conducted limits from 0.15 MHz to 0.5 MHz are:",
    choices: [
      "79 dBµV quasi-peak and 66 dBµV average",
      "73 dBµV quasi-peak and 60 dBµV average",
      "66 to 56 dBµV quasi-peak and 56 to 46 dBµV average",
      "60 dBµV quasi-peak and 50 dBµV average",
    ],
    answer: "79 dBµV quasi-peak and 66 dBµV average",
    explanation: "The Class A table holds 79 dBµV quasi-peak and 66 dBµV average from 0.15 MHz to 0.5 MHz. The lower limit applies at the boundary with the next range.",
    citation: "47 CFR §15.107(b)",
    area: "conducted-limits",
  });
  add({
    difficulty: "easy",
    stem: "Mains conducted measurements for Part 15 use which line-impedance stabilization network?",
    choices: [
      "50 µH / 50 Ω",
      "5 µH / 50 Ω",
      "50 µH / 50 Ω only above 30 MHz",
      "A current probe and no LISN",
    ],
    answer: "50 µH / 50 Ω",
    explanation: "Sections 15.107 and 15.31(l) both call for a 50 µH/50 ohm LISN. The voltage is measured between each power line and ground.",
    citation: "47 CFR §15.107; §15.31(l)",
    area: "conducted-limits",
  });
  add({
    difficulty: "medium",
    stem: "At the 0.5 MHz edge of the Class B conducted table, which quasi-peak limit applies?",
    choices: ["56 dBµV", "66 dBµV", "60 dBµV", "73 dBµV"],
    answer: "56 dBµV",
    explanation: "The lower limit applies at the band edges. The 0.15–0.5 MHz range ends at 56 dBµV quasi-peak, which is tighter than 60 dBµV in the next row.",
    citation: "47 CFR §15.107(a)",
    area: "conducted-limits",
  });
  add({
    difficulty: "medium",
    stem: "As frequency rises from 150 kHz to 500 kHz, the Class B quasi-peak conducted limit:",
    choices: [
      "Falls from 66 dBµV to 56 dBµV with the log of frequency",
      "Rises from 56 dBµV to 66 dBµV",
      "Stays at 56 dBµV",
      "Applies only as an average limit",
    ],
    answer: "Falls from 66 dBµV to 56 dBµV with the log of frequency",
    explanation: "The star note on §15.107(a) says the limit decreases with the logarithm of the frequency. Both the quasi-peak and the average limits slope in that first band.",
    citation: "47 CFR §15.107(a)",
    area: "conducted-limits",
  });

  const fails = [
    ["120 µV/m at 3 m at 50 MHz, Class B", "Fail", "The 30–88 MHz Class B limit is 100 µV/m."],
    ["80 µV/m at 3 m at 50 MHz, Class B", "Pass", "80 µV/m is under the 100 µV/m Class B limit."],
    ["160 µV/m at 3 m at 100 MHz, Class B", "Fail", "The 88–216 MHz Class B limit is 150 µV/m."],
    ["140 µV/m at 3 m at 100 MHz, Class B", "Pass", "140 µV/m is under the 150 µV/m Class B limit."],
    ["250 µV/m at 3 m at 400 MHz, Class B", "Fail", "The 216–960 MHz Class B limit is 200 µV/m."],
    ["600 µV/m average at 3 m at 1.5 GHz, Class B", "Fail", "Above 960 MHz the Class B limit is 500 µV/m, and above 1 GHz that limit is an average limit."],
    ["100 µV/m at 10 m at 50 MHz, Class A", "Fail", "The 30–88 MHz Class A limit at 10 m is 90 µV/m."],
    ["70 µV/m at 10 m at 50 MHz, Class A", "Pass", "70 µV/m is under the 90 µV/m Class A limit at 10 m."],
  ];
  for (const [caseText, ans, why] of fails) {
    add({
      difficulty: "hard",
      stem: `A maximized reading is ${caseText}. Against §15.109, the result is:`,
      choices: ["Pass", "Fail", "Exempt under §15.103", "Report only if it is 20 dB over the limit"],
      answer: ans,
      explanation: `${why} Compare the reading to the limit at the distance the rule actually specifies.`,
      citation: "47 CFR §15.109(a), (b)",
      area: "radiated-limits",
    });
  }

  const upper = [
    ["800 kHz", "30 MHz"],
    ["50 MHz", "1000 MHz"],
    ["200 MHz", "2000 MHz"],
    ["800 MHz", "5000 MHz"],
    ["2.4 GHz", "12 GHz"],
    ["10 GHz", "40 GHz"],
  ];
  const upperPool = upper.map(([, u]) => u);
  for (const [f, u] of upper) {
    add({
      difficulty: f === "2.4 GHz" || f === "10 GHz" ? "hard" : "medium",
      stem: `§15.33(b)(1): an unintentional radiator whose highest frequency generated or used is ${f} is investigated up to:`,
      choices: [u, ...otherValues(u, [...upperPool, "100 GHz", "200 GHz"])],
      answer: u,
      explanation: `The §15.33(b)(1) table sets the upper frequency from the highest frequency generated or used. For ${f} that upper frequency is ${u}.`,
      citation: "47 CFR §15.33(b)(1)",
      area: "measurement",
    });
  }
  add({
    difficulty: "hard",
    stem: "An intentional radiator operates at 8 GHz and contains no higher frequency. §15.33(a) investigates at least to:",
    choices: ["40 GHz", "80 GHz", "8 GHz", "100 GHz"],
    answer: "40 GHz",
    explanation: "Below 10 GHz the investigation runs to the tenth harmonic or 40 GHz, whichever is lower. The tenth harmonic of 8 GHz is 80 GHz, so the cap is 40 GHz.",
    citation: "47 CFR §15.33(a)(1)",
    area: "measurement",
  });
  add({
    difficulty: "hard",
    stem: "An intentional radiator operates at 12 GHz. §15.33(a) investigates at least to:",
    choices: ["60 GHz", "40 GHz", "100 GHz", "120 GHz"],
    answer: "60 GHz",
    explanation: "From 10 GHz up to but not including 30 GHz, the range is the fifth harmonic or 100 GHz, whichever is lower. The fifth harmonic of 12 GHz is 60 GHz.",
    citation: "47 CFR §15.33(a)(2)",
    area: "measurement",
  });
  add({
    difficulty: "hard",
    stem: "An intentional radiator operates at 100 GHz. §15.33(a) investigates at least to:",
    choices: ["300 GHz", "200 GHz", "500 GHz", "750 GHz"],
    answer: "300 GHz",
    explanation: "At and above 95 GHz the range is the third harmonic or 750 GHz, whichever is lower. The third harmonic of 100 GHz is 300 GHz.",
    citation: "47 CFR §15.33(a)(4)",
    area: "measurement",
  });

  const defs = [
    ["A digital device under §15.3(k) generates and uses timing signals or pulses at a rate:", "In excess of 9,000 pulses per second, and uses digital techniques", "At or above 1.705 MHz only", "Only if it is intentionally radiating", "Above 30 MHz only"],
    ["Class A digital device, §15.3(h), means a device marketed for:", "A commercial, industrial, or business environment, not for the general public or the home", "Any residential use", "Vehicles only", "Test equipment only"],
    ["Class B digital device, §15.3(i), means a device marketed for:", "A residential environment, even if it is also used at work", "Industrial plants only", "Licensed broadcast transmitters", "Incidental radiators such as light switches"],
    ["An intentional radiator, §15.3(o), is a device that:", "Intentionally generates and emits RF energy by radiation or induction", "Only conducts RF along a cable", "Generates RF without being designed to, such as a DC motor", "Is exempt from §15.5"],
    ["An unintentional radiator, §15.3(z), is a device that:", "Generates RF for use inside the device, or sends RF by conduction, but is not intended to emit by radiation or induction", "Is licensed under Part 90", "Only includes incidental radiators", "Must be certified as Access BPL"],
    ["An incidental radiator, §15.3(n), is exemplified by:", "DC motors and mechanical light switches", "Wi-Fi access points", "FM broadcast receivers", "Scanning receivers"],
    ["Harmful interference, §15.3(m), includes emission that:", "Endangers radionavigation or a safety service, or seriously degrades, obstructs, or repeatedly interrupts a radiocommunications service", "Is merely detectable on a chamber pre-scan", "Stays 6 dB under a Part 15 limit", "Is confined to the ISM bands"],
    ["Radio frequency energy in §15.3(u) covers:", "9 kHz to 3,000,000 MHz", "30 MHz to 1 GHz only", "150 kHz to 30 MHz only", "Below 9 kHz"],
    ["A personal computer under §15.3(s) is:", "Marketed for the home and treated as a Class B digital device", "Always Class A", "Exempt from equipment authorization", "An incidental radiator"],
    ["Access BPL, §15.3(ff), sends energy:", "Between 1.705 MHz and 80 MHz on medium- or low-voltage lines on the supply side of the customer interconnection", "Only inside a house on customer wiring", "From 9 kHz to 490 kHz for utility relaying", "Above 6 GHz"],
  ];
  for (const [stem, answer, ...wrongs] of defs) {
    add({
      difficulty: "easy",
      stem,
      choices: [answer, ...wrongs],
      answer,
      explanation: `That wording is the Part 15 definition, not a lab nickname. Use it when you decide which limits and authorization apply.`,
      citation: "47 CFR §15.3",
      area: "definitions",
    });
  }

  tf("easy", "Part 15 operation gives the user a vested right to keep using a frequency after certification.", false, "Section 15.5(a) says operators are not deemed to have any vested right to continued use of a frequency by prior certification or registration.", "47 CFR §15.5(a)", "definitions");
  tf("easy", "A Part 15 device must accept interference from authorized stations, other Part 15 devices, ISM equipment, and incidental radiators.", true, "Section 15.5(b) requires that no harmful interference be caused and that interference be accepted from those sources.", "47 CFR §15.5(b)", "definitions");
  tf("medium", "If a Commission representative finds a Part 15 device causing harmful interference, the operator must stop until the problem is corrected.", true, "Section 15.5(c) requires operation to cease on that notice and not to resume until the condition is corrected.", "47 CFR §15.5(c)", "definitions");
  tf("medium", "Intentional radiators that produce damped-wave (Class B emission) signals are allowed if the field strength is low.", false, "Section 15.5(d) prohibits intentional radiators that produce Class B emissions, meaning damped waves.", "47 CFR §15.5(d)", "definitions");
  tf("easy", "Manufacturers of incidental radiators shall use good engineering practice to minimize the risk of harmful interference.", true, "Section 15.13 is the whole rule for incidental radiators: good engineering practice, not the §15.109 table.", "47 CFR §15.13", "definitions");

  add({
    difficulty: "medium",
    stem: "On or below 1000 MHz, Part 15 emission limits are based on which detector unless a rule says otherwise?",
    choices: [
      "CISPR quasi-peak, with peak allowed as a same-bandwidth alternative",
      "Average only",
      "RMS only",
      "Peak with a 1 MHz bandwidth only",
    ],
    answer: "CISPR quasi-peak, with peak allowed as a same-bandwidth alternative",
    explanation: "Section 15.35(a) bases those limits on a CISPR quasi-peak detector. A peak detector may be used if it uses the same bandwidth, which is the conservative direction.",
    citation: "47 CFR §15.35(a)",
    area: "measurement",
  });
  add({
    difficulty: "medium",
    stem: "Above 1000 MHz, Part 15 radiated limits are based on which detector, and what is the peak cap?",
    choices: [
      "Average, with RBW at least 1 MHz, and a peak limit 20 dB above the average limit",
      "Quasi-peak only, with a 120 kHz bandwidth",
      "Average, with no separate peak limit",
      "Peak only, with RBW of 100 Hz",
    ],
    answer: "Average, with RBW at least 1 MHz, and a peak limit 20 dB above the average limit",
    explanation: "Section 15.35(b) uses an average detector above 1000 MHz and a minimum 1 MHz resolution bandwidth. Unless a specific rule says otherwise, the peak limit is 20 dB above the average limit.",
    citation: "47 CFR §15.35(b)",
    area: "measurement",
  });
  add({
    difficulty: "hard",
    stem: "At 980 MHz, the Class B 500 µV/m limit in §15.109(a) is applied with which detector?",
    choices: [
      "Quasi-peak, because the frequency is at or below 1000 MHz",
      "Average, because the row says above 960 MHz",
      "Peak only",
      "No detector is specified below 1 GHz",
    ],
    answer: "Quasi-peak, because the frequency is at or below 1000 MHz",
    explanation: "Section 15.35(a) applies the quasi-peak basis on frequencies at or below 1000 MHz. The 'above 960 MHz' row still uses that detector until the frequency passes 1000 MHz.",
    citation: "47 CFR §15.35(a); §15.109(a)",
    area: "measurement",
  });
  add({
    difficulty: "hard",
    stem: "At 1.2 GHz, the Class B §15.109(a) limit of 500 µV/m at 3 m is:",
    choices: [
      "An average limit, with the peak limit generally 20 dB higher",
      "A quasi-peak limit only",
      "A peak limit of 500 µV/m",
      "Not applicable above 1 GHz",
    ],
    answer: "An average limit, with the peak limit generally 20 dB higher",
    explanation: "Above 1000 MHz, §15.35(b) reads the radiated limits as average limits and adds a peak cap 20 dB higher unless a narrower rule changes that. The 500 µV/m number is still the one in §15.109(a).",
    citation: "47 CFR §15.35(b); §15.109(a)",
    area: "measurement",
  });
  add({
    difficulty: "hard",
    stem: "For pulsed operation, when may the average be taken over one complete pulse train including blanking?",
    choices: [
      "When the pulse train does not exceed 0.1 second",
      "Only when the train exceeds 1 second",
      "Never; always use 1 second",
      "Only below 30 MHz",
    ],
    answer: "When the pulse train does not exceed 0.1 second",
    explanation: "Section 15.35(c) allows averaging over one complete pulse train, blanking included, if the train does not exceed 0.1 second. Longer trains use a 0.1 second interval at the maximum.",
    citation: "47 CFR §15.35(c)",
    area: "measurement",
  });

  add({
    difficulty: "easy",
    stem: "Unintentional radiators are measured for compliance with which procedure, aside from listed excluded clauses?",
    choices: [
      "ANSI C63.4-2014",
      "ANSI C63.10-2020",
      "ANSI C63.17-2013",
      "CISPR 12 only",
    ],
    answer: "ANSI C63.4-2014",
    explanation: "Section 15.31(a)(4) points unintentional radiators to ANSI C63.4-2014, excluding clauses 4.5.3, 4.6, 6.2.13, 8.2.2, 9, and 13. Other intentional radiators use ANSI C63.10-2020.",
    citation: "47 CFR §15.31(a)(3), (a)(4)",
    area: "measurement",
  });
  add({
    difficulty: "medium",
    stem: "The measurement distance in §15.31(f) is the horizontal distance to:",
    choices: [
      "The closest point of the EUT, support equipment, or interconnecting cables inside the system boundary",
      "The center of the EUT only, ignoring cables",
      "The antenna mast base",
      "Always 10 m, regardless of the limit",
    ],
    answer: "The closest point of the EUT, support equipment, or interconnecting cables inside the system boundary",
    explanation: "The distance is horizontal, to the closest point on the imaginary boundary around the system. Cables and support equipment inside that boundary count.",
    citation: "47 CFR §15.31(f)",
    area: "measurement",
  });
  add({
    difficulty: "medium",
    stem: "Above 30 MHz, if you measure at a distance other than the one in the limit, §15.31(f)(1) extrapolates with:",
    choices: [
      "20 dB/decade, and not beyond 30 m unless a shorter distance is impractical",
      "40 dB/decade in every case",
      "10 dB/decade",
      "No extrapolation; the reading stands",
    ],
    answer: "20 dB/decade, and not beyond 30 m unless a shorter distance is impractical",
    explanation: "Field strength uses 20 dB/decade above 30 MHz. Measurements are not made in the near field unless that is shown to be appropriate, and not beyond 30 m unless a closer measurement is impractical.",
    citation: "47 CFR §15.31(f)(1)",
    area: "measurement",
  });
  add({
    difficulty: "medium",
    stem: "If the lead length a user will attach is unknown, §15.31(g) says to test with leads of:",
    choices: ["1 m", "40 cm", "3 m", "30 cm"],
    answer: "1 m",
    explanation: "Unknown wire leads are one meter. Use the real length when it is known, and longer leads only when needed to reach a peripheral.",
    citation: "47 CFR §15.31(g)",
    area: "measurement",
  });
  add({
    difficulty: "hard",
    stem: "For intentional radiators, the fundamental is checked while AC supply voltage is varied over:",
    choices: [
      "85% to 115% of nominal rated voltage",
      "90% to 110% of nominal",
      "A fixed nominal only",
      "50% to 150% of nominal",
    ],
    answer: "85% to 115% of nominal rated voltage",
    explanation: "Section 15.31(e) varies supply from 85% to 115% for the fundamental of an intentional radiator. Battery equipment is tested with a new battery.",
    citation: "47 CFR §15.31(e)",
    area: "measurement",
  });
  add({
    difficulty: "medium",
    stem: "A device that operates over more than 10 MHz in a band is measured at how many frequencies in that band?",
    choices: [
      "Three: near the top, middle, and bottom",
      "One, at the middle",
      "Two: near the top and bottom",
      "Every channel",
    ],
    answer: "Three: near the top, middle, and bottom",
    explanation: "Section 15.31(m) uses one frequency if the range is 1 MHz or less, two if it is 1 to 10 MHz, and three if it is more than 10 MHz.",
    citation: "47 CFR §15.31(m)",
    area: "measurement",
  });
  add({
    difficulty: "easy",
    stem: "Emissions attenuated more than 20 dB below the limit:",
    choices: [
      "Need not be reported unless another rule specifically requires them",
      "Must always be listed at every frequency",
      "Are an automatic failure",
      "Are reported only above 1 GHz",
    ],
    answer: "Need not be reported unless another rule specifically requires them",
    explanation: "Section 15.31(o) drops spurious and unintentional emissions that are more than 20 dB under the limit, unless another provision asks for them.",
    citation: "47 CFR §15.31(o)",
    area: "measurement",
  });
  add({
    difficulty: "hard",
    stem: "A Class B personal computer has a Class A internal peripheral installed but not active. What must still be shown?",
    choices: [
      "The Class B computer still meets the Class B limits in that condition",
      "Only the Class A limits for the whole box",
      "Nothing, because the peripheral is not active",
      "The computer becomes Class A for all marketing",
    ],
    answer: "The Class B computer still meets the Class B limits in that condition",
    explanation: "Section 15.31(k) requires the Class B central unit to keep meeting Class B limits with the Class A internal peripheral installed but not active. A mix that is Class A overall is not a path to a Class B grant.",
    citation: "47 CFR §15.31(k)",
    area: "measurement",
  });

  const auth = [
    ["Scanning receiver", "Certification"],
    ["Radar detector", "Certification"],
    ["Access BPL", "Certification"],
    ["Class B personal computer", "SDoC or Certification"],
    ["Class A digital device", "SDoC or Certification"],
    ["TV broadcast receiver", "SDoC or Certification"],
  ];
  for (const [device, ans] of auth) {
    add({
      difficulty: "medium",
      stem: `§15.101 equipment authorization for a ${device} is:`,
      choices: [
        ans,
        ...otherValues(ans, ["Certification", "SDoC or Certification", "Verification only, with no SDoC", "No authorization of any kind"]),
      ],
      answer: ans,
      explanation: `Table 1 of §15.101 lists ${ans} for that device. Marketing before the required authorization is not allowed unless a specific exemption applies.`,
      citation: "47 CFR §15.101(a)",
      area: "authorization",
    });
  }
  add({
    difficulty: "hard",
    stem: "A receiver that only tunes above 960 MHz, and is not a radar detector or CB receiver, is:",
    choices: [
      "Exempt from the technical provisions of Part 15, but still subject to §15.5",
      "Required to meet §15.109 at 3 m",
      "Required to be certified as a scanning receiver",
      "Exempt from §15.5 as well",
    ],
    answer: "Exempt from the technical provisions of Part 15, but still subject to §15.5",
    explanation: "Section 15.101(b) exempts receivers above 960 MHz or below 30 MHz from the technical provisions, except radar detectors and CB receivers. Section 15.5 still applies.",
    citation: "47 CFR §15.101(b); §15.5",
    area: "authorization",
  });
  add({
    difficulty: "medium",
    stem: "The usual Part 15 label in §15.19(a)(3) states two conditions. They are:",
    choices: [
      "The device may not cause harmful interference, and it must accept any interference received, including interference that may cause undesired operation",
      "The device is licensed and protected from interference",
      "The device may be modified freely by the user",
      "The device complies only when used outdoors",
    ],
    answer: "The device may not cause harmful interference, and it must accept any interference received, including interference that may cause undesired operation",
    explanation: "That two-condition statement is the general label. Receivers tied to a licensed service use a shorter harmful-interference sentence, and a cable switch has its own sentence.",
    citation: "47 CFR §15.19(a)(3)",
    area: "authorization",
  });
  add({
    difficulty: "medium",
    stem: "If a device is too small for a four-point label and has no display that can show an electronic label, §15.19 puts the statement:",
    choices: [
      "In the user manual, and also on the packaging or on a removable label",
      "Only on the FCC website",
      "Nowhere, if the device is under 5 cm",
      "Only inside the device on the PCB",
    ],
    answer: "In the user manual, and also on the packaging or on a removable label",
    explanation: "The small-device path still requires the manual plus either the package or a removable label. A two-section product only needs the statement on the main control unit.",
    citation: "47 CFR §15.19(a)(4), (a)(5)",
    area: "authorization",
  });
  add({
    difficulty: "easy",
    stem: "§15.21 requires the manual to caution that:",
    choices: [
      "Changes or modifications not expressly approved by the responsible party could void the user's authority to operate the equipment",
      "The user must file an STA before first use",
      "Class B devices may ignore interference",
      "Shielded cables are optional even when the grant relied on them",
    ],
    answer: "Changes or modifications not expressly approved by the responsible party could void the user's authority to operate the equipment",
    explanation: "That caution can live in an electronic manual if the user can reasonably be expected to open it. It is separate from the two-condition label.",
    citation: "47 CFR §15.21",
    area: "authorization",
  });
  add({
    difficulty: "medium",
    stem: "Special accessories required for compliance, such as a shielded cable that is not a normal retail item, must be:",
    choices: [
      "Provided with the equipment at no extra charge, unless the device is professionally installed",
      "Listed as optional in an online FAQ only",
      "Omitted if the manual mentions them",
      "Sold only to the test lab",
    ],
    answer: "Provided with the equipment at no extra charge, unless the device is professionally installed",
    explanation: "Section 15.27 requires special accessories to be marketed with the device. Ordinary retail accessories are not special, but the manual must still say they are required. Professional installation shifts the duty to the installer.",
    citation: "47 CFR §15.27",
    area: "authorization",
  });
  add({
    difficulty: "medium",
    stem: "Home-built devices skip equipment authorization only when they are:",
    choices: [
      "Not marketed, not built from a kit, and built in quantities of five or fewer for personal use",
      "Sold as a kit of five",
      "Any one-off, including a product offered for sale",
      "Exempt from §15.5",
    ],
    answer: "Not marketed, not built from a kit, and built in quantities of five or fewer for personal use",
    explanation: "Section 15.23 is narrow: not marketed, not a kit, five or fewer, personal use. Section 15.5 still applies, and good practice is expected if the builder cannot measure.",
    citation: "47 CFR §15.23",
    area: "authorization",
  });
  add({
    difficulty: "easy",
    stem: "A Class B manual statement under §15.105(b) is aimed at:",
    choices: [
      "Reasonable protection against harmful interference in a residential installation",
      "A commercial environment only, with the user correcting interference at their own expense as the main theme",
      "Licensed Part 90 operation",
      "Devices exempted by §15.103",
    ],
    answer: "Reasonable protection against harmful interference in a residential installation",
    explanation: "Class B copy talks about a residential installation and suggests reorienting the antenna, adding separation, moving to another circuit, or calling a technician. Class A copy warns that residential use is likely to cause interference the user must correct.",
    citation: "47 CFR §15.105(a), (b)",
    area: "authorization",
  });

  const exemptions = [
    ["A digital device used only inside a transportation vehicle, including a motor vehicle or aircraft", true],
    ["A digital device used only as an electronic control or power system by a public utility in its own dedicated building, not at a subscriber site", true],
    ["A retail medical gadget sold to the general public", false],
    ["A digital device used only as industrial, commercial, or medical test equipment", true],
    ["A digital device used only inside an appliance such as a dishwasher or window air conditioner", true],
    ["A digital device whose power consumption does not exceed 6 nW", true],
    ["A mouse that contains only non-digital circuitry or a simple converter and is a passive add-on", true],
    ["A device whose highest frequency generated and used are both under 1.705 MHz, but which runs from an AC adaptor", false],
    ["A product that contains one exempt device and one device that is not exempt", false],
  ];
  for (const [stem, exempt] of exemptions) {
    tf(
      "medium",
      `${stem} is exempt from the specific technical standards of Part 15 under §15.103.`,
      exempt,
      exempt
        ? "That case is listed in §15.103. The device is still under the general conditions in §15.5 and §15.29, and operation stops if it actually causes harmful interference."
        : "Section 15.103 does not grant that exemption. A retail medical device, an AC-powered low-frequency device, or a mix with a non-exempt function still faces the technical rules.",
      "47 CFR §15.103",
      "exemptions",
    );
  }
  tf(
    "medium",
    "An exemption under §15.103 removes the duty to stop operating if the Commission finds harmful interference.",
    false,
    "Exempt devices stay under §15.5 and §15.29. The operator stops when the device is found to cause harmful interference and does not restart until it is fixed.",
    "47 CFR §15.103",
    "exemptions",
  );
  add({
    difficulty: "medium",
    stem: "Battery-only devices skip AC conducted tests under §15.107(d) when:",
    choices: [
      "They do not operate from the AC lines and have no provision for doing so",
      "They ship with a charger that allows use while charging",
      "They use a battery eliminator",
      "They draw power through another device that is plugged into AC",
    ],
    answer: "They do not operate from the AC lines and have no provision for doing so",
    explanation: "Pure battery operation with no AC provision skips the conducted test. Chargers that allow operation while charging, AC adaptors, battery eliminators, and indirect AC power all require the conducted test.",
    citation: "47 CFR §15.107(d)",
    area: "conducted-limits",
  });
  add({
    difficulty: "hard",
    stem: "CB receiver radiated emissions from 25 MHz to 30 MHz shall not exceed:",
    choices: [
      "40 µV/m at 3 m",
      "100 µV/m at 3 m",
      "40 µV/m at 10 m",
      "500 µV/m at 3 m",
    ],
    answer: "40 µV/m at 3 m",
    explanation: "Section 15.109(d) caps that 25–30 MHz range at 40 µV/m at 3 m. Above 30 MHz the receiver follows the §15.109(a) table.",
    citation: "47 CFR §15.109(d)",
    area: "radiated-limits",
  });
  add({
    difficulty: "hard",
    stem: "Receivers that tune from 30 to 960 MHz and offer an external antenna port may show antenna-terminal power no higher than:",
    choices: [
      "2.0 nanowatts",
      "2.0 microwatts",
      "20 nanowatts",
      "2.0 milliwatts",
    ],
    answer: "2.0 nanowatts",
    explanation: "Section 15.111(a) sets 2.0 nW at the antenna terminal across the §15.33 measurement range, as part of the path that allows the antenna port to be shielded and terminated for the radiated test.",
    citation: "47 CFR §15.111(a)",
    area: "radiated-limits",
  });
  add({
    difficulty: "medium",
    stem: "Radar detectors must meet the §15.109(a) limits over:",
    choices: [
      "11.7–12.2 GHz",
      "30–88 MHz only",
      "88–108 MHz only",
      "1.705–80 MHz",
    ],
    answer: "11.7–12.2 GHz",
    explanation: "Section 15.109(h) applies the §15.109(a) limits to radar detectors from 11.7 GHz to 12.2 GHz. They are also called out for certification in §15.101.",
    citation: "47 CFR §15.109(h)",
    area: "radiated-limits",
  });
  add({
    difficulty: "medium",
    stem: "Power line carrier systems used for utility supervision under §15.113 keep signals inside:",
    choices: [
      "9 kHz to 490 kHz, on a non-interference basis, with notice to the industry entity rather than the FCC",
      "1.705 MHz to 80 MHz",
      "535 kHz to 1705 kHz with no further duty",
      "The FM broadcast band",
    ],
    answer: "9 kHz to 490 kHz, on a non-interference basis, with notice to the industry entity rather than the FCC",
    explanation: "Section 15.113 confines power line carrier systems to 9 kHz–490 kHz and points the utility to the industry entity in §90.35(g). They still operate under §15.5.",
    citation: "47 CFR §15.113; §15.3(t)",
    area: "definitions",
  });
  add({
    difficulty: "easy",
    stem: "Field-strength measurements should be made, to the extent possible, on:",
    choices: [
      "An open area test site, or another site calibrated so the results match an open area test site",
      "A fully anechoic room with no site comparison",
      "A wooden bench in any office",
      "The installation site only, even for a tabletop widget",
    ],
    answer: "An open area test site, or another site calibrated so the results match an open area test site",
    explanation: "Section 15.31(d) prefers an OATS and allows other sites only when they are calibrated to correspond to OATS results. Some systems, such as carrier current, are measured at a minimum of three representative installations.",
    citation: "47 CFR §15.31(d)",
    area: "measurement",
  });
  add({
    difficulty: "medium",
    stem: "The Commission may ask the responsible party to ship equipment to the FCC Laboratory in Columbia, Maryland. Who pays the shipping?",
    choices: [
      "The responsible party, both ways",
      "The FCC, both ways",
      "The test lab that signed the report",
      "No one; the device is tested in place only",
    ],
    answer: "The responsible party, both ways",
    explanation: "Section 15.29(d) puts shipping to Columbia and back on the responsible party. The Commission uses the measurement procedure that was in effect when the equipment was authorized.",
    citation: "47 CFR §15.29(d)",
    area: "authorization",
  });
  add({
    difficulty: "easy",
    stem: "User-accessible controls must not be able to:",
    choices: [
      "Put the device into a mode that violates the rules",
      "Select a volume level",
      "Turn the device off",
      "Choose a cable or a battery",
    ],
    answer: "Put the device into a mode that violates the rules",
    explanation: "Section 15.15(b) requires that adjusting a control the user can reach will not cause operation in violation. The limits also do not guarantee that harmful interference is impossible.",
    citation: "47 CFR §15.15",
    area: "definitions",
  });
  tf(
    "easy",
    "Part 15 limits are a guarantee that a compliant device will never cause harmful interference.",
    false,
    "Section 15.15(c) says the limits will not prevent harmful interference in every case, which is why §15.5 still makes the operator stop if interference happens.",
    "47 CFR §15.15(c); §15.5",
    "definitions",
  );
  add({
    difficulty: "medium",
    stem: "Subassemblies of digital devices, such as a board sold only to an equipment manufacturer for further fabrication:",
    choices: [
      "Are not themselves subject to the technical standards unless they are marketed as part of a system",
      "Always need their own SDoC before that sale",
      "Are incidental radiators",
      "Must be certified as Access BPL",
    ],
    answer: "Are not themselves subject to the technical standards unless they are marketed as part of a system",
    explanation: "Section 15.101(e) leaves subassemblies out of the technical standards until they are marketed as part of a system. CPU boards and power supplies for personal computers are called out separately and often do need authorization.",
    citation: "47 CFR §15.101(e)",
    area: "authorization",
  });
  add({
    difficulty: "hard",
    stem: "Digital devices may be shown to meet the radiated limits by using which alternative standard, with the Part 15 test procedure still applying?",
    choices: [
      "CISPR 22, Third Edition, except that above 1000 MHz the §15.109(a) or (b) limits still apply",
      "CISPR 12, with no further condition",
      "CISPR 25 only",
      "Any military EMC standard",
    ],
    answer: "CISPR 22, Third Edition, except that above 1000 MHz the §15.109(a) or (b) limits still apply",
    explanation: "Section 15.109(g) allows the CISPR 22 Third Edition alternative for digital devices. Above 1000 MHz you still use the §15.109 limit, extrapolated at 20 dB/decade if the distance changes.",
    citation: "47 CFR §15.109(g)",
    area: "radiated-limits",
  });

  return b.items;
}
