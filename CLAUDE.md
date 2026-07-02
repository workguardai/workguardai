# CLAUDE.md

# WorkGuard AI — Engineering Blueprint

## Project Overview

You are building **WorkGuard AI**, an AI-powered construction & infrastructure monitoring platform.

The product ingests engineering drawings (DWG/CAD files), mathematically interprets them, builds a digital representation of the site, continuously compares expected construction progress with actual progress, generates milestones, predicts delays, and displays everything inside a modern dashboard.

This is an **AI-first SaaS product**, not a CRUD application.

Think like an engineer building a production startup, not a hackathon demo.

---

# IMPORTANT DEVELOPMENT RULES

## Before Writing Any UI

STOP.

After the backend, database, AI pipeline, authentication, APIs and business logic are completed:

Ask me.

Do NOT generate any frontend until I approve.

The workflow is:

1. Database
2. Prisma Models
3. Auth
4. Backend APIs
5. AI pipeline
6. File Upload
7. Dashboard generation logic
8. Notifications
9. RBAC
10. Testing
11. API validation
12. Security
13. Performance

ONLY THEN

Ask:

> Backend is complete.
> Shall I begin building the frontend?

Do not continue until I explicitly approve.

---

# Engineering Philosophy

Always follow:

- Karpathy Engineering Guidelines
- Karpathy Simplicity Principle
- Superpower Coding Skill
- Write code like an experienced Staff Engineer.
- Never over-engineer.
- Never generate placeholder logic if real logic can be built.
- Keep every module isolated.
- Follow Clean Architecture.
- Prefer composition over inheritance.
- Build highly reusable modules.
- Every function should have one responsibility.
- Every API should be independently testable.
- Every folder should be scalable.

---

# Tech Stack

Everything lives inside one Next.js application.

NO separate backend.

## Framework

Latest Next.js (App Router)

WITHOUT src folder.

Use:

```
app/
```

instead of

```
src/app
```

---

## Backend

Use

Next.js Route Handlers

inside

```
app/api
```

Never create Express.

Never create NestJS.

Never create Fastify.

---

## Authentication

Supabase Auth

Requirements

- Email Login
- Google Login
- JWT Authentication
- Secure Cookies
- Middleware protection
- Refresh Token handling
- Session validation

User roles

- Admin
- Manager
- Viewer
- Pilot User

Use Supabase Auth correctly.

---

## Database

PostgreSQL

ORM

Prisma

Never use Drizzle.

---

## State Management

Redux Toolkit

Do NOT use Zustand.

---

## HTTP

Use native fetch.

Never use axios.

---

## Validation

Zod

Every API request

Every API response

Every environment variable

Every AI response

must be validated with Zod.

---

## Styling

Later.

No UI until approved.

---

# Folder Structure

```
app
    api
    dashboard
    login
    onboarding

components

features

store

hooks

services

lib

prisma

types

schemas

utils

middleware.ts

```

Keep everything modular.

---

# Environment Variables

Use Zod validation.

Create

```
lib/env.ts
```

Validate

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

DATABASE_URL

JWT_SECRET

GEMINI_API_KEY

UPLOAD_BUCKET

etc.

Application should fail fast if env is invalid.

---

# AI Architecture

This project is AI-first.

Never scatter AI code.

Everything AI-related belongs inside

```
lib/ai
```

Structure

```
lib/ai

    LLM.ts

    prompts/

        systemPrompt.ts

    parsers/

    evaluators/

    generators/

    validators/

    schemas/

```

---

# LLM.ts

Create a reusable Gemini wrapper.

Responsibilities

- model selection
- retries
- exponential backoff
- temperature
- JSON enforcement
- response validation
- logging
- cost tracking hooks
- token tracking hooks

The wrapper accepts

System Prompt

User Prompt

Structured Output Schema

Returns validated JSON.

Never return raw strings.

---

# Gemini Setup

Use latest Google Gemini SDK.

System Prompt is permanent.

Uploaded DWG information becomes the User Prompt.

Pipeline

System Prompt

↓

User Prompt

↓

Gemini

↓

Structured JSON

↓

Validate with Zod

↓

Persist in Database

↓

Dashboard

---

# AI Responsibilities

Whenever a drawing is uploaded, AI MUST produce structured information that satisfies the following business requirements.

The AI should:

---

## 1. Parse Engineering Plans

Mathematically understand:

- floor layout

- walls

- roads

- utilities

- construction zones

- sections

- dimensions

- expected milestones

- dependencies

Generate a normalized digital representation.

---

## 2. Build Site Representation

Generate

Digital Site Graph

Example

Zones

Edges

Milestones

Dependencies

Risk Areas

Expected Progress

Critical Paths

Everything should become structured JSON.

---

## 3. Compare Planned vs Actual

Given

Original Plan

+

Current Progress

Determine

Expected completion %

Actual completion %

Missing work

Unexpected work

Blocked work

Risk score

Confidence

Predicted completion

---

## 4. Generate Smart Alerts

Examples

Milestone reached

Delay predicted

Unexpected deviation

Critical dependency blocked

High-risk area

Schedule slippage

Cost impact estimation

Priority

Suggested action

Every alert should contain

Severity

Category

Reason

Confidence

Recommendation

---

# AI Output Schema

Gemini must NEVER return free text.

Always produce structured JSON.

Example sections

```
{
  project,

  parsedSite,

  milestones,

  currentProgress,

  deviations,

  alerts,

  completionPrediction,

  risks,

  recommendations,

  dashboard
}
```

Everything validated using Zod.

---

# AI System Prompt

Create

```
lib/ai/prompts/systemPrompt.ts
```

The prompt should instruct Gemini to behave as:

- Senior Civil Engineer
- Construction Project Manager
- CAD Analyst
- Infrastructure Monitoring AI
- Delay Prediction Expert

The AI should:

- Parse engineering plans mathematically
- Build graph representation
- Detect milestones
- Detect dependencies
- Estimate progress
- Predict delays
- Identify construction risks
- Produce deterministic JSON
- Never hallucinate measurements
- Explicitly mark uncertainty where data is insufficient
- Never fabricate milestones not implied by the supplied data
- Prefer conservative estimates over optimistic guesses
- Return ONLY valid JSON matching the provided schema

The prompt should emphasize:
- Deterministic, schema-compliant output
- No prose outside JSON
- Confidence scores for all inferred values
- Separate observed facts from inferred conclusions

---

# Upload Flow

User uploads

DWG

↓

Store

↓

Extract metadata

↓

AI evaluation

↓

JSON

↓

Database

↓

Dashboard data

---

# File Processing

Design the pipeline so different parsers can later be plugged in.

Initial support

DWG

Future

DXF

PDF

BIM

IFC

Images

Satellite

Drone scans

IoT feeds

---

# Database Models

Design scalable Prisma models including (at minimum):

User

Organization

Project

ProjectMember

Site

Drawing

DrawingVersion

ParsedDrawing

Milestone

ProgressSnapshot

Deviation

Alert

DashboardSnapshot

ActivityLog

Notification

AIEvaluation

AuditLog

Subscription

Usage

APIKey (future)

Keep schemas normalized with appropriate relations, indexes, timestamps, soft deletes where appropriate, and optimistic concurrency where beneficial.

---

# Pricing Logic

Free

Pilot

Pro

Enterprise

Only Pilot tier should be available publicly.

---

# Pilot Experience

The free tier is intentionally limited.

The goal is NOT to give away the product.

The goal is to convince the customer to upgrade.

Implement rules such as:

- Maximum one organization
- Maximum one project
- Maximum one site
- One uploaded drawing
- Limited dashboard history
- Limited AI evaluations
- Limited alerts
- Read-only preview of premium analytics
- Watermarked insights where appropriate
- Locked premium cards with upgrade CTA
- Sample/demo data blended with the user's own processed output to showcase potential value (clearly labeled as preview/demo)
- No exports
- No integrations
- No team collaboration
- No historical comparisons beyond a short window

The dashboard should provide a compelling glimpse of the platform's capabilities without exposing full functionality.

---

# Security

Implement

JWT

RBAC

Input validation

Output validation

Rate limiting

File validation

Audit logs

SQL injection protection

XSS protection

CSRF considerations where applicable

Secure headers

Secure uploads

Never trust client data.

---

# API Standards

Every endpoint

Request Schema

↓

Validation

↓

Business Logic

↓

Response Schema

↓

Validation

↓

Return

No endpoint should return unvalidated objects.

---

# Notifications

Backend only.

Support

Delay alerts

Milestones

Warnings

Critical risks

Store notifications.

Realtime support should be abstracted for future implementation.

---

# Architecture

Use feature-driven modules where appropriate.

Separate

Repository

Service

AI

API

Validation

Database

Types

Avoid circular dependencies.

---

# Logging

Structured logging.

No console.log in production paths.

Include correlation/request IDs where possible.

---

# Error Handling

Typed errors.

Centralized error responses.

Never leak stack traces.

---

# Performance

Streaming uploads where applicable

Server Actions only where they make architectural sense

Lazy processing

Background processing abstraction for long-running AI jobs

Caching abstraction

Database indexes

Pagination

Optimized Prisma queries

---

# Testing

Create

Unit Tests

Integration Tests

API Tests

Schema Tests

AI Output Validation Tests

Repository Tests

Service Tests

---

# Code Quality

Strict TypeScript

ESLint

Prettier

No any

No dead code

No duplicated logic

No magic strings

No magic numbers

Use constants and enums where appropriate.

---

# Documentation

Every major module should contain concise documentation describing:
- Responsibility
- Inputs
- Outputs
- Extension points
- Assumptions

Document AI contracts and JSON schemas clearly.

---

# Development Order (MANDATORY)

Follow this exact sequence:

1. Initialize Next.js project (App Router, no `src`)
2. Configure TypeScript, ESLint, Prettier
3. Configure environment validation
4. Configure PostgreSQL
5. Configure Prisma
6. Design database schema
7. Run migrations
8. Configure Supabase Auth
9. Implement authentication and RBAC
10. Configure middleware
11. Build repositories
12. Build services
13. Build API routes
14. Implement file upload pipeline
15. Build AI infrastructure (`lib/ai`)
16. Implement Gemini integration (`LLM.ts`)
17. Create system prompt and schemas
18. Implement DWG processing abstraction
19. Generate dashboard data pipeline
20. Implement alerts
21. Implement subscriptions and usage limits
22. Implement audit logging
23. Implement tests
24. Validate all APIs
25. Review backend architecture
26. STOP
27. Ask the user:

> The backend foundation is complete, including database, authentication, APIs, AI pipeline, subscription logic, and business rules. Would you like me to start building the frontend now?

Wait for explicit approval before generating any UI, components, layouts, pages, styling, Redux UI slices, or client-side dashboard implementation.