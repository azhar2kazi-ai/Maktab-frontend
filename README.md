# Maktab Frontend

A comprehensive Angular-based frontend application for managing Quranic education institutions. The Maktab Frontend is a modern, feature-rich web application designed to streamline administrative and educational operations.

## 🎯 Project Overview

**Maktab** (مَكْتَب) - An Arabic term for a Quranic school or learning center. This project provides a complete digital solution for managing classes, students, teachers, evaluations, and administrative tasks in Islamic educational institutions.

### Key Characteristics
- **Framework**: Angular 20.3.x (Latest)
- **Language**: TypeScript (43.5% of codebase)
- **Styling**: CSS (30.5%) with Bootstrap 5.3
- **Markup**: HTML (25.2%)
- **Architecture**: Component-based, service-oriented
- **UI Framework**: Angular Material
- **State Management**: RxJS for reactive programming
- **Data Format**: Excel import/export support

---

## 🌟 Core Features

### 1. **Admin Module**
- **Teacher Salary Management**
  - Create, read, update, and delete salary records
  - Bulk import from Excel files
  - Payment status tracking (Paid/Pending)
  - Add remarks and payment notes
  - Track payment history

- **Excel Integration**
  - Upload .xlsx or .xls files
  - Bulk data import with validation
  - Progress indicator during import
  - Comprehensive error handling
  - Auto-create teachers if not found

### 2. **Class Management** (Evaluation Module)
- Manage Quranic evaluation classes
- Track student progress and evaluations
- Class scheduling and teacher assignment
- Student enrollment and tracking

### 3. **User & Access Management**
- Role-based access control
- Multi-level authentication
- User profile management

### 4. **Data Management**
- Student database management
- Teacher profiles and scheduling
- Comprehensive reporting capabilities

---

## 📊 Language Composition

```
TypeScript: 43.5% (Logic & Components)
CSS:        30.5% (Styling)
HTML:       25.2% (Templates)
Other:       0.8% (Configuration)
```

This composition reflects a modern Angular application with emphasis on logic implementation, responsive styling, and semantic HTML templating.

---

## 🏗️ Technology Stack

### Core Framework
- **@angular/core**: ^20.3.15
- **@angular/common**: ^20.3.15
- **@angular/forms**: ^20.3.15 (Reactive Forms)
- **@angular/router**: ^20.3.15

### UI & Styling
- **@angular/material**: ^20.2.14
- **@angular/cdk**: ^20.2.14 (Component Dev Kit)
- **bootstrap**: ^5.3.8
- **@angular/animations**: ^20.3.15

### Utilities & Data Handling
- **rxjs**: ^7.8.1 (Reactive Extensions)
- **exceljs**: ^4.4.0 (Excel file handling)
- **file-saver**: ^2.0.5 (Download management)
- **tslib**: ^2.8.1
- **zone.js**: ~0.15.1

### Development Tools
- **@angular/cli**: ^20.3.13
- **TypeScript**: 5.9.2
- **Karma**: ^6.4.4 (Test runner)
- **Jasmine**: ~3.8.0 (Testing framework)

---

## 📁 Project Structure

```
Maktab-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── admin.component.ts
│   │   │   │   ├── admin.component.html
│   │   │   │   ├── admin.component.css
│   │   │   │   ├── teacher-salary.component.ts
│   │   │   │   ├── teacher-salary.component.html
│   │   │   │   ├── teacher-salary.component.css
│   │   │   │   ├── admin.service.ts
│   │   │   │   ├── teacher-salary.service.ts
│   │   │   │   └── README.md
│   │   │   ├── evaluation/
│   │   │   └── [other components]
│   │   ├── services/
│   │   ├── models/
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── package.json
├── angular.json
├── tsconfig.json
├── karma.conf.js
├── test.ts
├── README.md (this file)
└── [configuration files]
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+) or yarn
- Angular CLI (v20)

### Installation

```bash
# Clone the repository
git clone https://github.com/azhar2kazi-ai/Maktab-frontend.git
cd Maktab-frontend

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200/`

### Build for Production

```bash
# Build for production
npm run build

# Build output will be in dist/
```

---

## 📚 Key Modules & Components

### Admin Module (`src/app/components/admin/`)
Comprehensive administration panel with salary management and teacher records.

**Main Component**: `TeacherSalaryComponent`
- Salary record management (CRUD operations)
- Excel bulk import functionality
- Table-based data display with filtering
- Real-time status tracking
- Payment management

**Related Services**:
- `TeacherSalaryService`: API communication
- `AdminService`: Admin operations

### Evaluation Module
Handles student evaluations and Quranic class management.

**Features**:
- Class management
- Student evaluation tracking
- Progress monitoring

### UI Components Used
- **MatCard**: Container layouts
- **MatFormField/MatInput**: Form elements
- **MatSelect**: Dropdown selections
- **MatDatepicker**: Date selection
- **MatTable**: Data tables with sorting/filtering
- **MatButton/MatIcon**: Actions and navigation
- **MatChips**: Status badges
- **MatProgressBar**: Progress indicators
- **MatSnackBar**: Notifications

---

## 📋 API Integration

### Expected Backend Endpoints

The application expects the following API endpoints:

```
Teacher Salary Management:
  POST   /api/teacher-salary/import       - Bulk import from Excel
  GET    /api/teacher-salary              - Fetch all salaries
  POST   /api/teacher-salary              - Create new record
  GET    /api/teacher-salary/teacher/{id} - Get salary by teacher
  PUT    /api/teacher-salary/{id}         - Update salary record
  DELETE /api/teacher-salary/{id}         - Delete salary record
  PUT    /api/teacher-salary/{id}/mark-paid - Mark as paid
```

---

## 🎨 Design & Styling

### Color Scheme
- **Primary**: #006666 (Islamic Green)
- **Accent**: #d4af37 (Gold)
- **Success**: Green
- **Warning**: Orange
- **Error**: Red

### CSS Architecture
- Component-scoped styles
- Bootstrap 5 grid system
- Material Design principles
- Responsive design utilities

---

## 📊 Excel Import Format

### Required Structure for Teacher Salary Import:
```
Row 1 (Header): Teacher Name | Salary Month | Amount | Payment Date | Is Paid | Remarks
Row 2+:         [data rows...]
```

### Column Specifications:
| Column | Field | Type | Example | Required |
|--------|-------|------|---------|----------|
| A | Teacher Name | Text | Ahmed Khan | ✅ Yes |
| B | Salary Month | Date | 11/2025 | ✅ Yes |
| C | Amount | Number | 25000 | ✅ Yes |
| D | Payment Date | Date | 15/11/2025 | ❌ No |
| E | Is Paid | Text | yes/no | ❌ No |
| F | Remarks | Text | Monthly salary | ❌ No |

### File Validation:
- **Supported Formats**: .xlsx, .xls
- **Maximum Size**: 10MB
- **Encoding**: UTF-8

---

## 🧪 Testing

### Run Tests
```bash
# Execute unit tests
npm test

# Execute tests with coverage
ng test --code-coverage
```

### Test Configuration
- **Test Runner**: Karma
- **Testing Framework**: Jasmine
- **Browser**: Chrome (configurable)

### Test Areas
- Component initialization and lifecycle
- Form validation logic
- Service API calls
- File upload functionality
- Data transformation and binding
- User interactions and event handling

---

## 📈 Performance Optimization

### Implemented Strategies
- **Lazy Loading**: Components load on demand
- **Reactive Forms**: Efficient form handling
- **RxJS Operators**: Optimized data streams
- **Change Detection**: OnPush strategy where applicable

### Recommendations for Future
- Implement table pagination for large datasets
- Add virtual scrolling for long lists
- Cache frequently accessed data
- Implement service worker for offline support
- Optimize bundle size with tree-shaking

---

## 🔐 Security Features

✅ **Input Validation**: All user inputs validated before processing  
✅ **File Upload Security**: Extension and size validation  
✅ **CORS Protection**: Cross-origin requests properly configured  
✅ **XSS Prevention**: Angular's built-in sanitization  
✅ **CSRF Protection**: HTTP client configured with CSRF tokens  
✅ **Error Message Sanitization**: Sensitive information not exposed  

---

## 📚 Documentation Files

The project includes comprehensive documentation:

- **EVALUATION_MAKTAB_CLASS_SUMMARY.md**: Overview of evaluation system
- **EVALUATION_MAKTAB_CLASS_API_REFERENCE.md**: API reference
- **EVALUATION_MAKTAB_CLASS_IMPLEMENTATION.md**: Implementation details
- **INTEGRATION_AND_TESTING_GUIDE.md**: Testing procedures
- **src/app/components/admin/README.md**: Admin module documentation

---

## 🔄 Application Architecture

### Data Flow Pattern
```
User Interaction (UI)
        ↓
Angular Component
        ↓
Application Service (RxJS Observable)
        ↓
HTTP Client
        ↓
Spring Boot Backend
        ↓
Database Layer
        ↓
Response Handling
        ↓
UI Update & Notifications
```

### Component Communication
- **Parent-Child**: @Input, @Output
- **Sibling Components**: Services with RxJS Subjects
- **Global State**: Singleton services

---

## 🚦 Development Workflow

### Code Style
- **Language**: TypeScript with strict mode enabled
- **Linting**: Angular CLI recommended practices
- **Formatting**: Consistent indentation (2 spaces)
- **Naming Conventions**:
  - Components: `*.component.ts`
  - Services: `*.service.ts`
  - Models: `*.model.ts`
  - CSS Modules: `*.component.css`

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/feature-name

# Commit changes
git commit -m "feat: description of changes"

# Push to remote
git push origin feature/feature-name

# Create Pull Request
```

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| `ng serve` fails | Node/npm version mismatch | Update to Node v18+, npm v9+ |
| Module not found | Dependencies not installed | Run `npm install` |
| Styles not applying | CSS not loaded | Check `angular.json` styleUrls |
| API connection error | Backend not running | Verify backend server is running |
| File upload fails | Invalid file format/size | Use .xlsx format, max 10MB |
| Form validation errors | Missing required fields | Fill all required fields |

---

## 📦 Build & Deployment

### Development Build
```bash
npm start
# or
ng serve
```

### Production Build
```bash
npm run build
# Output: dist/maktab-abubakr-frontend/
```

### Build Optimization
- Ahead-of-Time (AOT) compilation enabled
- Tree-shaking for unused code removal
- Minification and uglification
- Source map generation for debugging

---

## 🔄 Version History

- **v0.0.0** (Current): Initial development release
- **Framework**: Angular 20.3.15
- **Node Requirement**: v18+
- **TypeScript**: 5.9.2

---

## 📝 Environment Configuration

### Environment Files
```
src/environments/
  ├── environment.ts       (development)
  └── environment.prod.ts  (production)
```

### Configuration Variables
- API Base URL
- Authentication endpoints
- Feature flags
- Logging levels

---

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

### Code Review Process
- Automated tests must pass
- Code follows project standards
- At least one review approval required

---

## 📞 Support & Contact

For issues, questions, or suggestions:
- **Repository**: https://github.com/azhar2kazi-ai/Maktab-frontend
- **Issues**: https://github.com/azhar2kazi-ai/Maktab-frontend/issues
- **Discussions**: Available on GitHub

---

## 📄 License

This project is public and available under the repository terms.

---

## 🎓 Educational Purpose

This application is designed specifically for Islamic educational institutions and Quranic schools, helping them:
- Manage student evaluations
- Track teacher performance
- Handle administrative tasks
- Maintain accurate records
- Streamline communication

---

## ✨ Key Highlights

🔹 **Modern Angular**: Built with latest Angular 20 patterns  
🔹 **Responsive Design**: Works on desktop, tablet, and mobile  
🔹 **Material Design**: Professional UI using Angular Material  
🔹 **Excel Integration**: Bulk data import/export capabilities  
🔹 **Form Validation**: Comprehensive client-side validation  
🔹 **Error Handling**: User-friendly error messages  
🔹 **Performance**: Optimized for smooth user experience  
🔹 **Security**: Multiple security layers implemented  

---

**Last Updated**: August 8, 2026  
**Status**: Active Development  
**Maintainer**: azhar2kazi-ai
