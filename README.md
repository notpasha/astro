# Astro AI Assistant

A full-stack application that provides AI-powered astrological guidance through a conversational interface. The application features user authentication, chat sessions, and subscription plans.

## Project Structure

This project consists of three main components:

1. **PostgreSQL Database**: Stores user data, chat history, and subscription information.
2. **FastAPI Backend**: Handles API requests, business logic, and authentication.
3. **React Frontend**: Provides a sleek, intuitive user interface.

## Features

- **Authentication**:
  - Email/password registration with email verification
  - Social login (Google, Facebook, Instagram)
  - JWT-based authentication

- **Chat Interface**:
  - Create and manage multiple chat sessions
  - Conversational AI for astrological insights
  - Chat history persistence

- **Subscription Management**:
  - Multiple subscription tiers
  - Payment integration (Stripe, PayPal, USDT TRC20)
  - Subscription limits for free tier

- **User Profile**:
  - Personal details
  - Birth information for astrological readings
  - Subscription management

## Tech Stack

- **Backend**:
  - FastAPI
  - SQLAlchemy
  - PostgreSQL
  - Python 3.10+
  - Pydantic
  - JWT Authentication

- **Frontend**:
  - React
  - Material-UI
  - Framer Motion
  - Axios
  - React Router
  - Context API

- **Infrastructure**:
  - Docker
  - Docker Compose

## Running the Application

### Prerequisites

- Docker and Docker Compose installed on your system
- Git

### Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd astro
   ```

2. Create environment variables:
   - Copy `.env.example` to `.env` and fill in your configuration values

3. Start the application:
   ```
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

5. Default Users:
   - Demo User:
     - Email: user@example.com
     - Password: password123
     - Subscription: Free tier
   
   - Admin User:
     - Email: admin@astrological-ai.com
     - Password: admin123
     - Subscription: Professional tier

## Development

### Backend Development

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the development server:
   ```
   uvicorn app.main:app --reload
   ```

### Frontend Development

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm start
   ```

## Future Enhancements

- Integration with real AI astrological models
- Enhanced visualization of astrological charts
- Mobile app using React Native
- Additional payment gateways
- Multi-language support

## License

[MIT License](LICENSE)