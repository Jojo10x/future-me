import os
import sys
from django.db import connections
from django.db.utils import OperationalError

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'goals_backend.settings')

    # Check database connection
    try:
        connection = connections['default']
        connection.ensure_connection()
        print("Database connection successful!")
    except OperationalError:
        print("Database connection failed. Please check your settings.")

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
