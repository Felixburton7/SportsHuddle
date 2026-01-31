# SportsHuddle.ai - Documentation Fixes Summary
**Date:** January 31, 2026  
**Status:** IN PROGRESS

---

## ✅ FIXES COMPLETED SO FAR

### 1. ✅ **Branding Updated to SportsHuddle.ai**
- **Location:** Technical_spec.md  
- **Change:** Title updated from "SportsHuddle Technical Specification" to "SportsHuddle.ai Technical Specification"
- **Version:** Updated to v1.1

### 2. ✅ **raw_metrics Schema - Made Non-MVP Fields DEFAULT NULL**
- **Location:** Technical_spec.md lines 170-300
- **Change:** 
  - Added clear comments distinguishing MVP REQUIRED (23 fields) vs OPTIONAL/FUTURE fields
  - Made all MVP fields `NOT NULL` with descriptive constraints
  - Made all non-MVP fields `DEFAULT NULL`
  - Added CHECK constraints for validation (e.g., possession_pct 0-100, games_played 1-38)
- **Impact:** Prevents crashes when admin only enters MVP fields

### 3. ✅ **derived_metrics Table - Clarified All 39 Metrics Are Shown**
- **Location:** Technical_spec.md lines 293-370
- **Change:**
  - Added comprehensive comment explaining ALL 39 metrics are calculated and displayed
  - Clarified 10 "CORE" metrics are prominently displayed (not exclusively shown)
  - Listed which 4 metrics are deferred to Phase 2 (rotation_fragility, ball_recovery_time, game_state_xg_bias, bench_impact_gda)
  - Added DEFAULT NULL to deferred metrics
- **Impact:** Removes confusion about MVP showing only 10 vs all 39 metrics

### 4. ✅ **Trigger Function - Added NULL Safety with COALESCE**
- **Location:** Technical_spec.md lines 440-730 + UPDATED_TRIGGER_FUNCTION.sql
- **Changes:**
  - Added COALESCE() to ALL optional field references
  - Added exception handling (BEGIN...EXCEPTION...END) to prevent trigger crashes
  - Changed division-by-zero errors to return NULL instead of 0 where appropriate
  - Used NULLIF() for safe division
  - Added comprehensive comments
- **Impact:** Trigger won't crash if optional fields are NULL; gracefully handles missing data

---

## ⏳ REMAINING FIXES NEEDED

### 5. ⏳ **Update MVP Metrics Section Throughout Docs**
- **Location:** Multiple files
- **TODO:**
  - architecture_implementation_plan.md lines 211-226: Update "10 Core Metrics" section to clarify all 39 shown
  - Technical_spec.md: Add section on how dashboard differentiates core vs extended metrics
  - README.md: Clarify the 39 metrics table

### 6. ⏳ **Frontend: Handle NULL Metrics in Dashboard**
- **Location:** Technical_spec.md - MetricCard component (lines 1032-1111)
- **TODO:**
  - Add NULL check to MetricCard component
  - If metric value is NULL, either:
    - Don't render the card at all, OR
    - Show "N/A" or "Coming Soon" placeholder
- **Code Example Needed:**
```typescript
// In MetricCard component
if (value === null || value === undefined) {
  return null; // Don't show the card
  // OR
  // return <div>Coming in Phase 2</div>;
}
```

### 7. ⏳ **PDF Generation - Add Size Validation**
- **Location:** Technical_spec.md lines 1654-1683 (newsletter send function)
- **TODO:**
  - Add PDF size check before base64 encoding
  - If PDF > 10MB, send link instead of attachment
  - Add warning/error handling
- **Code Example Needed:**
```typescript
const pdfBuffer = await pdfResponse.arrayBuffer();
if (pdfBuffer.byteLength > 10 * 1024 * 1024) {  // 10MB limit
  // Send email with link instead of attachment
} else {
  const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
  // ... attach to email
}
```

### 8. ⏳ **Newsletter Send - Add Rate Limiting/Batching**
- **Location:** Technical_spec.md lines 1663-1698
- **TODO:**
  - Replace Promise.allSettled() with batched sends
  - Add 1-second delay between batches
  - Process in groups of 50 subscribers
- **Code Example Needed:**
```typescript
// Send in batches of 50
for (let i = 0; i < subscribers.length; i += 50) {
  const batch = subscribers.slice(i, i + 50);
  await Promise.allSettled(batch.map(send...));
  if (i + 50 < subscribers.length) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1s delay
  }
}
```

### 9. ⏳ **Admin Guide - Document UPDATE Syntax for Data Corrections**
- **Location:** admin.md - data entry section
- **TODO:**
  - Add section explaining how to UPDATE existing data (since UNIQUE constraint prevents duplicate INSERT)
  - Provide UPDATE syntax example
- **Code Example Needed:**
```sql
-- Method 4: Update existing data if you made a mistake
UPDATE raw_metrics 
SET 
    goals_for = 46,
    xg = 43.1,
    -- ... other fields
WHERE team_id = (SELECT id FROM teams WHERE short_name = 'ARS')
  AND matchweek_id = 'paste-matchweek-uuid-here';
```

### 10. ⏳ **Branding: Update All References to SportsHuddle**
- **Location:** All 4 files
- **TODO:**
  - admin.md: Line 1 - update title
  - architecture_implementation_plan.md: Line 1 - update title
  - README.md: Line 1 - update title  
  - Technical_spec.md: Already done ✅
  - Search/replace all instances of just "SportsHuddle" with "SportsHuddle.ai" where appropriate

###11. ⏳ **Opponent Data - Clarify Collection Strategy**
- **Location:** admin.md lines 388-397, Technical_spec.md data requirements
- **TODO:**
  - Clarify that `opponent_att_3rd_touches` can use league average for MVP
  - Provide calculation example or default value
  - Update trigger to handle 0 or NULL gracefully (DONE ✅ in trigger fix)

### 12. ⏳ **Email Log - Add Recovery Query Examples**
- **Location:** admin.md - Open Questions section
- **TODO:**
  - Add section on "Recovering from Failed Newsletter Sends"
  - Provide SQL queries to:
    - Find failed emails for a matchweek
    - Resend to failed recipients only
- **Code Example Needed:**
```sql
-- Find failed sends for a matchweek
SELECT s.email, el.error_message
FROM email_log el
JOIN subscribers s ON el.subscriber_id = s.id
WHERE el.matchweek_id = 'uuid-here'
  AND el.status = 'failed';

-- Get list of subscribers who didn't receive email
SELECT s.id, s.email
FROM subscribers s
WHERE s.confirmed = true 
  AND s.unsubscribed_at IS NULL
  AND s.id NOT IN (
    SELECT subscriber_id FROM email_log 
    WHERE matchweek_id = 'uuid-here' AND status = 'sent'
  );
```

### 13. ⏳ **Type Validation - Add Zod Schemas to API Routes**
- **Location:** Technical_spec.md - all API route implementations
- **TODO:**
  - Add Zod validation to:
    - `/api/admin/generate-pdf` (validate matchweekId is UUID)
    - `/api/admin/send-newsletter` (validate matchweekId + highlights array)
  - Example already exists in `/api/subscribe` ✅
- **Code Example Needed:**
```typescript
const generatePdfSchema = z.object({
  matchweekId: z.string().uuid('Invalid matchweek ID'),
});

const sendNewsletterSchema = z.object({
  matchweekId: z.string().uuid('Invalid matchweek ID'),
  highlights: z.array(z.string()).max(5, 'Max 5 highlights'),
});
```

---

## 📊 PROGRESS TRACKER

| Fix # | Issue | Status | Priority |
|-------|-------|--------|----------|
| 1 | Branding to SportsHuddle.ai | ✅ DONE | High |
| 2 | raw_metrics DEFAULT NULL | ✅ DONE | Critical |
| 3 | Clarify 39 metrics shown | ✅ DONE | High |
| 4 | Trigger NULL safety | ✅ DONE | Critical |
| 5 | Update MVP sections | ⏳ TODO | Medium |
| 6 | Frontend NULL handling | ⏳ TODO | High |
| 7 | PDF size validation | ⏳ TODO | Medium |
| 8 | Rate limiting newsletters | ⏳ TODO | High |
| 9 | Document UPDATE syntax | ⏳ TODO | Medium |
| 10 | Complete branding updates | ⏳ TODO | Low |
| 11 | Opponent data clarity | ⏳ TODO | Medium |
| 12 | Email recovery queries | ⏳ TODO | Low |
| 13 | Zod validation | ⏳ TODO | Medium |

**Completed:** 4/13 (31%)  
**Remaining:** 9/13 (69%)

---

## 🎯 NEXT STEPS

1. ✅ Update remaining branding (README.md, admin.md, architecture_implementation_plan.md)
2. ✅ Add frontend NULL handling for deferred metrics
3. ✅ Add PDF size validation
4. ✅ Add newsletter rate limiting
5. ✅ Document UPDATE syntax in admin.md
6. ✅ Add email recovery SQL examples
7. ✅ Add Zod validation to admin API routes

---

## 📝 NOTES

- All database schema changes are backward-compatible
- Trigger function uses exception handling so it won't break existing data
- Frontend changes needed to gracefully handle NULL metrics
- PDF/Email improvements are optimization, not blocking issues

