"""
Astro AI Assistant - Main entry point

This is the main entry point for the Astro AI Assistant project.
Run this file to start the development servers.
"""

import subprocess
import os
import webbrowser
import time
import sys

def print_header():
    """Print the application header."""
    print("\n" + "="*80)
    print(" "*30 + "ASTRO AI ASSISTANT")
    print("="*80)
    print("\nYour personal AI-powered astrological assistant")
    print("Built with FastAPI, React, and PostgreSQL\n")

def check_docker():
    """Check if Docker is installed and running."""
    try:
        subprocess.run(["docker", "--version"], check=True, capture_output=True)
        subprocess.run(["docker-compose", "--version"], check=True, capture_output=True)
        return True
    except (subprocess.SubprocessError, FileNotFoundError):
        print("❌ Docker or Docker Compose not found. Please install Docker and Docker Compose.")
        return False

def start_services():
    """Start Docker services."""
    print("🚀 Starting services (PostgreSQL, Backend, Frontend)...")
    try:
        subprocess.run(["docker-compose", "up", "-d"], check=True)
        print("✅ Services started successfully!")
        return True
    except subprocess.SubprocessError as e:
        print(f"❌ Failed to start services: {e}")
        return False

def open_browser():
    """Open the application in a web browser."""
    time.sleep(5)  # Wait for services to be ready
    print("🌐 Opening application in browser...")
    webbrowser.open("http://localhost:3000")

def show_info():
    """Show information about the running services."""
    print("\n📊 Service Information:")
    print("  • Frontend: http://localhost:3000")
    print("  • Backend API: http://localhost:8000")
    print("  • API Documentation: http://localhost:8000/docs")
    print("\n📝 Default Credentials (for testing):")
    print("  • Demo User:")
    print("    - Email: user@example.com")
    print("    - Password: password123")
    print("    - Subscription: Free tier")
    print("  • Admin User:")
    print("    - Email: admin@astrological-ai.com")
    print("    - Password: admin123")
    print("    - Subscription: Professional tier")
    
    print("\n💡 Tip: Use Ctrl+C to stop the services")
    print("\n🛠  Development Commands:")
    print("  • Stop services: docker-compose down")
    print("  • View logs: docker-compose logs -f")

def main():
    """Main function that orchestrates the application startup."""
    print_header()
    
    if not check_docker():
        return
    
    if start_services():
        open_browser()
        show_info()
        
        try:
            # Keep the script running to show logs
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n\n🛑 Stopping services...")
            subprocess.run(["docker-compose", "down"], check=True)
            print("✅ Services stopped. Thank you for using Astro AI Assistant!")

if __name__ == "__main__":
    main()