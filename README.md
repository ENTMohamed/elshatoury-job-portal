# El Shatoury Job Portal

A modern job application portal for El Shatoury Pharmacy, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Job application form with file upload
- Admin dashboard for managing applications
- Secure authentication system
- Responsive design
- Form validation
- File upload to Cloudinary
- Email notifications (optional)

## Prerequisites

- Node.js 18.x or later
- MongoDB
- Cloudinary account (for file uploads)
- SMTP server (optional, for email notifications)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/elshatoury-job-portal.git
   cd elshatoury-job-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:
   ```env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/elshatoury-jobs

   # JWT
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRES_IN=7d

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Admin Credentials
   ADMIN_EMAIL=admin@elshatoury.com
   ADMIN_PASSWORD=your-admin-password

   # Email (Optional)
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your-smtp-user
   SMTP_PASS=your-smtp-password
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Admin Access

- URL: `/admin/login`
- Default credentials:
  - Email: admin@elshatoury.com
  - Password: your-admin-password

## File Upload

The application uses Cloudinary for file uploads. Make sure to:
1. Create a Cloudinary account
2. Get your API credentials
3. Add them to the `.env` file

## Email Notifications

To enable email notifications:
1. Set up an SMTP server
2. Add the SMTP credentials to the `.env` file
3. The system will automatically send notifications for new applications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 