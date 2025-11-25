# Project Overview

## What is HealthPal?
HealthPal is a digital healthcare platform designed to provide Palestinians with access to:
- Remote medical consultations
- Medicine and equipment coordination
- Donation-funded treatments
- Mental health support
- Public health alerts

It connects **patients**, **doctors**, **donors**, **NGOs**, and **admins** in a unified system to overcome healthcare inaccessibility due to conflict and infrastructure collapse.

## Why Node.js + Express?
We chose **Node.js with Express.js** for the following reasons:

| Factor | Justification |
|-------|---------------|
| **Scalability** | Non-blocking I/O handles many concurrent users (e.g., patients booking consultations during emergencies). |
| **Development Speed** | JavaScript full-stack reduces context switching; rapid prototyping with npm ecosystem. |
| **Low-Bandwidth Optimization** | Lightweight responses and streaming support ideal for Gaza/West Bank connectivity. |
| **Maintainability** | Modular structure (routes, controllers, services) easy for team collaboration. |
| **Community & Tooling** | Rich support for REST, Swagger, Sequelize, JWT, and testing (Jest/Supertest). |

## Why MySQL?
- **Mandatory** per project requirements
- ACID compliance for financial (donations) and medical data integrity
- Mature, widely supported, and cloud-ready (AWS RDS, etc.)