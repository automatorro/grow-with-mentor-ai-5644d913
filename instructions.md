
# Assessment System Overhaul Instructions

## Overview
Replace the current single open-ended assessment question with a dynamic, form-based system driven by a dropdown menu. This system will accommodate a large and growing library of skill assessments.

## Database Changes Required

### 1. Create Skills Table
- Table name: `skills`
- Fields:
  - `id` (primary key)
  - `skill_name` (text)

### 2. Create Questionnaires Table
- Table name: `questionnaires`
- Fields:
  - `id` (primary key)
  - `skill_id` (foreign key linked to skills table)
  - `framework_name` (text)
  - `description` (text)

### 3. Create Questions Table
- Table name: `questions`
- Fields:
  - `id` (primary key)
  - `questionnaire_id` (foreign key linked to questionnaires table)
  - `question_text` (text)
  - `question_order` (number)

### 4. Create Question Options Table
- Table name: `question_options`
- Fields:
  - `id` (primary key)
  - `question_id` (foreign key linked to questions table)
  - `option_letter` (text, e.g., 'A', 'B')
  - `option_text` (text)

## Admin Interface Requirements

### 5. Create Data Entry Interface
- Simple admin interface for adding and editing records
- Must support all four tables: skills, questionnaires, questions, question_options
- Allow CRUD operations on all tables

### 6. Populate Initial Data
Using the data entry interface, populate tables with example questionnaires:
- Conflict Resolution
- Emotional Intelligence
- Leadership Style

## Frontend Changes Required

### 7. Update Assessment Page (/assessment)
- Remove existing static question and text input box
- Add dropdown menu labeled "Choose a skill to assess:"
- Dropdown dynamically populated with skill_name values from skills table
- Create dynamic form area below dropdown
- When skill selected, fetch and display all question_text and associated question_options as multiple-choice form

### 8. Modify Submit Button Action
- Collect selected skill_id
- Collect framework_name
- Collect all user's selected answers (e.g., Question 1: 'B', Question 2: 'A')
- Combine into single JSON object

## Backend Changes Required

### 9. Update process-assessment Edge Function
- Accept new JSON object payload instead of single text field
- Replace old Gemini API prompt with new structure

### 10. New Prompt Structure
```
System: You are an expert career coach and soft skills analyst. The user has just completed a questionnaire based on a recognized psychological framework.

Framework Used: "{{framework}}"
Skill Assessed: "{{assessed_skill}}"
User's Answers:
{{responses_json}}

Instructions:
1. Analyze the user's pattern of answers in the context of the provided framework.
2. Determine their dominant style or tendency.
3. Based on this style, identify key strengths and potential blind spots or areas for development.
4. Provide a short, actionable `overall_summary`.
5. Return your entire analysis in the standard JSON format we use.
```

## Implementation Order
1. Create database tables (SQL migrations)
2. Create admin interface for data entry
3. Populate initial data
4. Update assessment page frontend
5. Update edge function
6. Test complete flow

## Key Success Criteria
- Dynamic skill selection works
- Multiple choice questions display correctly
- Form submission collects all data properly
- AI analysis uses new prompt structure
- Results display correctly
- Admin interface allows easy data management
