---
layout: case-study
lang: en
locale: en_US
project_slug: seoul-cafe
permalink: /en/projects/seoul-cafe/
translation_url: /projects/seoul-cafe/
title: Seoul Café Market and Location Analysis
eyebrow: Market data analysis / 2024
description: I examined whether shop counts alone could explain an area's café market. After aligning the geographic units in café registration and foot-traffic data, I compared supply, demand, openings, and closures in Power BI.
cover: /assets/img/portfolio/cafe-screen.png
cover_alt: The original Power BI dashboard for Seoul café market and location analysis
tags: [Power BI, Power Query, DAX, Market analysis]
facts:
  - {label: Geographic scope, value: '25 Seoul districts · 424 administrative neighborhoods'}
  - {label: Data, value: '45,035 café registration records · About 184K population records'}
  - {label: My role, value: 'Area-code alignment, metric design, dashboard development'}
---

## Can café counts alone tell us about a location?

An area with many cafés may have strong demand or intense competition. I compared local differences by bringing Seoul's café registration records together with foot traffic and closure patterns.

The central question was: **where is café supply high or low relative to the number of people in the area?** I aligned geographic codes across the sources, designed comparison metrics, and connected them in a Power BI dashboard.

## Area codes before charts

The sources used different area labels and definitions, which made it difficult to join values for the same location. I built a master table mapping administrative neighborhood codes and used it to connect the café and population datasets. In Power Query, I handled missing values and formatting, then aggregated the data to the same neighborhood units.

The analysis used **45,035 café registration records**, approximately **184K population records**, neighborhood areas and administrative boundaries, and brand classifications.

## Separate historical registrations from current supply

Of the 45,035 collected café registration records, **30,224, or about 67%, were marked closed**. This is the share of collected registration records with closed status. It is not a particular year's closure rate or the probability that a currently operating café will close.

To describe current supply, I needed to distinguish cumulative registrations from shops still operating. I built these metrics in DAX:

| Comparison question | Metric |
| --- | --- |
| How have openings and closures accumulated? | Cumulative openings and closures |
| How much supply is currently available? | Currently operating shops |
| How much recent market exit has occurred? | Year-to-date closure rate |
| Which brands account for the competition? | Brand market share |
| How many cafés are there relative to the population present? | Café count relative to the local population |

These definitions keep historical totals, current status, and recent changes from being treated as the same measure.

## View foot traffic alongside café supply

I compared the population in their 20s through 40s with café counts by administrative neighborhood. The dashboard lets viewers distinguish areas with relatively low supply for their population, high café density, or concentrated brand competition, alongside opening and closure trends.

The result is a Power BI dashboard covering market size, competition, population, brand share, and openings and closures across 25 districts and 424 administrative neighborhoods in Seoul. It compares areas; it does not predict individual shops' revenue or profitability.

## What had to be resolved first

Much of the work went into aligning geographic definitions and aggregation rules before creating charts. Only after those rules were consistent could shop counts, population, and closure records be compared in the same view.

I arranged the dashboard to move from market size to competition and supply relative to demand. Alongside adding metrics, I clarified **what each number counts and which question it answers**.
