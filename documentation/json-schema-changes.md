# JSON Schema Changes - Documentation

## Overview

I've updated the JSON configuration files for both insurance products to improve consistency, accessibility, and maintainability. The changes focus on fixing errors, adding helpful user guidance, and preparing the schema for future scalability.

## Key Changes Made

### 1. Fixed Data Quality Issues

**Household JSON - Year of Construction Field**
- **Before**: `"displayText": "Number of bedrooms"`
- **After**: `"displayText": "Year of construction"`
- **Why**: This was a copy-paste error that would have confused users. The label now correctly matches the field.

**Buy to Let JSON - Field Naming Consistency**
- **Before**: `"key": "IsPropertyLetToStudents"`
- **After**: `"key": "isPropertyLetToStudents"`
- **Why**: All other fields use camelCase naming. Consistency makes the code more maintainable and prevents bugs.

### 2. Added Product Metadata

Both files now include a header with:
```json
{
  "productType": "household",
  "version": "1.0.0",
  "lastUpdated": "2024-12-10",
  "questions": [...]
}
```

**Why this matters**:
- We can track which version of questions a policy was created with
- Makes it easier to handle schema changes over time
- Helps with debugging if questions change while users are mid-form
- Clearly identifies which product the config belongs to

### 3. Enhanced User Guidance

Added `helpText` to every field:
- "Select the type of property you wish to insure"
- "Select the number of bedrooms in the property (1-6)"
- "Indicate whether the property is currently let to students"

**Why**: This improves the user experience by providing context and reduces form abandonment. It's also crucial for screen reader users who rely on these descriptions to understand what's being asked.

### 4. Improved Accessibility

Added descriptions to property type options:
```json
{
  "label": "Detached House",
  "value": "DetachedHouse",
  "description": "A standalone property not attached to others"
}
```

Also added `ariaLabel` for screen reader compatibility on complex fields.

**Why**: Not everyone knows the difference between "terraced" and "semi-detached". These descriptions help all users make informed choices and ensure the form is WCAG 2.1 AA compliant.

### 5. Structured Validation Rules

Changed from simple boolean to detailed validation object:
```json
"validation": {
  "required": {
    "value": true,
    "message": "Please select a property type"
  }
}
```

**Why**:
- Custom error messages improve UX over generic "This field is required"
- Makes it easier to add more validation rules later (min/max, patterns)
- Error messages can be updated by non-developers without code changes

### 6. Properly Structured Boolean Fields

The student letting question previously had `"answer": null`. Now it has:
```json
"answer": {
  "type": "Boolean",
  "renderAs": "radio",
  "values": [
    { "label": "Yes", "value": true },
    { "label": "No", "value": false }
  ]
}
```

**Why**:
- Consistent structure across all field types
- Explicit control over how the field renders (radio vs checkbox vs toggle)
- Labels are configurable (could be "True/False" or "Yes/No" without code changes)

## Benefits of These Changes

**For Users**:
- Clearer questions with helpful context
- Better error messages when validation fails
- More accessible for screen reader users

**For Developers**:
- Consistent data structure makes parsing easier
- Validation messages can be changed without code deployment
- Version tracking helps manage schema evolution

**For the Business**:
- Questions can be updated by product teams without developer involvement
- A/B testing different question wording is now possible
- Audit trail of what questions were asked for regulatory compliance

## What Stayed the Same

I kept the core structure intact:
- Question keys remain unchanged (no breaking changes to existing code)
- The `answer` object pattern is preserved
- Field types (`Choice`, `Boolean`) remain the same

This means any existing code will continue to work - these are purely additive improvements.
