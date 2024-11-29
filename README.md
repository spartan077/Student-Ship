# StudentShip - College Luggage Shipping Platform

A modern web application built with React and Supabase that enables college students to easily book and manage their luggage shipping between home and college.



[Check it out](https://studentship.saatvik.me/)

## Project Overview

StudentShip simplifies the process of shipping personal items and luggage for college students. The platform provides an intuitive interface for submitting shipping requests, receiving quotations, and tracking shipments.

### Key Features

- **User Authentication**: Secure email-based signup and login
- **Request Management**: Submit and track shipping requests
- **Real-time Updates**: Instant notifications for request status changes
- **Admin Dashboard**: Dedicated interface for managing quotations and requests
- **Responsive Design**: Seamless experience across all devices

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- Supabase account

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/student-ship.git
cd student-ship
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL commands from `supabase.sql` in the SQL editor
   - Copy your project URL and anon key to the `.env` file

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
student-ship/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AdminRoute.tsx
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── lib/              # Utility functions and configurations
│   │   └── supabase.ts
│   ├── pages/            # Page components
│   │   ├── AdminDashboard.tsx
│   │   ├── CreateRequest.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Requests.tsx
│   │   └── Signup.tsx
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx           # Root component
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── .env                # Environment variables
├── index.html
├── package.json
├── README.md
├── supabase.sql        # Database schema
└── tsconfig.json
```

## Key Components

### Authentication (`AuthContext.tsx`)
- Manages user authentication state
- Provides login/signup functionality
- Handles admin role verification

### Request Management
- `CreateRequest.tsx`: Form for submitting new shipping requests
- `Requests.tsx`: Displays user's shipping requests and their status
- `AdminDashboard.tsx`: Interface for managing quotations and requests

### Database Schema

The Supabase database includes the following tables:
- `shipping_requests`: Stores shipping request details
- `notifications`: Manages user notifications
- Row-level security policies for data protection

## Dependencies

- **React**: Frontend framework
- **Supabase**: Backend-as-a-service for authentication and database
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Date-fns**: Date formatting
- **React Hot Toast**: Toast notifications

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Netlify:
   - Connect your GitHub repository
   - Set environment variables in Netlify dashboard
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

## Usage

### For Users
1. Sign up with email
2. Create shipping request with package details
3. Receive quotation notification
4. Accept/reject quotation
5. Track shipping status

### For Admin
1. Login with admin email (saatviktiwari@gmail.com)
2. View all shipping requests
3. Provide quotations
4. Manage request statuses

## Future Improvements

- [ ] Multi-admin support
- [ ] Payment integration
- [ ] Real-time chat support
- [ ] Mobile app version
- [ ] Automated pricing calculator
- [ ] Integration with shipping carriers

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify Supabase credentials in `.env`
   - Check email verification status

2. **Database Access Issues**
   - Confirm RLS policies are properly configured
   - Verify user permissions

3. **Build Errors**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any queries or support:
- Email: saatviktiwari@gmail.com
- GitHub: [spartan077](https://github.com/spartan077)

---

Built with ❤️ for college students
