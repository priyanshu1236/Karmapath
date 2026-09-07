# ROLE NORMALIZATION REPORT

## Total Roles
41

## Normalized Dataset Location
`data/roles/normalized_roles.json`

## Complete Role Inventory
| Role ID | Role Name | Source | Domain | Courses | Competency Count |
| ------- | --------- | ------ | ------ | ------- | ---------------- |
| role_01 | STATISTICAL INVESTIGATOR GRADE I | igot_role_dataset |  | 6 | 1 |
| role_02 | STATISTICAL INVESTIGATOR GRADE II | igot_role_dataset |  | 6 | 1 |
| role_03 | JOINT SECRETARY LEVEL OFFICER / DIRECTOR | igot_role_dataset |  | 6 | 1 |
| role_04 | SENIOR TECHNICAL DIRECTOR | igot_role_dataset |  | 6 | 1 |
| role_05 | DEPUTY SECRETARY | igot_role_dataset |  | 6 | 1 |
| role_06 | ASSISTANT DIRECTOR / RESEARCH OFFICER (ADCO/RO) | igot_role_dataset |  | 6 | 1 |
| role_07 | ASSISTANT REGISTRAR GENERAL (SOCIAL STUDIES) | igot_role_dataset |  | 6 | 1 |
| role_08 | DIRECTOR GENERAL, FORESTRY RESEARCH ORGANISATION | igot_role_dataset |  | 3 | 1 |
| role_09 | SENIOR POLICE OFFICER (25+ YEARS SERVICE) | igot_role_dataset |  | 1 | 1 |
| role_10 | DIRECTOR / DEPUTY SECRETARY EQUIVALENT | igot_role_dataset |  | 7 | 1 |
| role_11 | MAP ANALYST | igot_role_dataset |  | 6 | 1 |
| role_12 | RESEARCH ANALYST | igot_role_dataset |  | 3 | 1 |
| role_13 | SYSTEM ANALYST | igot_role_dataset |  | 3 | 2 |
| role_14 | SENIOR SYSTEM ANALYST / DEPUTY DIRECTOR / UNDER SECRETARY / ASSISTANT REGISTRAR / PPS / AD / SENIOR AO | igot_role_dataset |  | 3 | 4 |
| role_15 | TECHNICAL OFFICER | igot_role_dataset |  | 2 | 1 |
| role_16 | TECHNICAL PERSONNEL | igot_role_dataset |  | 3 | 1 |
| role_17 | CHIEF TECHNICAL OFFICER | igot_role_dataset |  | 3 | 1 |
| role_18 | ASSISTANT DIRECTOR, CENSUS OPERATIONS (TECHNICAL) | igot_role_dataset |  | 6 | 1 |
| role_19 | SENIOR TECHNICAL OFFICER | igot_role_dataset |  | 3 | 1 |
| role_20 | CHIEF TECHNICAL OFFICER | igot_role_dataset |  | 3 | 1 |
| role_21 | SENIOR RESEARCH OFFICER (SOCIAL STUDIES) | igot_role_dataset |  | 6 | 1 |
| role_22 | MAP OFFICER | igot_role_dataset |  | 6 | 1 |
| role_23 | EXECUTIVE DIRECTOR / DIRECTOR (AUCTIONS) | igot_role_dataset |  | 4 | 1 |
| role_24 | CHAIRMAN-CUM-MANAGING DIRECTOR / EXECUTIVE DIRECTOR | igot_role_dataset |  | 3 | 1 |
| role_25 | QUALITY ASSURANCE OFFICER | igot_role_dataset |  | 12 | 1 |
| role_26 | AIS OFFICER | igot_role_dataset |  | 3 | 2 |
| role_27 | ASSISTANT SECTION OFFICER | igot_role_dataset |  | 6 | 1 |
| role_28 | SECTION OFFICER | igot_role_dataset |  | 6 | 1 |
| role_29 | DEPUTY REGISTRAR GENERAL (MAPS) | igot_role_dataset |  | 6 | 1 |
| role_30 | ADDITIONAL REGISTRAR GENERAL | igot_role_dataset |  | 6 | 1 |
| role_31 | DEPUTY REGISTRAR GENERAL (SOCIAL STUDIES) | igot_role_dataset |  | 6 | 1 |
| role_32 | DEPUTY REGISTRAR GENERAL (CENSUS & TRAINING) | igot_role_dataset |  | 6 | 1 |
| role_33 | RESEARCH OFFICER (DRAWING) / MAP OFFICER | igot_role_dataset |  | 6 | 1 |
| role_34 | GEOGRAPHER | igot_role_dataset |  | 6 | 1 |
| role_35 | MTS -- ADMINISTRATIVE SUPPORT | igot_role_dataset |  | 3 | 1 |
| role_36 | MTS -- DEPARTMENTAL SUPPORT | igot_role_dataset |  | 3 | 1 |
| role_37 | LAB ATTENDANT / DRIVER | igot_role_dataset |  | 8 | 1 |
| role_38 | SCIENTIST B / SCIENTIST C | igot_role_dataset |  | 3 | 4 |
| role_39 | SCIENTIST G / SENIOR SCIENTIST | igot_role_dataset |  | 6 | 1 |
| role_40 | JOINT SECRETARY AND ABOVE | igot_role_dataset |  | 3 | 1 |
| statistical_officer | Statistical Officer | standalone_prototype | Agricultural Statistics | 0 | 6 |

## Competency Path Structure
Paths are successfully parsed into levels. For example, `Functional → Office Management → Office Procedures` becomes:
```json
{
  "original_path": "Functional → Office Management → Office Procedures",
  "levels": ["Functional", "Office Management", "Office Procedures"]
}
```

## Competency Frequency
| Competency (Original Path) | Frequency | Roles |
| -------------------------- | --------- | ----- |
| Functional → Office Management → Office Procedures | 6 | role_01, role_02, role_06... |
| Behavioural → Service Orientation → Responsiveness | 3 | role_15, role_19, role_23 |
| Functional → Digital Fluency → Digital Service Design | 2 | role_03, role_05 |
| Functional → Cabinet Note Preparation → Cabinet Note Writing | 2 | role_07, role_14 |
| Functional → Data Analytics → Data Analysis & Visualization | 2 | role_13, role_26 |
| Functional → Data Analytics → Data-led Decision Making | 2 | role_21, role_31 |
| Behavioural → Team Leadership → Inspiring Others | 2 | role_30, role_32 |
| Functional → Administration Matters → Handling Allowances & Reimbursement | 2 | role_35, role_37 |
| Behavioural → Decision Making → Logical Reasoning | 1 | role_04 |
| Functional → Digital Fluency → Emerging Technology | 1 | role_08 |
| Domain → Technology → Telecommunications | 1 | role_09 |
| Domain → Commerce and Industry → Commerce | 1 | role_10 |
| Behavioural → Communication → Presentation Skills | 1 | role_11 |
| Behavioural → Collaboration → Diversity & Inclusion | 1 | role_12 |
| Digital Fluency → Digital Tools (MS Office, Excel & PPT) & Platforms | 1 | role_13 |
| Functional → Public Procurement (GFR) → Procurement Management through GeM | 1 | role_14 |
| Functional → Handling RTI Matters → RTI Records Management | 1 | role_14 |
| Functional → Office Management → Noting & Drafting of Official Communications | 1 | role_14 |
| Domain → Resources → Environment, Forest and Climate Change | 1 | role_16 |
| Behavioural → Service Orientation → Service Excellence (wrt citizens) | 1 | role_17 |
| Behavioural → Outcome Orientation → Goal Setting | 1 | role_20 |
| Functional → Project Management → Project Planning | 1 | role_22 |
| Technology → Science & Technology | 1 | role_24 |
| Functional → Information & Communication Management → Dissemination of Information | 1 | role_25 |
| Functional → Public Procurement (GFR) → Contract Management | 1 | role_26 |
| Functional → Project Management → Project Implementation | 1 | role_29 |
| Functional → Data Analytics → Data Management | 1 | role_33 |
| Behavioural → Personal Effectiveness → Stress Management | 1 | role_34 |
| Behavioural → Communication → Reading & Comprehension | 1 | role_36 |
| Behavioural → Communication → Active Listening | 1 | role_38 |
| Behavioural → Collaboration → Relationship Management | 1 | role_38 |
| Behavioural → Service Orientation → Empathy | 1 | role_38 |
| Behavioural → Collaborative Leadership → Conflict Management | 1 | role_38 |
| Behavioural → Team Leadership → Mentoring | 1 | role_39 |
| Functional → Vigilance Administration → Conduct Rules | 1 | role_40 |
| Agricultural Statistics | 1 | statistical_officer |
| Survey Design | 1 | statistical_officer |
| Sampling | 1 | statistical_officer |
| Data Quality | 1 | statistical_officer |
| GIS | 1 | statistical_officer |
| Python / Data Analysis | 1 | statistical_officer |

## Competency Variants
Grouping by leaf nodes (lowercased/stripped):

## Explicit Role-Course Coverage
| Role ID | Course Count | Mapped Course IDs |
| ------- | ------------ | ----------------- |
| role_01 | 6 | course_001, course_002, course_003, course_004, course_005, course_006 |
| role_02 | 6 | course_004, course_002, course_007, course_008, course_009, course_005 |
| role_03 | 6 | course_010, course_011, course_012, course_013, course_014, course_015 |
| role_04 | 6 | course_016, course_017, course_018, course_019, course_020, course_021 |
| role_05 | 6 | course_022, course_018, course_013, course_023, course_024, course_025 |
| role_06 | 6 | course_026, course_027, course_002, course_028, course_029, course_030 |
| role_07 | 6 | course_031, course_026, course_005, course_019, course_018, course_032 |
| role_08 | 3 | course_033, course_034, course_035 |
| role_09 | 1 | course_036 |
| role_10 | 7 | course_037, course_038, course_039, course_040, course_026, course_041, course_042 |
| role_11 | 6 | course_016, course_043, course_044, course_045, course_046, course_047 |
| role_12 | 3 | course_025, course_048, course_049 |
| role_13 | 3 | course_050, course_051, course_052 |
| role_14 | 3 | course_031, course_053, course_054 |
| role_15 | 2 | course_055, course_056 |
| role_16 | 3 | course_057, course_058, course_059 |
| role_17 | 3 | course_060, course_061, course_062 |
| role_18 | 6 | course_063, course_064, course_054, course_065, course_066, course_067 |
| role_19 | 3 | course_060, course_061, course_055 |
| role_20 | 3 | course_068, course_069, course_070 |
| role_21 | 6 | course_071, course_072, course_031, course_005, course_073, course_006 |
| role_22 | 6 | course_022, course_074, course_075, course_076, course_077, course_078 |
| role_23 | 4 | course_079, course_080, course_081, course_082 |
| role_24 | 3 | course_083, course_084, course_085 |
| role_25 | 12 | course_086, course_087, course_088, course_089, course_090, course_091, course_092, course_093, course_094, course_095, course_096, course_097 |
| role_26 | 3 | course_098, course_099, course_100 |
| role_27 | 6 | course_027, course_026, course_101, course_102, course_029, course_103 |
| role_28 | 6 | course_027, course_026, course_101, course_104, course_029, course_103 |
| role_29 | 6 | course_010, course_073, course_105, course_106, course_107, course_013 |
| role_30 | 6 | course_108, course_011, course_012, course_013, course_014, course_015 |
| role_31 | 6 | course_065, course_073, course_032, course_109, course_110, course_029 |
| role_32 | 6 | course_111, course_103, course_015, course_012, course_026, course_076 |
| role_33 | 6 | course_022, course_074, course_076, course_075, course_044, course_047 |
| role_34 | 6 | course_016, course_112, course_047, course_045, course_046, course_044 |
| role_35 | 3 | course_113, course_114, course_115 |
| role_36 | 3 | course_116, course_117, course_118 |
| role_37 | 8 | course_119, course_120, course_121, course_122, course_123, course_124, course_125, course_126 |
| role_38 | 3 | course_127, course_128, course_129 |
| role_39 | 6 | course_130, course_131, course_132, course_133, course_134, course_135 |
| role_40 | 3 | course_136, course_137, course_138 |
| statistical_officer | 0 |  |

## Assessment Readiness by Role
| Role ID | Role Name | Readiness | Missing Elements |
| ------- | --------- | --------- | ---------------- |
| role_01 | STATISTICAL INVESTIGATOR GRADE I | PARTIALLY READY | No benchmark, No questions available |
| role_02 | STATISTICAL INVESTIGATOR GRADE II | PARTIALLY READY | No benchmark, No questions available |
| role_03 | JOINT SECRETARY LEVEL OFFICER / DIRECTOR | PARTIALLY READY | No benchmark, No questions available |
| role_04 | SENIOR TECHNICAL DIRECTOR | PARTIALLY READY | No benchmark, No questions available |
| role_05 | DEPUTY SECRETARY | PARTIALLY READY | No benchmark, No questions available |
| role_06 | ASSISTANT DIRECTOR / RESEARCH OFFICER (ADCO/RO) | PARTIALLY READY | No benchmark, No questions available |
| role_07 | ASSISTANT REGISTRAR GENERAL (SOCIAL STUDIES) | PARTIALLY READY | No benchmark, No questions available |
| role_08 | DIRECTOR GENERAL, FORESTRY RESEARCH ORGANISATION | PARTIALLY READY | No benchmark, No questions available |
| role_09 | SENIOR POLICE OFFICER (25+ YEARS SERVICE) | PARTIALLY READY | No benchmark, No questions available |
| role_10 | DIRECTOR / DEPUTY SECRETARY EQUIVALENT | PARTIALLY READY | No benchmark, No questions available |
| role_11 | MAP ANALYST | PARTIALLY READY | No benchmark, No questions available |
| role_12 | RESEARCH ANALYST | PARTIALLY READY | No benchmark, No questions available |
| role_13 | SYSTEM ANALYST | PARTIALLY READY | No benchmark, No questions available |
| role_14 | SENIOR SYSTEM ANALYST / DEPUTY DIRECTOR / UNDER SECRETARY / ASSISTANT REGISTRAR / PPS / AD / SENIOR AO | PARTIALLY READY | No benchmark, No questions available |
| role_15 | TECHNICAL OFFICER | PARTIALLY READY | No benchmark, No questions available |
| role_16 | TECHNICAL PERSONNEL | PARTIALLY READY | No benchmark, No questions available |
| role_17 | CHIEF TECHNICAL OFFICER | PARTIALLY READY | No benchmark, No questions available |
| role_18 | ASSISTANT DIRECTOR, CENSUS OPERATIONS (TECHNICAL) | PARTIALLY READY | No benchmark, No questions available |
| role_19 | SENIOR TECHNICAL OFFICER | PARTIALLY READY | No benchmark, No questions available |
| role_20 | CHIEF TECHNICAL OFFICER | PARTIALLY READY | No benchmark, No questions available |
| role_21 | SENIOR RESEARCH OFFICER (SOCIAL STUDIES) | PARTIALLY READY | No benchmark, No questions available |
| role_22 | MAP OFFICER | PARTIALLY READY | No benchmark, No questions available |
| role_23 | EXECUTIVE DIRECTOR / DIRECTOR (AUCTIONS) | PARTIALLY READY | No benchmark, No questions available |
| role_24 | CHAIRMAN-CUM-MANAGING DIRECTOR / EXECUTIVE DIRECTOR | PARTIALLY READY | No benchmark, No questions available |
| role_25 | QUALITY ASSURANCE OFFICER | PARTIALLY READY | No benchmark, No questions available |
| role_26 | AIS OFFICER | PARTIALLY READY | No benchmark, No questions available |
| role_27 | ASSISTANT SECTION OFFICER | PARTIALLY READY | No benchmark, No questions available |
| role_28 | SECTION OFFICER | PARTIALLY READY | No benchmark, No questions available |
| role_29 | DEPUTY REGISTRAR GENERAL (MAPS) | PARTIALLY READY | No benchmark, No questions available |
| role_30 | ADDITIONAL REGISTRAR GENERAL | PARTIALLY READY | No benchmark, No questions available |
| role_31 | DEPUTY REGISTRAR GENERAL (SOCIAL STUDIES) | PARTIALLY READY | No benchmark, No questions available |
| role_32 | DEPUTY REGISTRAR GENERAL (CENSUS & TRAINING) | PARTIALLY READY | No benchmark, No questions available |
| role_33 | RESEARCH OFFICER (DRAWING) / MAP OFFICER | PARTIALLY READY | No benchmark, No questions available |
| role_34 | GEOGRAPHER | PARTIALLY READY | No benchmark, No questions available |
| role_35 | MTS -- ADMINISTRATIVE SUPPORT | PARTIALLY READY | No benchmark, No questions available |
| role_36 | MTS -- DEPARTMENTAL SUPPORT | PARTIALLY READY | No benchmark, No questions available |
| role_37 | LAB ATTENDANT / DRIVER | PARTIALLY READY | No benchmark, No questions available |
| role_38 | SCIENTIST B / SCIENTIST C | PARTIALLY READY | No benchmark, No questions available |
| role_39 | SCIENTIST G / SENIOR SCIENTIST | PARTIALLY READY | No benchmark, No questions available |
| role_40 | JOINT SECRETARY AND ABOVE | PARTIALLY READY | No benchmark, No questions available |
| statistical_officer | Statistical Officer | READY | None |

## Statistical Officer vs iGOT Roles
Statistical Officer is clearly marked as `standalone_prototype` and explicitly defines critical competencies (unlike iGOT roles, which define generic competency mappings but no criticality ranking or prioritization). Statistical Officer has 0 explicitly mapped courses, while most iGOT roles have 3-6 mapped courses.

## Missing Data
- Question banks and requirements for the 40 iGOT roles.
- Explicit critical vs non-critical prioritization for the iGOT roles.
- Direct explicit linkage from course to specific competencies (mappings are currently Role -> Course).

## Data Quality Issues
- Hierarchical strings ('A → B → C') are overloaded. Sometimes they mean 'Domain → Subdomain → Skill', other times just a category.
- Course mapping does not distinguish which course satisfies which competency for a role.

## Final Architecture Recommendation
To support many roles seamlessly, we need the following generic data structures:
1. **Normalized Role Record** (as implemented here) that maps a `role_id` to an exact list of required competency IDs and defines critical vs standard.
2. **Global Competency Registry** that maps a clean `competency_id` to its textual definition (rather than embedding strings everywhere).
3. **Role Requirements Config** that dynamically specifies benchmark thresholds per `role_id`.
4. **Centralized Question Bank** keyed by `competency_id` rather than role.
