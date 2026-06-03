---
title: SIM-REMUNERASI-RS
emoji: 🏥
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
license: openrail
---

# SIM-REMUNERASI-RS

Hospital Staff Remuneration Management System for RSUD (Rumah Sakit Umum Daerah).

## Tech Stack
- React 19 + TypeScript
- Vite build tool
- Tailwind CSS
- LocalStorage for data persistence
- Lucide React icons

## Features
- Dashboard with remuneration overview & statistics
- Employee management (NIP, position, unit, status)
- Unit & position management with grade-based point system
- Attendance tracking
- KPI performance evaluation with weighted scoring
- Automated remuneration calculation
- Multi-level approval workflow
- Reporting & export (PDF, Excel)
- Login & Role-Based Access Control (RBAC)

## Default Users

| Username | Password | Role |
|---|---|---|
| admin | admin123 | Direktur/Admin |
| hrd | hrd123 | HRD |
| finance | finance123 | Keuangan |
| kepala | kepala123 | Kepala Unit |
| staf | staf123 | Staf |

## Local Development
```bash
npm install
npm run dev
```