# 📊 Scanner Monitoring System

A modern, full-featured web application for managing and tracking scanner devices across multiple branches and office locations. Built with Laravel 12, React, and TypeScript for a seamless user experience.

![Laravel](https://img.shields.io/badge/Laravel-12.0-FF2D20?style=flat-square&logo=laravel)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)
![PHP](https://img.shields.io/badge/PHP-8.2-777BB4?style=flat-square&logo=php)

## ✨ Features

- **Scanner Management** - Add, edit, and delete scanner records with detailed information
- **Branch Management** - Organize scanners by branches, office types, and locations
- **Status Tracking** - Monitor scanner status (Active, For Repair, Defective)
- **Advanced Search** - Real-time search filtering with debouncing for scanner records
- **Pagination** - Efficient data pagination with customizable items per page
- **Responsive Design** - Works seamlessly on desktop and tablet devices
- **Dark Mode Support** - Automatic theme detection with full dark mode support
- **Form Validation** - Client-side and server-side validation using Zod
- **Real-time Feedback** - Toast notifications for success and error messages
- **Modern UI** - Beautiful, professional interface with smooth animations and transitions

## 🛠️ Tech Stack

### Backend

- **Laravel 12** - Modern PHP framework
- **PHP 8.2+** - Latest PHP features
- **Inertia.js** - Server-driven SPA framework
- **Pest** - Modern PHP testing framework

### Frontend

- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Lightning-fast build tool
- **React Hook Form** - Efficient form handling
- **Zod** - TypeScript-first schema validation
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notification library
- **Radix UI** - Headless component library

### Development Tools

- **ESLint** - Code quality and consistency
- **Prettier** - Code formatter
- **TypeScript** - Static type checking
- **Tailwind CSS IntelliSense** - IDE support

## 📋 Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- SQLite or MySQL/PostgreSQL database
- Git (optional)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/allanjustine/Scanner-Monitoring.git
cd Scanner-Monitoring
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node Dependencies

```bash
npm install
```

### 4. Setup Environment File

```bash
cp .env.example .env
```

Edit `.env` and configure your database connection:

```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
# or for MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=scanner_monitoring
# DB_USERNAME=root
# DB_PASSWORD=
```

### 5. Generate Application Key

```bash
php artisan key:generate
```

### 6. Run Database Migrations

```bash
php artisan migrate
```

### 7. Build Assets

```bash
npm run build
```

## 💻 Running the Application

### Development Mode

**Terminal 1 - Start the Vite Dev Server:**

```bash
npm run dev
```

**Terminal 2 - Start the Laravel Dev Server:**

```bash
php artisan serve
```

The application will be available at `http://localhost:8000`

### Production Build

```bash
npm run build
php artisan optimize
```

Then serve with your production server (Nginx, Apache, etc.)

## 📁 Project Structure

```
Scanner-Monitoring/
├── app/
│   ├── Http/
│   │   ├── Controllers/        # API controllers
│   │   ├── Middleware/         # HTTP middleware
│   │   └── Requests/           # Form request validation
│   ├── Models/
│   │   ├── BranchList.php      # Branch model
│   │   ├── ScannerRecordList.php # Scanner record model
│   │   └── User.php            # User authentication
│   └── Providers/              # Service providers
├── database/
│   ├── migrations/             # Database migrations
│   ├── factories/              # Model factories
│   └── seeders/                # Database seeders
├── resources/
│   ├── css/                    # Global styles
│   ├── js/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── layouts/            # Layout components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── types/              # TypeScript type definitions
│   │   ├── utils/              # Utility functions
│   │   ├── app.tsx             # App entry point
│   │   └── ssr.tsx             # SSR entry point
│   └── views/
│       └── app.blade.php       # Main Blade template
├── routes/
│   ├── api.php                 # API routes
│   ├── web.php                 # Web routes
│   └── auth.php                # Authentication routes
├── tests/
│   ├── Feature/                # Feature tests
│   └── Unit/                   # Unit tests
├── public/                     # Public assets
├── storage/                    # Application storage
├── config/                     # Configuration files
└── docker-compose.yml          # Docker configuration
```

## 🎨 UI Components

### Key Pages

1. **Scanner Records Page** (`/`)
    - View all scanner records in a beautiful table
    - Add new scanner records with a form row
    - Edit existing records inline
    - Delete records with confirmation
    - Search and filter functionality
    - Pagination with customizable items per page

2. **Branch Management Sidebar**
    - View all registered branches
    - Add new branches with code and name
    - Edit branch information
    - Delete branches
    - Real-time list updates

### Features & UX

- **Responsive Design** - Adapts to all screen sizes
- **Dark Mode** - Automatic theme detection (light/dark)
- **Real-time Feedback** - Toast notifications for all actions
- **Smooth Animations** - Transitions and hover effects
- **Accessible** - WCAG compliant with semantic HTML
- **Performance** - Optimized component rendering

## 🔐 Authentication

The application includes authentication with:

- Login/Register pages
- Password reset functionality
- Session management
- Protected routes

User table is pre-configured with Laravel Socialite ready structure.

## 📝 API Endpoints

### Branch Management

- `GET /api/branches` - List all branches
- `POST /api/branches` - Create new branch
- `PATCH /api/branches/{id}` - Update branch
- `DELETE /api/branches/{id}` - Delete branch

### Scanner Records

- `GET /api/scanner-records` - List scanner records with pagination
- `POST /api/scanner-records` - Create new scanner record
- `PATCH /api/scanner-records/{id}` - Update scanner record
- `DELETE /api/scanner-records/{id}` - Delete scanner record

All endpoints use cursor-based pagination for better performance.

## 🧪 Testing

Run tests with Pest:

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/ScannerRecordTest.php

# Run with coverage
php artisan test --coverage
```

## 📊 Database Models

### Branch List

```
- id: integer (primary key)
- branch_code: string (unique)
- branch_name: string
- created_at: timestamp
- updated_at: timestamp
```

### Scanner Record List

```
- id: integer (primary key)
- branch_list_id: foreign key
- office_type: enum (BRANCH, HEAD OFFICE, LOGISTIC)
- serial_number: string
- model: string
- status: enum (Active, Deffective, For Repair)
- remarks: text (nullable)
- created_at: timestamp
- updated_at: timestamp
```

## 🎯 Code Quality

The project follows best practices:

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Laravel Pint** for PHP formatting
- **Pest** for comprehensive testing
- **SOLID Principles** for clean code

Run code quality checks:

```bash
# Check TypeScript
npm run types

# Check ESLint
npm run lint

# Format code
npm run format

# Format PHP
php artisan pint
```

## 🚀 Performance Optimizations

- ✅ Cursor-based pagination for scalability
- ✅ Debounced search (1000ms) to reduce queries
- ✅ Component lazy loading
- ✅ Optimized images and assets
- ✅ Vite for fast builds
- ✅ Laravel Boost for framework optimization

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 📚 Environment Variables

Key environment variables in `.env`:

```env
APP_NAME="Scanner Monitoring"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

VITE_APP_URL=http://localhost:8000
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:

- Code follows PSR-12 and TypeScript conventions
- All tests pass
- New features have tests
- Code is formatted with Prettier and ESLint

## 📝 Changelog

### Version 1.0.0 (2026-08-18)

- Initial release
- Scanner record management
- Branch management
- Dark mode support
- Modern responsive UI
- Full test coverage

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Allan Justine**

- GitHub: [@allanjustine](https://github.com/allanjustine)
- Repository: [Scanner-Monitoring](https://github.com/allanjustine/Scanner-Monitoring)

## 🆘 Support

For support, email support@example.com or open an issue on GitHub.

## 🙏 Acknowledgments

- Laravel team for the amazing framework
- React team for the UI library
- Inertia.js team for the server-driven SPA approach
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors

---

**Made with ❤️ for efficient scanner device management**
