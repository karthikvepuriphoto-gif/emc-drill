import { make, otherValues } from "../engine.mjs";

export function icesBank() {
  const b = make("ices");
  const { add, tf } = b;

  const condB = [
    ["0.15–0.5 MHz", "66 to 56 dBµV quasi-peak, 56 to 46 dBµV average"],
    ["0.5–5 MHz", "56 dBµV quasi-peak, 46 dBµV average"],
    ["5–30 MHz", "60 dBµV quasi-peak, 50 dBµV average"],
  ];
  const condA = [
    ["0.15–0.5 MHz", "79 dBµV quasi-peak, 66 dBµV average"],
    ["0.5–5 MHz", "73 dBµV quasi-peak, 60 dBµV average"],
    ["5–30 MHz", "73 dBµV quasi-peak, 60 dBµV average"],
  ];
  for (const [band, ans] of condB) {
    add({
      difficulty: "medium",
      stem: `ICES-003 Table 1, Class B conducted limit at the AC mains, ${band}?`,
      choices: [
        ans,
        "79 dBµV quasi-peak, 66 dBµV average",
        "73 dBµV quasi-peak, 60 dBµV average",
        "100 dBµV quasi-peak, 90 dBµV average",
      ],
      answer: ans,
      explanation: `Table 1 requires both quasi-peak and average, and the more stringent limit applies at a transition. The Class B value in ${band} is the residential shape.`,
      citation: "ICES-003 issue 7, §3.2.1 Table 1",
      area: "conducted-limits",
    });
  }
  for (const [band, ans] of condA) {
    add({
      difficulty: "medium",
      stem: `ICES-003 Table 1, Class A conducted limit at the AC mains, ${band}?`,
      choices: [
        ans,
        "66 to 56 dBµV quasi-peak, 56 to 46 dBµV average",
        "56 dBµV quasi-peak, 46 dBµV average",
        "60 dBµV quasi-peak, 50 dBµV average",
      ],
      answer: ans,
      explanation: `Class A in Table 1 is flat in each block, and ${band} is ${ans.split(",")[0]}. Both detectors apply, including when the mains port is on an external supply feeding the ITE.`,
      citation: "ICES-003 issue 7, §3.2.1 Table 1",
      area: "conducted-limits",
    });
  }

  const rad = [
    ["Class B", "3 m", "30–88 MHz", "40.0 dBµV/m"],
    ["Class B", "3 m", "88–216 MHz", "43.5 dBµV/m"],
    ["Class B", "3 m", "216–230 MHz", "46.0 dBµV/m"],
    ["Class B", "3 m", "230–960 MHz", "47.0 dBµV/m"],
    ["Class B", "3 m", "960–1000 MHz", "54.0 dBµV/m"],
    ["Class B", "10 m", "30–88 MHz", "30.0 dBµV/m"],
    ["Class B", "10 m", "230–960 MHz", "37.0 dBµV/m"],
    ["Class A", "3 m", "30–88 MHz", "50.0 dBµV/m"],
    ["Class A", "3 m", "230–960 MHz", "57.0 dBµV/m"],
    ["Class A", "10 m", "30–88 MHz", "40.0 dBµV/m"],
    ["Class A", "10 m", "960–1000 MHz", "49.5 dBµV/m"],
    ["Class A", "3 m", "88–216 MHz", "54.0 dBµV/m"],
  ];
  const radPool = [...new Set(rad.map((x) => x[3]))];
  for (const [klass, dist, band, ans] of rad) {
    add({
      difficulty: "hard",
      stem: `ICES-003 Table 2 quasi-peak limit, ${klass} at ${dist}, ${band}?`,
      choices: [ans, ...otherValues(ans, radPool)],
      answer: ans,
      explanation: `Table 2 is quasi-peak from 30 MHz to 1 GHz. The ${klass} limit at ${dist} in ${band} is ${ans}, and the more stringent value applies at a transition.`,
      citation: "ICES-003 issue 7, §3.2.2 Table 2",
      area: "radiated-limits",
    });
  }

  add({
    difficulty: "medium",
    stem: "Above 1 GHz at 3 m, ICES-003 Table 4 Class B limits are:",
    choices: [
      "54 dBµV/m average and 74 dBµV/m peak",
      "60 dBµV/m average and 80 dBµV/m peak",
      "40 dBµV/m quasi-peak only",
      "47 dBµV/m quasi-peak only",
    ],
    answer: "54 dBµV/m average and 74 dBµV/m peak",
    explanation: "Table 4 requires both average and peak from 1 GHz to FM. Class B is 54 / 74 and Class A is 60 / 80, with a measurement bandwidth of at least 1 MHz.",
    citation: "ICES-003 issue 7, §3.2.2 Table 4",
    area: "radiated-limits",
  });
  add({
    difficulty: "medium",
    stem: "Above 1 GHz at 3 m, ICES-003 Table 4 Class A limits are:",
    choices: [
      "60 dBµV/m average and 80 dBµV/m peak",
      "54 dBµV/m average and 74 dBµV/m peak",
      "50 dBµV/m quasi-peak",
      "70 dBµV/m peak only",
    ],
    answer: "60 dBµV/m average and 80 dBµV/m peak",
    explanation: "Class A in Table 4 is 60 dBµV/m average and 80 dBµV/m peak at 3 m. A different distance is extrapolated at 20 dB per decade, and the antenna must be in the far field.",
    citation: "ICES-003 issue 7, §3.2.2 Table 4",
    area: "radiated-limits",
  });

  const fx = [
    ["80 MHz", "1 GHz"],
    ["200 MHz", "2 GHz"],
    ["800 MHz", "5 GHz"],
    ["2 GHz", "10 GHz"],
    ["9 GHz", "40 GHz"],
  ];
  for (const [fxv, fm] of fx) {
    add({
      difficulty: "medium",
      stem: `ICES-003 Table 3: highest internal frequency Fx of ${fxv} means radiated measurements go up to:`,
      choices: [fm, ...otherValues(fm, ["1 GHz", "2 GHz", "5 GHz", "10 GHz", "18 GHz", "40 GHz"])],
      answer: fm,
      explanation: `Table 3 sets FM from Fx. ${fxv} maps to ${fm}. Above 1 GHz, FM is 5 × Fx capped at 40 GHz.`,
      citation: "ICES-003 issue 7, §3.2.2 Table 3",
      area: "frequency-range",
    });
  }

  tf("easy", "ICES-003 issue 7 keeps two alternative limit sets, one CISPR and one FCC.", false, "Issue 7 removed the alternative limits. There is one limit set, while either the CISPR or the ANSI method may still be used.", "ICES-003 issue 7, preface and §3", "scope");
  tf("medium", "All required ICES-003 measurements on one product shall use only one of CAN/CSA-CISPR 32:17 or ANSI C63.4.", true, "Section 3.1 forbids mixing the two methods on the same product. The report has to say which procedure was chosen.", "ICES-003 issue 7, §3.1 and §4.1", "methods");
  tf("medium", "Outdoor units of home satellite receiving systems may ignore Annex H of CAN/CSA-CISPR 32:17 if ANSI C63.4 is used.", false, "Annex H applies to those outdoor units no matter which of the two methods is used, and the highest measurement frequency for them is 18 GHz.", "ICES-003 issue 7, §3.1 and §3.2.2", "methods");
  tf("easy", "The ICES-003 issue 7 transition ended on 15 October 2021.", true, "Section 2.1 gave one year from the 15 October 2020 publication. After that date, products still being marketed had to meet issue 7.", "ICES-003 issue 7, §2.1", "admin");
  tf("medium", "Where ICES-003 and ICES-Gen disagree, ICES-Gen wins.", false, "Section 2.2 says ICES-003 takes precedence over ICES-Gen. A normative reference that disagrees with ICES-Gen yields to ICES-Gen unless ICES-003 says otherwise.", "ICES-003 issue 7, §2.2", "scope");
  tf("easy", "ITE in scope of ICES-003 includes devices that generate or use timing signals at a rate of at least 9 kHz and use digital techniques.", true, "Section 1.1 sets that floor and lists purposes such as computation, display, control, data processing, and storage.", "ICES-003 issue 7, §1.1", "scope");

  add({
    difficulty: "easy",
    stem: "An example ICES-003 compliance label is:",
    choices: [
      "CAN ICES-003(A) / NMB-003(A) or the B form, not both",
      "CAN ICES-003(A/B) / NMB-003(A/B)",
      "FCC ID only",
      "CE plus ICES with no class",
    ],
    answer: "CAN ICES-003(A) / NMB-003(A) or the B form, not both",
    explanation: "Section 4.2 shows CAN ICES-003(*) / NMB-003(*) and says to insert A or B, but not both. The exact artwork is up to the manufacturer if the required information is there.",
    citation: "ICES-003 issue 7, §4.2",
    area: "admin",
  });
  add({
    difficulty: "medium",
    stem: "While a product is in wireless power transfer mode, which standard applies for that mode?",
    choices: ["RSS-216", "ICES-003 limits, including the charging emissions", "ICES-002 only", "RSS-102 only"],
    answer: "RSS-216",
    explanation: "Section 1.3 applies ICES-003 in the primary mode and RSS-216 in wireless power transfer mode. Charging emissions are not counted toward the ICES-003 limits.",
    citation: "ICES-003 issue 7, §1.3",
    area: "scope",
  });
  add({
    difficulty: "medium",
    stem: "A product with an already certified radio module must, in the ICES-003 report:",
    choices: [
      "Show host compliance under RSP-100 and RSS-Gen, including RSS-102, and not count transmitter emissions toward the ICES-003 limits",
      "Repeat the full RSS certification of the module",
      "Ignore RSS-102",
      "Add the transmitter emissions to the ICES-003 scan and compare them to Table 2",
    ],
    answer: "Show host compliance under RSP-100 and RSS-Gen, including RSS-102, and not count transmitter emissions toward the ICES-003 limits",
    explanation: "Section 1.4 says a certified module does not need its RSS report copied in. The host still has host duties, and transmitter emissions are excluded from the ICES-003 limit comparison.",
    citation: "ICES-003 issue 7, §1.4",
    area: "scope",
  });
  add({
    difficulty: "medium",
    stem: "An external switched-mode supply marketed together with the ITE:",
    choices: [
      "Is tested with the ITE, and labeling the supply itself is optional",
      "Must always carry its own ICES-003 label",
      "Is automatically under ICES-001 and cannot be tested with the ITE",
      "Is exempt from limits",
    ],
    answer: "Is tested with the ITE, and labeling the supply itself is optional",
    explanation: "Section 1.2.2 tests the combination. The label is normative for the ITE and optional for the supply that is sold with it.",
    citation: "ICES-003 issue 7, §1.2.2",
    area: "admin",
  });
  add({
    difficulty: "hard",
    stem: "An external switched-mode supply marketed separately is normally:",
    choices: [
      "Under ICES-001, unless it is only for ICES-003 devices and is authorized under ICES-003 instead",
      "Always under ICES-003, with no choice",
      "Under ICES-002",
      "Exempt from every ICES",
    ],
    answer: "Under ICES-001, unless it is only for ICES-003 devices and is authorized under ICES-003 instead",
    explanation: "Section 1.2.3 puts a separately marketed supply in ICES-001. If it is exclusively for ICES-003 devices, the supplier may use ICES-003 instead, and then the supply label is required.",
    citation: "ICES-003 issue 7, §1.2.3",
    area: "scope",
  });

  const ex003 = [
    ["Factory-installed ITE in a vehicle that is subject to ICES-002", true, "Section 1.5.1 sends factory-installed vehicle ITE to ICES-002. The same ITE added after the vehicle is on the market does not get this exemption."],
    ["A laptop brought onto a boat by the owner and not factory-installed", false, "The vehicle exemption is only for factory-installed equipment. Gear that was not installed before the vehicle was placed on the market stays in ICES-003 if it is otherwise in scope."],
    ["ITE used exclusively inside an aircraft", true, "Section 1.5.1 exempts ITE or digital apparatus intended exclusively for use inside an aircraft."],
    ["ITE used only as ISM equipment", true, "ISM equipment is under ICES-001, so it is outside ICES-003."],
    ["An electronic display on the outside of a refrigerator door", false, "Section 1.5.1 says a display that is not part of the appliance's main function does not get the in-appliance exemption."],
    ["An external thermostat for a furnace", false, "ITE that is not contained in the appliance, such as an external thermostat, does not qualify for the in-appliance exemption."],
    ["A device with maximum power consumption of 6 nW", true, "The 6 nW case is a listed exemption in §1.5.1."],
    ["A passive mouse with only non-digital circuitry", true, "Joystick-like passive add-ons with only non-digital circuitry, or a simple format converter, are exempt."],
    ["A central-office switch used only by a telecom common carrier in a central office", true, "Section 1.5.1 exempts ITE used exclusively in central office telephone equipment of a telecommunications common carrier."],
    ["A multiunit product in which one of the pieces is not exempt", false, "Section 1.5.3 exempts a multiunit product only when every device in it is exempt. Otherwise the non-exempt parts are configured and operating during the test."],
  ];
  for (const [text, ok, why] of ex003) {
    tf("medium", `${text} is outside the scope of ICES-003.`, ok, why, "ICES-003 issue 7, §1.5", "scope");
  }

  tf("easy", "ICES-002 issue 7 covers boats only when they are longer than 15 m.", false, "Section 1.1 covers boats of up to 15 m, including outboard engines that are marketed on their own.", "ICES-002 issue 7, §1.1", "vehicles");
  tf("medium", "ICES-002 issue 7 transition ran until September 2022.", true, "Section 3.1 allowed issue 6 or issue 7 until two years after the September 2020 publication, which is September 2022.", "ICES-002 issue 7, §3.1", "admin");
  tf("medium", "ISED has adopted CISPR 14-1, so a battery lawn mower can leave ICES-002.", false, "The preface and §1.1 note that CISPR 14-1 is not an ISED requirement. Devices with traction batteries stay in ICES-002.", "ICES-002 issue 7, §1.1", "vehicles");
  tf("hard", "Clauses 6.3 through 6.6 and Annex A of CAN/CSA-CISPR 12-10 may be used to show statistical compliance with ICES-002.", false, "Section 4.2 forbids those statistical provisions. Under the Radiocommunication Act, each unit has to meet the limits.", "ICES-002 issue 7, §4.2", "methods");
  tf("easy", "A one-off personal installation of a hitch or winch is outside ICES-002.", true, "Section 1.5.1 excludes one-off modifications a person makes for private use, and gives a truck box, a winch, or a hitch as examples.", "ICES-002 issue 7, §1.5.1", "vehicles");
  tf("medium", "An aftermarket ICES-003 entertainment system installed in a car makes the whole car exempt from ICES-002.", false, "Section 1.5.2 exempts the compliant new component and its installation. The base vehicle still has to comply with ICES-002.", "ICES-002 issue 7, §1.5.2", "vehicles");
  tf("medium", "Anyone who manufactures, imports, distributes, leases, offers for sale, or sells the final product can be a responsible party.", true, "Section 2.1 ties responsibility to the activities in subsection 4(3) of the Radiocommunication Act. A later modifier in a multistage build picks up that duty too.", "ICES-002 issue 7, §2.1 and §2.2", "admin");

  add({
    difficulty: "medium",
    stem: "In ICES-002, a 'device' is:",
    choices: [
      "A machine, other than a vehicle, driven by a combustion engine or traction battery, not primarily meant to carry persons or goods",
      "Any boat over 15 m",
      "Only a passenger car",
      "A radio module",
    ],
    answer: "A machine, other than a vehicle, driven by a combustion engine or traction battery, not primarily meant to carry persons or goods",
    explanation: "Section 3.2 defines device that way and gives examples such as generators, chainsaws, pumps, and landscaping equipment. A vehicle is a land machine meant to carry persons or goods or to be operated by an on-board person.",
    citation: "ICES-002 issue 7, §3.2",
    area: "vehicles",
  });
  add({
    difficulty: "medium",
    stem: "If charging current can be adjusted, ICES-002 §4.3 tests set it to:",
    choices: [
      "At least 80% of maximum for the whole test",
      "10% of maximum",
      "Whatever the battery happens to accept",
      "100% only for the first minute",
    ],
    answer: "At least 80% of maximum for the whole test",
    explanation: "Section 4.3.2.1 sets adjustable current to at least 80% of maximum. If it cannot be adjusted, state of charge stays between 20% and 80%, splitting long scans if needed.",
    citation: "ICES-002 issue 7, §4.3.2.1",
    area: "vehicles",
  });
  add({
    difficulty: "hard",
    stem: "For conducted tests of an AC-charging vehicle, the AMN lateral separation from the closest body point is:",
    choices: [
      "80 cm, with a +20 cm / −0 cm tolerance",
      "40 cm exactly",
      "3 m",
      "10 cm exactly",
    ],
    answer: "80 cm, with a +20 cm / −0 cm tolerance",
    explanation: "Section 4.3.2.2 places the AMN 80 cm (+20/−0) from the projection of the closest point, bonded to the ground plane. The vertical drop of the cable is 10 cm (+20/−0) from the body.",
    citation: "ICES-002 issue 7, §4.3.2.2",
    area: "vehicles",
  });
  add({
    difficulty: "hard",
    stem: "Excess vehicle charge cable lying on the ground plane is dressed by:",
    choices: [
      "Insulating supports up to 15 cm high, and a z-fold no wider than 50 cm",
      "A tight coil on the metal floor",
      "Leaving it in a random pile",
      "Routing it out to the antenna",
    ],
    answer: "Insulating supports up to 15 cm high, and a z-fold no wider than 50 cm",
    explanation: "Section 4.3.2.2 specifies those supports and the z-fold. The radiated antenna distance is to the vehicle body and does not include the power cable.",
    citation: "ICES-002 issue 7, §4.3.2.2 and §4.3.2.3",
    area: "vehicles",
  });
  add({
    difficulty: "medium",
    stem: "Choose §4.3 versus §4.4 of ICES-002 based on:",
    choices: [
      "Where the switching power-supply circuitry sits: on the vehicle, or in an external unit",
      "The paint color of the vehicle",
      "Whether the boat is under 5 m",
      "The driver's license class",
    ],
    answer: "Where the switching power-supply circuitry sits: on the vehicle, or in an external unit",
    explanation: "Section 4.3 covers onboard switching circuitry, including an EVSE box that has no switching supply of its own. Section 4.4 covers an external supply or converter.",
    citation: "ICES-002 issue 7, §4.3.1",
    area: "vehicles",
  });
  add({
    difficulty: "medium",
    stem: "Radiated limits for the vehicle in its primary driving mode come from:",
    choices: [
      "CAN/CSA-CISPR 12-10, as modified by ICES-002",
      "A numeric table printed in ICES-002 §4.3.3.2",
      "FCC §15.109 Class B",
      "ICES-003 Table 2",
    ],
    answer: "CAN/CSA-CISPR 12-10, as modified by ICES-002",
    explanation: "Section 4.3.3.2 points radiated limits for that AC-charging case back to CAN/CSA-CISPR 12-10. ICES-002 does not reprint those vehicle radiated numbers.",
    citation: "ICES-002 issue 7, §4.1 and §4.3.3.2",
    area: "limits",
  });

  const classAcond = [
    ["≤ 20 kVA", "0.15–0.5 MHz", "79 dBµV quasi-peak and 66 dBµV average"],
    ["≤ 20 kVA", "0.5–5 MHz", "73 dBµV quasi-peak and 60 dBµV average"],
    ["> 20 kVA and ≤ 75 kVA", "0.15–0.5 MHz", "100 dBµV quasi-peak and 90 dBµV average"],
    ["> 20 kVA and ≤ 75 kVA", "0.5–5 MHz", "86 dBµV quasi-peak and 76 dBµV average"],
    ["> 75 kVA", "0.15–0.5 MHz", "130 dBµV quasi-peak and 120 dBµV average"],
    ["> 75 kVA", "5–30 MHz", "115 dBµV quasi-peak and 105 dBµV average"],
  ];
  for (const [power, band, ans] of classAcond) {
    add({
      difficulty: "hard",
      stem: `ICES-002 Table 1 Class A conducted limit, rated power ${power}, ${band}?`,
      choices: [
        ans,
        "66 to 56 dBµV quasi-peak and 56 to 46 dBµV average",
        "56 dBµV quasi-peak and 46 dBµV average",
        "60 dBµV quasi-peak and 50 dBµV average",
      ],
      answer: ans,
      explanation: `Table 1 scales Class A mains limits with rated power. For ${power} in ${band} the limits are ${ans}. The relaxed columns have installation conditions and are not a free choice.`,
      citation: "ICES-002 issue 7, §4.3.3.1 Table 1",
      area: "conducted-limits",
    });
  }
  add({
    difficulty: "hard",
    stem: "ICES-002 equipment that can be connected to low-voltage overhead lines must use which Class A conducted column?",
    choices: [
      "The ≤ 20 kVA limits, even if the nameplate is higher",
      "The > 75 kVA limits",
      "No conducted limit",
      "Class B limits with a 20 dB relaxation",
    ],
    answer: "The ≤ 20 kVA limits, even if the nameplate is higher",
    explanation: "Note iv of Table 1 says the mid-power limits are only for a dedicated transformer or generator, not for low-voltage overhead lines. If overhead lines are possible, use the ≤ 20 kVA column.",
    citation: "ICES-002 issue 7, §4.3.3.1 Table 1 note iv",
    area: "conducted-limits",
  });
  add({
    difficulty: "medium",
    stem: "ICES-002 Table 2 Class B conducted limits from 5 MHz to 30 MHz are:",
    choices: [
      "60 dBµV quasi-peak and 50 dBµV average",
      "56 dBµV quasi-peak and 46 dBµV average",
      "73 dBµV quasi-peak and 60 dBµV average",
      "79 dBµV quasi-peak and 66 dBµV average",
    ],
    answer: "60 dBµV quasi-peak and 50 dBµV average",
    explanation: "Class B in Table 2 matches the familiar residential shape: a slope from 0.15–0.5 MHz, then 56/46, then 60/50. The more stringent limit applies at each transition.",
    citation: "ICES-002 issue 7, §4.3.3.1 Table 2",
    area: "conducted-limits",
  });

  const ps = [
    ["Class B", "3 m", "30–230 MHz", "40 dBµV/m"],
    ["Class B", "10 m", "30–230 MHz", "30 dBµV/m"],
    ["Class B", "3 m", "230–1000 MHz", "47 dBµV/m"],
    ["Class B", "10 m", "230–1000 MHz", "37 dBµV/m"],
    ["Class A", "10 m OATS/SAC", "30–230 MHz, ≤ 20 kVA", "40 dBµV/m"],
    ["Class A", "3 m OATS/SAC", "30–230 MHz, ≤ 20 kVA", "50 dBµV/m"],
    ["Class A", "10 m OATS/SAC", "230–1000 MHz, ≤ 20 kVA", "47 dBµV/m"],
    ["Class A", "3 m OATS/SAC", "230–1000 MHz, > 20 kVA where allowed", "60 dBµV/m"],
  ];
  for (const [klass, site, band, ans] of ps) {
    add({
      difficulty: "hard",
      stem: `ICES-002 power-supply radiated quasi-peak, ${klass}, ${site}, ${band}?`,
      choices: [ans, ...otherValues(ans, ["30 dBµV/m", "37 dBµV/m", "40 dBµV/m", "47 dBµV/m", "50 dBµV/m", "57 dBµV/m", "60 dBµV/m"])],
      answer: ans,
      explanation: `Tables 3 and 4 publish these quasi-peak field limits for external supplies and converters. ${klass} at ${site} in ${band} is ${ans}.`,
      citation: "ICES-002 issue 7, §4.4.2.2 Tables 3 and 4",
      area: "radiated-limits",
    });
  }
  add({
    difficulty: "medium",
    stem: "If Class A limits were used under ICES-002 §4.3 or §4.4, the label:",
    choices: [
      "Must show the class, for example CAN ICES-002(A) / NMB-002(A)",
      "Must show both A and B",
      "Must omit the class",
      "Is replaced by an FCC label",
    ],
    answer: "Must show the class, for example CAN ICES-002(A) / NMB-002(A)",
    explanation: "Section 5.2 requires the class on the label when Class A limits from §4.3 or §4.4 were used. If Class B limits were used, showing the letter is the manufacturer's choice.",
    citation: "ICES-002 issue 7, §5.2",
    area: "admin",
  });
  add({
    difficulty: "easy",
    stem: "For an ICES-002 vehicle report, the serial number is:",
    choices: [
      "The vehicle identification number (VIN)",
      "Optional and usually omitted",
      "The engine paint code only",
      "The driver's license number",
    ],
    answer: "The vehicle identification number (VIN)",
    explanation: "Section 5.1 says the equipment under test is the whole vehicle, boat, or device, and the vehicle serial number is the VIN. ICES-Gen report items that CISPR 12 does not cover, such as site-validation uncertainty, are not applied.",
    citation: "ICES-002 issue 7, §5.1",
    area: "admin",
  });
  add({
    difficulty: "hard",
    stem: "Annex K of CAN/CSA-IEC CISPR 16-1-1:18 is:",
    choices: [
      "Not acceptable for ICES-002 measurements",
      "The only allowed calibration method",
      "Required for every antenna",
      "A labeling annex",
    ],
    answer: "Not acceptable for ICES-002 measurements",
    explanation: "Section 3.4.2 excludes Annex K because it leans on unspecified manufacturer calibration. Instruments still have to meet the rest of that standard.",
    citation: "ICES-002 issue 7, §3.4.2",
    area: "methods",
  });
  add({
    difficulty: "medium",
    stem: "A supply already compliant with ICES-001 that charges an ICES-002 vehicle is:",
    choices: [
      "Exempt from the ICES-002 requirements",
      "Required to be retested to ICES-002 Table 4 anyway",
      "Under RSS-216 only",
      "A final product that needs a VIN",
    ],
    answer: "Exempt from the ICES-002 requirements",
    explanation: "Section 1.4 says a switched-mode supply or semiconductor converter for these vehicles must meet ICES-002, unless it is already compliant with ICES-001, in which case it is exempt from ICES-002.",
    citation: "ICES-002 issue 7, §1.4",
    area: "scope",
  });
  add({
    difficulty: "medium",
    stem: "The 'manufacturer' in ICES-002 §3.2 must be:",
    choices: [
      "Located in Canada, the main fabricant of the final product, and the one who places it on the Canadian market",
      "Any foreign brand owner, with no Canadian presence",
      "The end user",
      "The test lab",
    ],
    answer: "Located in Canada, the main fabricant of the final product, and the one who places it on the Canadian market",
    explanation: "The definition requires all three: location in Canada, the main fabricant or integrator, and placing the final product on the Canadian market directly or through dealers.",
    citation: "ICES-002 issue 7, §3.2",
    area: "admin",
  });
  add({
    difficulty: "easy",
    stem: "ICES-003 conducted limits are applied at:",
    choices: [
      "The AC mains terminals, including the mains of an external supply that powers the product",
      "The antenna port",
      "Only a DC battery clip",
      "1 m from the enclosure",
    ],
    answer: "The AC mains terminals, including the mains of an external supply that powers the product",
    explanation: "Section 3.2.1 puts the limits on the AC mains terminals. If power comes through an external supply or a PoE injector, the limits move to that device's AC mains while it powers the product.",
    citation: "ICES-003 issue 7, §3.2.1",
    area: "conducted-limits",
  });
  tf(
    "medium",
    "A fridge-door display that is not part of the cooling function is still inside the ICES-003 appliance exemption.",
    false,
    "Section 1.5.1 keeps that display, and a vending-machine payment display, inside ICES-003. The exemption is for digital hardware that directly controls the main function of an appliance that does not use RF for that function.",
    "ICES-003 issue 7, §1.5.1",
    "scope",
  );

  return b.items;
}
