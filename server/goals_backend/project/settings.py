# from pathlib import Path
# # Build paths inside the project like this: BASE_DIR / 'subdir'.
# BASE_DIR = Path(__file__).resolve().parent.parent
# SECRET_KEY = 'django-insecure-y&yfefj(!@f(fq%1_&*7n@lbf5u(#0z1wmin06at4da^zc))c5'
# DEBUG = True
# ALLOWED_HOSTS = []
# INSTALLED_APPS = [
#     'django.contrib.admin',
#     'django.contrib.auth',
#     'django.contrib.contenttypes',
#     'django.contrib.sessions',
#     'django.contrib.messages',
#     'django.contrib.staticfiles',
#     'goals',
#     'corsheaders',
#     'authentication', 
#     'rest_framework',
#     'rest_framework.authtoken',
# ]
# MIDDLEWARE = [
#     'corsheaders.middleware.CorsMiddleware',  # Must be at the top
#     'django.middleware.security.SecurityMiddleware',
#     'django.contrib.sessions.middleware.SessionMiddleware',
#     'django.middleware.common.CommonMiddleware',
#     'django.middleware.csrf.CsrfViewMiddleware',
#     'django.contrib.auth.middleware.AuthenticationMiddleware',
#     'django.contrib.messages.middleware.MessageMiddleware',
#     'django.middleware.clickjacking.XFrameOptionsMiddleware',
# ]
# # Remove CORS_ALLOW_ALL_ORIGINS as it conflicts with credentials
# # CORS_ALLOW_ALL_ORIGINS = True  # Remove this line
# # CORS Configuration
# CORS_ALLOWED_ORIGINS = [
#     'http://localhost:3000',
# ]
# CORS_ALLOW_CREDENTIALS = True  # Add this for credentials support
# # Add CORS allowed headers
# CORS_ALLOW_HEADERS = [
#     'accept',
#     'accept-encoding',
#     'authorization',
#     'content-type',
#     'dnt',
#     'origin',
#     'user-agent',
#     'x-csrftoken',
#     'x-requested-with',
# ]
# # Add CORS allowed methods
# CORS_ALLOW_METHODS = [
#     'DELETE',
#     'GET',
#     'OPTIONS',
#     'PATCH',
#     'POST',
#     'PUT',
# ]
# # Authentication settings
# AUTHENTICATION_BACKENDS = [
#     'django.contrib.auth.backends.ModelBackend',
# ]
# # Session and CSRF settings
# SESSION_COOKIE_SAMESITE = 'Lax'
# SESSION_COOKIE_HTTPONLY = True
# SESSION_COOKIE_SECURE = False  # Set to True in production with HTTPS
# CSRF_COOKIE_SAMESITE = 'Lax'
# CSRF_COOKIE_HTTPONLY = False
# CSRF_COOKIE_SECURE = False  # Set to True in production with HTTPS
# CSRF_USE_SESSIONS = False
# CSRF_COOKIE_NAME = 'csrftoken'
# CSRF_TRUSTED_ORIGINS = ['http://localhost:3000']
# # Rest Framework settings (combine the duplicate entries)
# REST_FRAMEWORK = {
#     'DEFAULT_AUTHENTICATION_CLASSES': [
#         'rest_framework.authentication.SessionAuthentication',
#     ],
#     'DEFAULT_PERMISSION_CLASSES': [
#         'rest_framework.permissions.IsAuthenticated',
#     ],
# }
# ROOT_URLCONF = 'goals_backend.urls'
# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         'DIRS': [],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.debug',
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#             ],
#         },
#     },
# ]
# WSGI_APPLICATION = 'goals_backend.wsgi.application'
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'goals_db',
#         'USER': 'longgoals',
#         'PASSWORD': 'goalsdb',
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }
# AUTH_PASSWORD_VALIDATORS = [
#     {
#         'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
#     },
#     {
#         'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
#     },
# ]
# LANGUAGE_CODE = 'en-us'
# TIME_ZONE = 'UTC'
# USE_I18N = True
# USE_TZ = True
# STATIC_URL = 'static/'
# DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# AUTH_USER_MODEL = 'authentication.User'