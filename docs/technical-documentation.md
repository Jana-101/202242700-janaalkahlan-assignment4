# Technical Documentation – Assignment 4

## Project Overview

This project is a fully enhanced personal web application built as a continuation of previous assignments.

It evolves from a basic portfolio into a **feature-rich, interactive frontend application** with improved usability, clearer user guidance, and more refined system behavior.

The application allows users to explore projects, interact with dynamic content, personalize their experience, and view real-time data from external sources.

---

## File Structure

* `index.html`  
  Contains the full structure of the website, including all sections, UI components, and semantic layout.

* `css/styles.css`  
  Handles layout, styling, responsive design, themes, animations, and UI consistency.

* `js/script.js`  
  Manages all interactivity, dynamic behavior, API integration, event handling, and state management.

* `docs/`  
  Contains technical documentation and AI usage reports.

---

## System Architecture Overview

The application follows a **client-side architecture** divided into three main layers:

### 1. Presentation Layer (HTML + CSS)
- Defines layout, structure, and visual design  
- Ensures responsiveness across devices  
- Provides clear visual hierarchy and readability  

### 2. Logic Layer (JavaScript)
- Handles user interactions and UI updates  
- Manages filtering, search, sorting, and validation  
- Controls application state using localStorage  

### 3. External Data Layer (GitHub API)
- Fetches live repository data  
- Integrates external content dynamically into the UI  

---

## HTML Structure

The HTML is organized into clear semantic sections:

* **Navigation Bar**
  - Links to sections  
  - Theme toggle  
  - Hamburger menu for mobile  

* **Hero Section**
  - Introduction  
  - Call-to-action buttons  

* **About Section**
  - Personal description  

* **Projects Section**
  - Interactive project cards  
  - Search, filter, and sorting controls  

* **GitHub Section**
  - Dynamically loaded repositories  

* **Skills Section**
  - Categorized skill blocks  

* **Contact Section**
  - Interactive form with validation  

* **Welcome Banner**
  - Personalized greeting based on user input  

Each section is designed to be independent and clearly structured for maintainability.

---

## CSS Styling and Responsiveness

### Key Design Techniques

* CSS variables for consistent theming and colors  
* Flexbox and Grid for layout structure  
* Media queries for responsive design  
* Smooth transitions and animations  
* Light/Dark theme using `data-theme`  

### Improvements in Assignment 4

* Enhanced visual hierarchy for better readability  
* Improved spacing and alignment across sections  
* Clearer section separation  
* More user-friendly typography and layout balance  

---

## JavaScript Functionality

### 1. Navigation & UI

* Hamburger menu for mobile navigation  
* Theme toggle with persistence using `localStorage`  

---

### 2. Projects System

#### Filtering
* Uses `data-category` attributes  
* Dynamically updates visible projects  

#### Search
* Matches project title and description  
* Updates results in real time  

#### Sorting
* Options:
  - Default  
  - Name A–Z  
  - Name Z–A  
  - Category  

* Works simultaneously with filtering and search using a unified logic function  

---

### 3. GitHub API Integration

* Fetches repositories from:
https://api.github.com/users/Jana-101/repos


* Displays:
- Repository name  
- Description  
- Programming language  
- Star count  

* Includes:
- Loading state (visual feedback)  
- Error handling (fallback message)  
- Retry mechanism  

---

### 4. Form Validation

* Validates:
- Name (required)  
- Email (format check)  
- Message (required)  

* Features:
- Inline error messages  
- Real-time validation while typing  
- Success message after submission  
- Automatic reset after successful submission  

### Improvements in Assignment 4:
* Removed confusing error summary  
* Improved clarity of feedback messages  
* More responsive validation behavior  

---

### 5. User Personalization

* Prompts user for name on first visit  
* Stores name in `localStorage`  
* Displays personalized welcome message  

* If user skips:
- Displays a generic greeting ("Hello there, stranger")  

---

### 6. Session Timer

* Displays time spent on the website  
* Updates dynamically every second  
* Improves user awareness and engagement  

---

### 7. User Guidance System

* “How to Use” panel with clear instructions  
* Step-by-step guidance for interacting with the website  
* Designed to improve usability and navigation clarity  

---

## 🧭 User Interaction Flow

### Example User Journey

1. User opens the website  
2. A name prompt appears (optional input)  
3. User navigates using the top menu  
4. In the Projects section:
 - Uses search to find projects  
 - Applies filters  
 - Sorts results  
5. Scrolls to GitHub section:
 - Views live repositories  
6. Interacts with UI:
 - Switches theme  
 - Observes animations  
7. Goes to Contact section:
 - Fills out form  
 - Fixes inline errors if needed  
 - Submits successfully  

---

## State Management

The application uses `localStorage` to persist:

* Theme preference  
* Selected filter  
* Search query  
* User name  

This ensures that user preferences are maintained across sessions.

---

## Error Handling

* Inline validation errors in forms  
* API error fallback message  
* Empty search results message  

### Improvements:
* Removed unnecessary error summary  
* Ensured clearer, less intrusive feedback  

---

## Performance Considerations

* Efficient DOM updates (no unnecessary re-rendering)  
* Cached DOM queries for better performance  
* Combined filtering, search, and sorting into one logic flow  
* Lightweight frontend (no external frameworks)  

---

## Summary

This project demonstrates:

* Advanced frontend development techniques  
* Integration with external APIs  
* Strong focus on user experience and usability  
* Clean and maintainable code structure  
* Effective state management and persistence  

It represents a complete, interactive, and user-centered web application.