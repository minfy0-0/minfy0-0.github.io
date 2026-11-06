---
layout: case-study
lang: en
locale: en_US
project_slug: ask1-pipeline
permalink: /en/projects/ask1-pipeline/
translation_url: /projects/ask1-pipeline/
title: ASK1 Research Data Integration
eyebrow: Public data collection and validation / 2026
description: I connected research records from three sources while distinguishing information not collected from matches not yet confirmed. The work covers source preservation, transformation, validation, and a data viewer.
tags: [Python, Snowflake, SQL, Public API, Streamlit]
facts:
  - {label: Data snapshot, value: 'Collected September 7–8, 2026'}
  - {label: Source records, value: '4,465 RAW records · 2,576 activity records'}
  - {label: Selonsertib matching, value: '9 of 11 collected trials matched · 2 pending review'}
  - {label: Validation record, value: 'September 11, 2026 · 43 offline tests passed'}
---

## “Not searched” was being displayed as zero

After taking part in an ASK1 (MAP3K5) activity-prediction competition, I wanted to connect experimental data with related research records. I collected compound and activity data from ChEMBL, target-association evidence from Open Targets, and trial records from ClinicalTrials.gov.

Building the viewer exposed a difference in scope. Activity data was collected for ASK1, but the clinical-trial search covered **only one compound, Selonsertib**. Displaying a trial count next to every compound could make zero look like “no trials exist” when it actually meant “not investigated.”

I revised the collection and matching rules alongside the interface. My work defined the API collection scope, the separation of source and transformed data, the conditions for confirming matches, and how the viewer explained its numbers. I used Codex for code changes and error analysis, and compared tests with actual collection results.

## What was collected from each source

| Source | Collection scope |
| --- | --- |
| ChEMBL | 1,777 compounds · 2,576 activity records: 2,485 IC50 and 91 Ki |
| Open Targets | 100 ASK1 disease or trait association records |
| ClinicalTrials.gov | 11 trials found using Selonsertib and GS-4997 |

I connected the three APIs with Python and stored the source records in Snowflake so query results could be traced back to their originals and matching evidence. The interface is a local Streamlit viewer using a **snapshot collected September 7–8 and validated and exported September 11**. The project did not extend to operating a live public service.

<figure><img src="{{ '/assets/img/portfolio/ask1-overview.svg' | relative_url }}" alt="The ASK1 activity viewer, with name and synonym search, measurement filters, and a record list" loading="lazy" width="871" height="1145" decoding="async"><figcaption>The snapshot viewer for searching and filtering collected activity records</figcaption></figure>

## Trace transformed values back to their source

I preserved API responses as JSONL and in Snowflake RAW so I could investigate where an unexpected value had changed. Transformation and matching were implemented as views over the source records.

| Layer | Structure and purpose |
| --- | --- |
| RAW | Five tables for targets, activities, compounds, disease associations, and trials; 4,465 records in total |
| STAGING | Six views standardizing names, identifiers, and units |
| MART | Three views for activities, disease associations, and trial matches |
| MONITORING | Run history, change logs, quality checks, and PDF evidence candidates |
| Streamlit | Reviewing query results and matching evidence |

STAGING and MART query RAW through views instead of storing separate copies of transformed data. SQL runs on a Snowflake Warehouse.

<figure><img src="{{ '/assets/img/portfolio/ask1-architecture-en.svg' | relative_url }}" alt="Three public APIs connected to source preservation, transformation and matching views, quality checks, and a snapshot viewer" loading="lazy" width="1200" height="700" decoding="async"><figcaption>Separating source records, transformation rules, and query results for traceability</figcaption></figure>

## Check missing Ki records and repeated loads separately

Initially, IC50 records filled the collection limit, leaving Ki out. Reviewing the code with Codex revealed that the same limit was applied across both measurement types. I separated the limits and pagination, then confirmed **91 Ki records** through regression tests and a new collection run.

I changed loading from row-by-row operations to batches, with RAW changes and change logs recorded together in a transaction for each file. Loading the same data again produced **0 new / 0 changed / 4,465 unchanged records**. Comparisons between local files and the database found zero ID or content-hash mismatches and zero duplicate IDs.

Quality checks distinguished errors from warnings.

| Check | Recorded result |
| --- | --- |
| Seven error-level checks among nine checks | Zero failing records |
| Missing activity values | 12 records |
| Potential-duplicate flags in the source data | 196 records |

The 196 source records flagged as potential duplicates are different from duplicates introduced by reloading. Warning categories may overlap, so their counts were not simply added together.

## Nine name matches and two abbreviations awaiting review

Selonsertib's ChEMBL identifier is **CHEMBL3916717**, with 204 ASK1 activity records in the collected data. I trimmed surrounding whitespace and normalized case in compound names, synonyms, and trial intervention names, then linked exact matches.

Of the 11 collected trials, **nine unique trials** matched. Alias-level matches produced 15 rows. Since one trial can match several names, the viewer distinguishes 15 matching rows from nine trials.

For the remaining trials, NCT03449446 and NCT04026165, the abbreviation **SEL** did not match the existing rules. Codex located the abbreviation definitions in official protocols, and Python checks compared the quotations, PDF pages, document hashes, and sources.

- [NCT03449446 protocol](https://cdn.clinicaltrials.gov/large-docs/46/NCT03449446/Prot_000.pdf): PDF page 23
- [NCT04026165 protocol](https://cdn.clinicaltrials.gov/large-docs/65/NCT04026165/Prot_000.pdf): PDF page 22

Both candidates passed the source-text checks. However, finding an abbreviation in a document was not enough to confirm a final match. I retained them as **EVIDENCE_MATCHED / semantic review PENDING** and excluded them from the final mapping.

<figure><img src="{{ '/assets/img/portfolio/ask1-evidence-en.svg' | relative_url }}" alt="Official PDF evidence for SEL, with page references, semantic review marked PENDING, and no final mapping applied" loading="lazy" width="1200" height="700" decoding="async"><figcaption>Evidence verified against the source remains separate from a semantically confirmed match</figcaption></figure>

## Make the collection scope visible in the interface

To fix the misleading zero trial counts, I **separated ASK1 activity browsing and the Selonsertib matching case into different tabs**. The activity list supports searches by name, synonym, and ID, plus filters for measurement type and minimum record count. Compounds without a preferred name display their ChEMBL ID.

The interface and explanations also state how the figures should be read:

- **9/11** describes matches among the trials collected in this run. It is not accuracy or coverage of all ASK1 trials.
- IC50, Ki, and values from different experimental conditions are not combined into a single drug-potency ranking.
- Open Targets associations are not interpreted as evidence of an individual compound's therapeutic effect.

Predicting drug candidates or the likelihood of clinical development success was outside the scope of this work.

## Confirmed results and decisions left open

**The September 11, 2026 record reports 43 passing offline tests.** They covered collection, transformation, loading, PDF evidence checks, snapshot-overwrite protection, and the viewer's search, filters, and pagination.

I asked AI tools about error causes and alternatives, used their explanations to decide a direction, and continued with code changes and validation. I did not build a separate LLM API agent server.

The deliverables are a pipeline connecting three APIs through source, transformation, and query layers, and a snapshot viewer. **The collected scope, confirmed matches, and evidence still awaiting review are documented together.**
