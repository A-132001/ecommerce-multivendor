# VendorHub - Multi-Vendor E-Commerce Platform

A full-stack e-commerce platform that connects multiple vendors with customers, featuring a modern React frontend and Django REST framework backend.

![VendorHub Platform](https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

## 🚀 VendorHub Features

### Customer Features
- User authentication & authorization (JWT)
- Product browsing and search
- Shopping cart functionality
- Secure payment processing
- Order tracking
- Product reviews and ratings
- Responsive design for all devices

### Vendor Features
- Vendor registration and dashboard
- Product management (CRUD operations)
- Order management
- Sales analytics
- Inventory tracking

### Admin Features
- User management
- Vendor approval system
- Category management
- Sales reports
- Platform analytics

## 🛠️ VendorHub Tech Stack

### Frontend
- **Framework**: React 19
- **State Management**: Redux Toolkit
- **UI Library**: React Bootstrap
- **Styling**: Motion-Framer
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Backend
- **Framework**: Django 5.2 & Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Caching**: Redis
- **Task Queue**: Celery
- **API Documentation**: DRF Spectacular (OpenAPI 3)

## 🚀 Getting Started with VendorHub

### Prerequisites
- Node.js (v18+)
- Python (3.9+)
- PostgreSQL
- Redis
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecommerce-multivendor.git
   cd ecommerce-multivendor/backend
   ```

2. **Create and activate a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the backend directory with the following variables:
   ```
   SECRET_KEY=your-secret-key
   DEBUG=True
   DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce_db
   REDIS_URL=redis://localhost:6379/0
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   The application should be running at `http://localhost:5173`

## 📦 VendorHub Project Structure

```
ecommerce-multivendor/
├── backend/                  # Django backend
│   ├── cart/                 # Shopping cart functionality
│   ├── core/                 # Core app with base settings
│   ├── media/                # User-uploaded files
│   ├── orders/               # Order management
│   ├── payment/              # Payment processing
│   ├── products/             # Product catalog
│   ├── users/                # User authentication
│   ├── vendors/              # Vendor management
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/                # React frontend
    ├── public/               # Static files
    └── src/                  # Source code
        ├── assets/           # Images, fonts, etc.
        ├── components/       # Reusable UI components
        ├── pages/            # Page components
        ├── redux/            # Redux store and slices
        ├── services/         # API services
        └── App.jsx           # Main component
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Django](https://www.djangoproject.com/)
- [React](https://reactjs.org/)
- [Material-UI](https://mui.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

---

## 👥 Contributors

- [Mostafa Kadry](https://github.com/MostafaKadry)
- [Abdelrahamn Sabry](https://github.com/AbdelrahmanSabryA)
- [Gehad Balegh](https://github.com/GehadBalegh)
- [Bassem Beshai](https://github.com/BassemBeshay)
- [Reem Mahmoud](https://github.com/ReemMahmoud1)

Made with ❤️ by the VendorHub Team
