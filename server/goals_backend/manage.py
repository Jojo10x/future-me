"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'goals_backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    # Get the PORT from environment variable for Render deployment
    port = os.environ.get('PORT', '8000')
    
    # If running the runserver command, append the port
    if len(sys.argv) > 1 and sys.argv[1] == 'runserver':
        execute_from_command_line([sys.argv[0], 'runserver', f'0.0.0.0:{port}'])
    else:
        execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()