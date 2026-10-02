import re
import filetype
from datetime import datetime

def validate_name(name):
    if not name:
        return False

    name = name.strip()

    if len(name) < 3 or len(name) > 100:
        return False

    pattern = r'^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$'
    return bool(re.fullmatch(pattern, name))


def validate_email(email):
    if not email:
        return False

    email = email.strip()

    if len(email) < 6 or len(email) > 100:
        return False

    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.fullmatch(pattern, email))


def validate_phone_number(phone):
    if not phone:
        return False

    phone = phone.strip()

    pattern = r'^9[0-9]{8}$'
    return bool(re.fullmatch(pattern, phone))


def validate_password(password):
    if not password:
        return False

    return len(password) >= 8

def validate_files(files):
    if len(files) == 0:
        return False
    
    ALLOWED_EXTENSIONS = {
        "png", "jpg", "jpeg", "gif",
        "mp4", "webm", "mov"
    }

    ALLOWED_MIMETYPES = {
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/webm",
        "video/quicktime"
    }
    
    for file in files:
        if file is None:
            return False

        if file.filename == "":
            return False

        ftype_guess = filetype.guess(file)

        if ftype_guess is None:
            return False

        if ftype_guess.extension not in ALLOWED_EXTENSIONS:
            return False

        if ftype_guess.mime not in ALLOWED_MIMETYPES:
            return False

    return True

def validate_text(text):
    if not text:
        return False

    text = text.strip()

    if len(text) < 3 or len(text) > 100:
        return False

    # Letras, tildes, ñ, ü y espacios
    pattern = r"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$"

    return bool(re.fullmatch(pattern, text))


def validate_location(location):
    if not location:
        return False

    location = location.strip()

    if len(location) < 3 or len(location) > 100:
        return False

    # Letras, números, espacios y . , ' # -
    pattern = r"^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s.,'#-]+$"

    return bool(re.fullmatch(pattern, location))


def validate_datetime(datetime_string):
    if not datetime_string:
        return False

    try:
        selected_datetime = datetime.fromisoformat(datetime_string)
    except ValueError:
        return False

    now = datetime.now()
    min_date = datetime(2000, 1, 1, 0, 0)

    return min_date <= selected_datetime <= now
