This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Poppins](https://fonts.google.com/specimen/Poppins), a modern and clean font family.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Management System

This project includes a comprehensive management system for complex module implementation and error handling.

### File Management System

#### File Management Log
- **Path**: `./control_scripts/FileManagements.txt`
- **Purpose**: Tracks all file operations performed by Cursor AI
- **Usage**: Logs file creation, modification, and deletion operations with timestamps and reasons
- **Format**: Structured log entries with operation type, file path, reason, and status

#### Complex Module Implementation
- **Path**: `./control_scripts/implement_prepare/`
- **Purpose**: Manages complex module implementation workflow
- **Files**:
  - `checklist_Purpose.md`: Implementation plans (replaced for each new module)
  - `checklist_Guide.md`: Implementation progress tracking (replaced for each implementation)

#### Error Handling System
- **Path**: `./control_scripts/issue_handle/`
- **Purpose**: Manages error handling and issue resolution
- **Files**:
  - `issue_Template.md`: Issue templates and solutions (append new templates)
  - `issue_List.md`: Current issue tracking (replace content for each new issue)
  - `issue_Lesson.md`: Resolution documentation (replace content for each resolution)

### Cursor Rules

#### Complex Module Implementation Rules
- **File**: `.cursor/rules/complex-module-implementation.mdc`
- **Purpose**: Defines workflow for complex module implementation
- **Features**: Prevents immediate coding, requires planning phase, mandates user approval

#### Checklist Management Rules
- **File**: `.cursor/rules/checklist-management.mdc`
- **Purpose**: Manages checklist file system and content updates
- **Features**: File replacement rules, progress tracking, template management

#### Error Handling Workflow Rules
- **File**: `.cursor/rules/error-handling-workflow.mdc`
- **Purpose**: Defines complete error handling process
- **Features**: Pre-code template checking, systematic issue logging, template creation

#### Template Management Rules
- **File**: `.cursor/rules/template-management.mdc`
- **Purpose**: Manages template system and content updates
- **Features**: Template creation guidelines, file update rules, quality standards

#### File Handling Rules
- **File**: `.cursor/rules/file-handling.mdc`
- **Purpose**: Enforces file handling practices and documentation
- **Features**: README documentation requirements, file operation rules, management logging

#### Staging Diff Operations Rules
- **File**: `.cursor/rules/staging-diff-operations.mdc`
- **Purpose**: Mandates staging diff for all file operations
- **Features**: Sequential file processing, user confirmation for deletions, automatic application

### Usage Guidelines

1. **Complex Module Implementation**: Use the checklist system for multi-step implementations
2. **Error Handling**: Check templates before coding, log issues systematically
3. **File Operations**: Always use staging diff, log all operations, update README
4. **File Deletion**: Always ask for user confirmation before deleting files
5. **Documentation**: All new files must be documented in README

## Application Components

### Server Actions

#### Deck Actions
- **Path**: `src/app/actions/deck-actions.ts`
- **Purpose**: Server actions for deck management operations
- **Features**: 
  - Update deck title and description with Zod validation
  - Delete deck with user ownership verification
  - Proper error handling and authentication
- **Usage**: Called from client components for deck modifications
- **Dependencies**: Uses `@/db/queries/deck-queries` for database operations

#### Card Actions
- **Path**: `src/app/actions/card-actions.ts`
- **Purpose**: Server actions for flashcard management operations
- **Features**:
  - Create new cards with Zod validation
  - Update existing cards with user ownership verification
  - Delete cards with user ownership verification
  - Proper error handling and authentication
  - Form validation for front/back text and difficulty levels
- **Usage**: Called from client components for card modifications
- **Dependencies**: Uses `@/db/queries/card-queries` for database operations

### UI Components

#### Edit Deck Modal
- **Path**: `src/components/EditDeckModal.tsx`
- **Purpose**: Modal dialog for editing deck title and description
- **Features**:
  - Form validation with required title field
  - Optional description field with textarea
  - Loading states and error handling
  - Callback for parent component updates
- **Usage**: Integrated into deck detail pages for deck editing
- **Dependencies**: Uses shadcn/ui components (Dialog, Input, Textarea, Button)

#### Deck Detail Client
- **Path**: `src/components/DeckDetailClient.tsx`
- **Purpose**: Client-side deck detail page with interactive features
- **Features**:
  - Real-time deck state management
  - Integration with EditDeckModal and EditCardModal
  - Card management and display
  - Study mode navigation

#### Edit Card Modal
- **Path**: `src/components/EditCardModal.tsx`
- **Purpose**: Modal dialog for editing flashcard content
- **Features**:
  - Form validation with required front and back fields
  - Difficulty level selection (1-5 scale)
  - Loading states and error handling
  - Callback for parent component updates
  - Form reset on cancel/close
- **Usage**: Integrated into deck detail pages for card editing
- **Dependencies**: Uses shadcn/ui components (Dialog, Input, Textarea, Button, Label)

#### Add Card Modal
- **Path**: `src/components/AddCardModal.tsx`
- **Purpose**: Modal dialog for creating new flashcards
- **Features**: Form validation, difficulty selection, callback integration
- **Usage**: Used in deck detail pages for interactive deck management
- **Dependencies**: Uses EditDeckModal and AddCardModal components

#### Delete Card Modal
- **Path**: `src/components/DeleteCardModal.tsx`
- **Purpose**: Confirmation dialog for deleting flashcards
- **Features**:
  - Confirmation dialog with card preview
  - Loading states during deletion
  - Error handling and user feedback
  - Callback for parent component updates
- **Usage**: Integrated into deck detail pages for card deletion
- **Dependencies**: Uses shadcn/ui components (Dialog, Button) and deleteCardAction
