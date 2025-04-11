# MotionFlow

MotionFlow is an AI-native web application designed to accelerate U.S. county court motion handling by automating document intake, compliance review, and providing AI-powered review assistance for court clerks.

## Tech Stack

### Frontend
- **Next.js**: Application framework providing routing, server components, and optimized rendering
- **React**: UI component library for building the interactive interface
- **TypeScript**: Strongly-typed programming language enhancing code quality and developer experience
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Shadcn UI**: Component library built on Radix UI providing accessible, customizable components
- **React Router**: Client-side routing for navigation between views
- **React Hooks**: State management and side effects handling

### Backend (Planned)
- **Vercel Serverless Functions**: API endpoints for data processing
- **Node.js/Express**: Server-side logic
- **Supabase**: PostgreSQL database and storage
- **OpenAI API**: AI processing for document analysis
- **OCR Service**: Document text extraction

## Project Structure

### Root Files
- `README.md`: Project documentation
- `tailwind.config.ts`: Tailwind CSS configuration including theme customization
- `next.config.mjs`: Next.js configuration

### App Directory
- `app/layout.tsx`: Root layout component that wraps all pages. Contains the ThemeProvider for consistent styling and the Toaster component for notifications. Sets up the Inter font and basic HTML structure.
- `app/page.tsx`: Entry point that redirects unauthenticated users to the login page. Acts as a simple router guard.
- `app/login/page.tsx`: Authentication page with a form for email/password login. Includes client-side validation, error handling, and mock authentication logic that stores user data in localStorage. Displays demo account information for easy testing.
- `app/globals.css`: Global styles including Tailwind directives and CSS variables for the theme. Defines custom color schemes, animations, and utility classes used throughout the application.
- `app/(authenticated)/layout.tsx`: Layout wrapper for all authenticated routes. Implements the AppShell component which provides navigation and ensures users are authenticated before accessing protected pages.
- `app/(authenticated)/dashboard/page.tsx`: Main dashboard displaying a filterable, sortable table of motions. Implements court-specific data filtering based on the logged-in user's court assignment. Features include batch selection, status filtering, search functionality, and action buttons for processing motions. The "Date Filed" column now displays datetime information (date and time) instead of just date for more precise tracking.
- `app/(authenticated)/upload/page.tsx`: Document upload interface with a multi-step workflow. The first step provides drag-and-drop functionality for file selection and validation. The second step enables review of AI-extracted information from each document before final submission. Features include file validation (PDF/JPG only), upload progress tracking, and a comprehensive review interface for verifying and correcting AI-extracted data before adding documents to the dashboard.
- `app/(authenticated)/batches/page.tsx`: Batch upload status tracking page showing all batches initiated by the current user. Displays progress metrics, status indicators, and allows navigation to view motions within a specific batch. The "Date" column now displays datetime information (date and time) instead of just date for more precise tracking of batch uploads.
- `app/(authenticated)/motion/[id]/page.tsx`: Detailed motion review interface with a document preview panel and extracted data form. Implements tabs for switching between document view and AI summary. Features compliance checking, confidence indicators for AI-extracted fields, and action buttons (Accept/Reject/Request Fix) with confirmation dialogs. Document filing timestamps now display full datetime information for better tracking.
- `app/(authenticated)/settings/page.tsx`: User settings page with profile information, password management, and notification preferences. Demonstrates form handling and preference toggling with immediate feedback.

### Components
- `components/layout/app-shell.tsx`: Core layout component that provides the application shell with responsive sidebar navigation. Handles mobile/desktop view switching, user authentication state, and navigation routing. Implements a collapsible sidebar for mobile devices and persistent navigation for desktop.
- `components/upload/document-review.tsx`: Comprehensive component for reviewing AI-extracted information from uploaded documents. Features a split-panel interface with document preview on one side and extracted data on the other. Dynamically renders different form fields based on the motion type (e.g., Motion for Continuance, Motion to Dismiss, etc.). Includes confidence indicators for AI-extracted fields, compliance checking, and action buttons for approving, rejecting, or requesting manual review of documents. Now displays the document filing datetime in the header for better context and tracking. Implements key information highlighting and citation verification features to enhance document review.
- `components/ui/stepper.tsx`: Custom UI component that implements a step-by-step workflow interface. Used in the upload process to guide users through the document upload and review stages. Provides visual indicators of the current step, completed steps, and disabled future steps.
- `components/ui/*`: Shadcn UI components providing accessible, customizable UI elements. These are imported rather than custom-built and include:
  - Button: Primary interaction elements with multiple variants (default, outline, destructive, etc.)
  - Card: Container components for grouping related content
  - Dialog: Modal dialogs for confirmations and forms
  - Form elements: Input, Textarea, Select, Checkbox, etc.
  - Toast: Non-intrusive notification system
  - Table: Data display with sorting and selection capabilities
  - Badge: Status indicators with semantic colors
  - And many more foundational UI components
- `components/theme-provider.tsx`: Context provider that manages theme state (light/dark) and provides theme switching capabilities. Persists theme preference in localStorage.

### Lib Directory
- `lib/types.ts`: Comprehensive TypeScript interfaces defining the data models used throughout the application. Includes:
  - User: Authentication and permission data with court assignment
  - Motion: Complete motion data structure with metadata, extracted fields, compliance flags, and AI confidence scores
  - BatchUpload: Batch processing status and metrics
  - ComplianceFlag: Structure for compliance checking results
  - Court/County: Organizational structure data
  - Additional supporting interfaces for the domain model
- `lib/mock-data.ts`: Simulated backend data that mimics API responses. Implements realistic data relationships between entities (users, courts, motions, batches) and provides varied test cases with different statuses, compliance issues, and confidence scores. This data drives all the interactive features in the absence of a real backend.
- `lib/utils.ts`: Utility functions that handle common operations:
  - `cn()`: Combines Tailwind classes conditionally using clsx and tailwind-merge
  - `formatDate()`: Date-only formatting for display when appropriate
  - `formatDateTime()`: Enhanced datetime formatting that displays both date and time components in a user-friendly format (e.g., "Apr 10, 2025, 2:30 PM")
  - `truncateText()`: String truncation with ellipsis for UI display
  - `getInitials()`: Extracts initials from names for avatar displays

### Hooks
- `hooks/use-mobile.ts`: Custom React hook that detects and responds to viewport size changes. Provides a boolean `isMobile` state that components can use to adapt their layout and behavior for mobile devices. Uses event listeners for window resize events with proper cleanup to prevent memory leaks.
- `hooks/use-toast.ts`: Toast notification management hook that provides a consistent interface for displaying non-intrusive notifications. Supports different variants (default, success, warning, destructive) and customizable duration. Used throughout the application to provide feedback for user actions.

## Features

1. **Authentication System**
   - Secure login with email/password validation and error handling
   - Role-based access control that restricts clerks to their assigned court's data
   - Court-specific data isolation using filtering based on the user's courtId
   - Persistent authentication using localStorage (simulated; would use secure cookies in production)
   - Session management with automatic redirects for unauthenticated users
   - User profile display in the navigation sidebar

2. **Dashboard**
   - Filterable, sortable motion queue with real-time client-side filtering
   - Advanced search functionality for case numbers and filer names
   - Status filtering with dropdown selection for quick view changes
   - Status indicators with semantic color-coded badges (green for accepted, red for rejected, etc.)
   - Batch selection with checkboxes for multi-motion processing
   - Batch action buttons that appear contextually when motions are selected
   - Responsive table layout that adapts to different screen sizes
   - Empty state handling with helpful messages when no motions match filters
   - Precise datetime display for "Date Filed" column showing both date and time information

3. **Document Upload and Review Workflow**
   - Multi-step process with clear visual indicators of the current stage
   - Step 1: Document Upload
     - Intuitive drag-and-drop interface with visual feedback during drag operations
     - Traditional file browser fallback via click interaction
     - Client-side file validation for type (PDF/JPG) and size
     - Visual file list with size information and remove capability
     - Upload progress tracking with percentage and progress bar
     - Batch status indication and success/failure feedback
   - Step 2: Document Review
     - Document-by-document review interface with navigation controls
     - Split-panel layout with document preview and extracted data side by side
     - Dynamic form fields based on motion type (e.g., different fields for Motion for Continuance vs. Motion to Dismiss)
     - Visual indicators for low-confidence AI extractions
     - Compliance checking with pass/fail indicators
     - Action buttons for approving, rejecting, or requesting manual review
     - Progress tracking showing how many documents have been reviewed
     - Completion summary with option to finish and go to dashboard
     - Document filing datetime display for better context and tracking
     - Key information highlighting with color-coded visual indicators for dates, names, case numbers, and legal citations
     - Citation verification with validity checking and contextual navigation

4. **Motion Review Interface**
   - Side-by-side view of document preview and extracted/AI-generated data
   - Tabbed interface switching between document view and AI summary
   - Document preview with simulated PDF rendering
   - Extracted data form with editable fields for correction
   - Confidence indicators highlighting uncertain AI extractions (<80% confidence)
   - Field-specific confidence score display
   - Compliance flags with pass/fail status and explanations
   - AI assistance features including:
     - Motion summarization in plain language
     - PII detection with redaction suggestions
     - Duplicate detection to prevent redundant processing
     - Citation verification with validity checking and error explanations
   - Key information highlighting with:
     - Toggle switch to enable/disable highlighting
     - Color-coded visual indicators (yellow for dates, blue for names, green for case numbers, purple for citations)
     - Legend explaining the color coding system
     - Enhanced readability for critical information
   - Citation verification with:
     - Automatic detection and validation of legal citations
     - Visual indicators for valid and invalid citations
     - Detailed error messages for invalid citations
     - Context information showing where citations appear in the document
     - Navigation links to jump directly to citations in the document
     - Summary view in the extracted information panel
   - Action toolbar with contextual buttons:
     - Accept: Quick approval workflow
     - Reject: With reason selection and notes
     - Request Fix: With detailed notes capability
   - Changes tracking with save button that appears only when edits are made
   - Confirmation dialogs for destructive or significant actions
   - Precise datetime display for document filing information

5. **Batch Management**
   - Comprehensive batch tracking interface
   - Visual progress indicators showing completion percentage
   - Status badges with semantic colors
   - File count metrics (total, processed, failed)
   - Timestamp information with consistent datetime formatting showing both date and time
   - Quick navigation to view motions within a specific batch
   - Empty state handling with call-to-action for first upload

6. **Settings**
   - User profile information display
   - Password management with current/new password fields
   - Notification preferences with toggles for:
     - Notification channels (email, browser)
     - Notification types (motion updates, batch completions)
   - Immediate feedback for preference changes
   - Form validation with error handling
   - Responsive layout that works well on mobile and desktop

7. **Motion Type-Specific Data Extraction**
   - Support for the top five eviction motion types:
     - Motion for Continuance: Extracts reason for continuance, original hearing date, requested new date
     - Motion to Dismiss: Extracts grounds for dismissal, legal authority cited
     - Motion for Default Judgment: Extracts reason for default, service date, response deadline, judgment amount
     - Motion for Stay of Execution: Extracts reason for stay, judgment date, execution date, requested stay duration
     - Motion to Set Aside Judgment: Extracts grounds for setting aside, judgment date, filing deadline, legal authority
   - Dynamic form rendering based on motion type
   - Confidence indicators for AI-extracted fields
   - Editable fields for correcting AI extraction errors

## Getting Started

### Prerequisites
- Node.js 18+ (install via Homebrew on Mac: `brew install node`)
- npm (comes with Node.js) or yarn (optional)

### Installation

1. Clone the repository
   \`\`\`bash
   git clone https://github.com/yourusername/motionflow.git
   cd motionflow
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   # Using npm (recommended for Mac)
   npm install
   
   # Or using yarn if you prefer
   yarn install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   # Using npm
   npm run dev
   
   # Or using yarn
   yarn dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Accounts
- Travis County Clerk: `travis_clerk@example.com` / `password`
- Williamson County Clerk: `williamson_clerk@example.com` / `password`

## Mac-Specific Development Tips

- If you encounter permission issues, you may need to use `sudo` for some commands
- For best performance, consider using Visual Studio Code with the following extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript React code snippets
- Terminal shortcuts:
  - `Command + T`: New tab
  - `Command + K`: Clear terminal
  - `Control + C`: Stop running process

## Development Guidelines

### Code Organization
- Use TypeScript for all new code
- Follow the component structure established in the project
- Place new components in appropriate directories based on their function
- Use the established naming conventions

### Styling
- Use Tailwind CSS for styling
- Leverage Shadcn UI components when possible
- Follow the established color scheme and design patterns

### State Management
- Use React hooks for component-level state
- Consider more robust state management (Redux, Zustand) for complex state as the application grows

## Future Development

- Backend integration with Vercel Serverless Functions
- Supabase database and storage implementation
- OpenAI API integration for document analysis
- OCR service integration for text extraction
- User management system
- Advanced AI features implementation
