# Open Polyglot Content Structure

This directory contains all the language learning content for Open Polyglot. Content is organized in a hierarchical structure based on the CEFR (Common European Framework of Reference for Languages) framework.

## 📁 Directory Structure

```
content/
├── languages/
│   ├── german/
│   │   ├── metadata.json          # Language metadata
│   │   └── a1/
│   │       ├── metadata.json      # Level metadata
│   │       └── intro/
│   │           ├── metadata.json  # Section metadata
│   │           └── lessons/
│   │               ├── 01-welcome/
│   │               │   └── content.json
│   │               ├── 02-action-plan/
│   │               │   └── content.json
│   │               ├── 03-useful-resources/
│   │               │   └── content.json
│   │               └── 04-a1-requirements/
│   │                   └── content.json
│   └── _templates/              # Templates for adding new content (future)
└── tools/                       # Cross-language tools and games (future)
```

## 🌍 Adding a New Language

To add a new language to Open Polyglot:

### 1. Create Language Directory

Create a new directory under `languages/` with the language name in lowercase (e.g., `french`, `spanish`, `japanese`).

### 2. Create Language Metadata

Create a `metadata.json` file in the language directory:

```json
{
  "$schema": "Language Metadata Schema",
  "code": "fr",
  "name": "French",
  "nativeName": "Français",
  "description": "Learn French from scratch...",
  "flagEmoji": "🇫🇷",
  "availableLevels": [
    {
      "id": "a1",
      "name": "A1 - Beginner",
      "enabled": true
    }
  ],
  "themeColors": {
    "primary": "#0055A4",
    "secondary": "#FFFFFF",
    "tertiary": "#EF4135"
  },
  "contributors": ["Open Polyglot Team"],
  "version": "1.0.0",
  "lastUpdated": "2025-01-09"
}
```

### 3. Create First Level

Follow the steps in "Adding a New Level" below.

## 📊 Adding a New Level

To add a new CEFR level (A1, A2, B1, B2, C1, C2) to an existing language:

### 1. Create Level Directory

Create a directory under the language (e.g., `german/a2/`).

### 2. Create Level Metadata

Create a `metadata.json` file:

```json
{
  "$schema": "Level Metadata Schema",
  "id": "a2",
  "name": "A2 - Elementary",
  "cefr": "A2",
  "description": "Build on your foundational knowledge...",
  "estimatedHours": 100,
  "sections": [
    {
      "id": "chapter-01",
      "title": "Daily Routines",
      "description": "Learn to talk about daily activities",
      "order": 0,
      "lessonsCount": 5,
      "enabled": true
    }
  ],
  "objectives": [
    "Understand phrases related to personal relevance",
    "Communicate in simple routine tasks",
    "Describe your background and environment"
  ],
  "version": "1.0.0",
  "lastUpdated": "2025-01-09"
}
```

### 3. Create Sections

Follow the steps in "Adding a New Section" below.

## 📚 Adding a New Section

Sections are thematic groupings of lessons (e.g., "Introduction", "Greetings", "Food & Dining").

### 1. Create Section Directory

Create a directory under the level (e.g., `a1/chapter-01-greetings/`).

### 2. Create Section Metadata

Create a `metadata.json` file:

```json
{
  "$schema": "Section Metadata Schema",
  "id": "chapter-01-greetings",
  "title": "Greetings & Introductions",
  "description": "Learn essential greetings and how to introduce yourself",
  "order": 1,
  "lessons": [
    {
      "id": "01-basic-greetings",
      "title": "Basic Greetings",
      "description": "Hello, goodbye, and common greetings",
      "order": 1,
      "type": "vocabulary",
      "estimatedMinutes": 15,
      "hasQuiz": true,
      "hasExercises": true
    }
  ],
  "version": "1.0.0",
  "lastUpdated": "2025-01-09"
}
```

### 3. Create Lessons

Follow the steps in "Adding a New Lesson" below.

## 📝 Adding a New Lesson

### 1. Create Lesson Directory

Create a directory under the section's `lessons/` folder (e.g., `lessons/01-basic-greetings/`).

### 2. Create Lesson Content

Create a `content.json` file:

```json
{
  "$schema": "Lesson Content Schema",
  "id": "01-basic-greetings",
  "title": "Basic Greetings",
  "type": "vocabulary",
  "sections": [
    {
      "type": "text",
      "content": "# Basic Greetings\n\nIn this lesson, you'll learn...\n\n## Vocabulary\n\n- **Hallo** - Hello\n- **Tschüss** - Bye"
    }
  ],
  "metadata": {
    "lessonNumber": 1,
    "sectionId": "chapter-01-greetings",
    "levelId": "a1",
    "languageCode": "de",
    "version": "1.0.0",
    "lastUpdated": "2025-01-09"
  }
}
```

### 3. Optional: Add Quiz

Create a `quiz.json` file:

```json
{
  "$schema": "Quiz Schema",
  "lessonId": "01-basic-greetings",
  "questions": [
    {
      "id": "q1",
      "type": "multiple-choice",
      "question": "What does 'Hallo' mean?",
      "options": [
        { "id": "a", "text": "Hello" },
        { "id": "b", "text": "Goodbye" },
        { "id": "c", "text": "Thank you" }
      ],
      "correctAnswer": "a",
      "explanation": "'Hallo' is the German word for 'Hello'.",
      "points": 10
    }
  ],
  "passingScore": 70,
  "version": "1.0.0"
}
```

### 4. Optional: Add Exercises

Create an `exercises.json` file:

```json
{
  "$schema": "Exercises Schema",
  "lessonId": "01-basic-greetings",
  "exercises": [
    {
      "id": "ex1",
      "type": "fill-in-blank",
      "instructions": "Fill in the blanks with the correct greeting",
      "items": [
        {
          "id": "1",
          "instruction": "Complete the sentence",
          "prompt": "_____, wie geht es dir? (Hello, how are you?)",
          "answer": "Hallo",
          "hint": "Starts with 'H'"
        }
      ]
    }
  ],
  "version": "1.0.0"
}
```

## 📋 Content Types

### Lesson Types

- **informational** - General information, guides, explanations
- **vocabulary** - Focused on learning new words and phrases
- **grammar** - Grammar rules and structures
- **dialogue** - Conversational practice
- **practice** - Mixed practice exercises
- **quiz** - Assessment and testing

### Section Types in Content

- **text** - Regular markdown content (default)
- **vocabulary** - Vocabulary lists (displays with blue accent)
- **grammar** - Grammar explanations (displays with purple accent)
- **dialogue** - Conversations (displays with green accent)
- **audio** - Audio content with player
- **video** - Video content with embed

## 🎨 Markdown Formatting

Lesson content supports full Markdown formatting:

```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*

- Bullet list item
- Another item

1. Numbered list
2. Second item

[Link text](https://example.com)

> Blockquote for important notes

---

Horizontal rule for separating sections
```

## ✅ Content Guidelines

### Quality Standards

1. **Clarity**: Write in clear, simple language
2. **Structure**: Use headings and lists for easy scanning
3. **Examples**: Include plenty of examples
4. **Progression**: Build on previous lessons
5. **Engagement**: Use emojis and formatting to make content engaging

### Accessibility

1. Provide text alternatives for audio/video
2. Use clear, descriptive headings
3. Ensure color is not the only way to convey information
4. Keep sentences and paragraphs reasonably short

### Best Practices

1. **Estimated Time**: Be realistic about lesson duration
2. **Objectives**: Clearly state what learners will achieve
3. **Review**: Include review of previous concepts
4. **Practice**: Provide exercises and quizzes when appropriate
5. **Resources**: Link to external resources for deeper learning

## 🔄 Updating Content

When updating existing content:

1. Update the `lastUpdated` field in metadata
2. Increment the `version` if making significant changes
3. Document changes in a changelog (if major update)
4. Test all links and ensure JSON is valid

## 🧪 Testing Content

Before committing new content:

1. **Validate JSON**: Ensure all JSON files are valid
   ```bash
   # You can use a JSON validator or your code editor
   ```

2. **Check Links**: Verify all external links work

3. **Preview**: View the content in the app to ensure proper rendering

4. **Spell Check**: Run spell check on all text content

## 📚 Resources

- [CEFR Guidelines](https://www.coe.int/en/web/common-european-framework-reference-languages)
- [Markdown Guide](https://www.markdownguide.org/)
- [JSON Schema Validator](https://www.jsonschemavalidator.net/)

## 🤝 Contributing

We welcome contributions! To contribute content:

1. Fork the repository
2. Create content following the structure above
3. Validate all JSON and test the content
4. Submit a pull request with a clear description

## 📄 License

All content in this directory is part of Open Polyglot and is licensed under [MIT License](../../LICENSE).

---

**Happy Teaching! 🦉**

For questions or suggestions, please open an issue on GitHub.
