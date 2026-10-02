from sqlalchemy import create_engine, Column, Integer, BigInteger, String, ForeignKey, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from datetime import datetime
from werkzeug.utils import secure_filename
import hashlib
import filetype
import os

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306
UPLOAD_FOLDER = os.path.join("static", "uploads")

DATABASE_URL = f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

# --- Models ---

class Region(Base):
    __tablename__ = 'region'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)

    comunas = relationship("Comuna", back_populates="region")


class Comuna(Base):
    __tablename__ = 'comuna'
    
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String(200), nullable=False)
    region_id = Column(BigInteger, ForeignKey('region.id'), nullable=False)

    region = relationship("Region", back_populates="comunas")
    

class Voluntario(Base):
    __tablename__ = 'voluntario'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String(255), nullable=False)
    email = Column(String(80), nullable=False)
    telefono = Column(String(15), nullable=False)
    fecha_registro = Column(DateTime, nullable=False)
    comuna_id = Column(BigInteger, ForeignKey('comuna.id'), nullable=False)
    contrasena = Column(String(255), nullable=False)

    ###confesiones = relationship("Avistamiento", back_populates="voluntario", cascade="all, delete")

class Ave(Base):
    __tablename__ = 'ave'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String(80), nullable=False)


class Avistamiento(Base):
    __tablename__ = 'avistamiento'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    voluntario_id = Column(BigInteger, ForeignKey('voluntario.id'), nullable=False)
    ave_id = Column(BigInteger, ForeignKey('ave.id'), nullable=False)
    fecha_hora = Column(DateTime, nullable=False)
    lugar = Column(String(200), nullable=False)
    descripcion = Column(String(500), nullable=False)
    comuna_id = Column(BigInteger, ForeignKey('comuna.id'), nullable=False)

    voluntario = relationship("Voluntario")
    ave = relationship("Ave")
    comuna = relationship("Comuna")
    registros = relationship("Registro", back_populates="avistamiento")

class Registro(Base):
    __tablename__ = 'registro'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    ruta_archivo = Column(String(300), nullable=False)
    nombre_archivo = Column(String(300), nullable=False)
    avistamiento_id = Column(BigInteger, ForeignKey('avistamiento.id'), nullable=False)

    avistamiento = relationship("Avistamiento", back_populates="registros")

# --- Database Functions ---

def get_user_by_id(id):
    session = SessionLocal()
    user = session.query(Voluntario).filter_by(id=id).first()
    session.close()
    return user

def get_user_by_email(email):
    session = SessionLocal()
    user = session.query(Voluntario).filter_by(email=email).first()
    session.close()
    return user

def get_volunteer_by_username(username):
    session = SessionLocal()
    user = session.query(Voluntario).filter_by(nombre=username).first()
    session.close()
    return user

def get_comuna_by_id(comuna_id):
    session = SessionLocal()
    comuna = session.query(Comuna).filter_by(id=comuna_id).first()
    session.close()
    return comuna

def get_specie_by_id(species_id):
    session = SessionLocal()
    species = session.query(Ave).filter_by(id=species_id).first()
    session.close()
    return species

def create_volunteer(username, email, phone, comuna_id, password):
    session = SessionLocal()
    new_volunteer = Voluntario(nombre=username, email=email, telefono=phone, fecha_registro=datetime.now() ,comuna_id=comuna_id, contrasena=password )
    session.add(new_volunteer)
    session.commit()
    session.close()


def register_volunteer(username, email, phone, comuna_id, region_id, password):
    error_msg = ""
    if get_user_by_email(email) is not None:
        error_msg += "El correo ya esta en uso.\n"
    
    if get_volunteer_by_username(username) is not None:
        error_msg += "El nombre de usuario esta en uso.\n"

    comuna = get_comuna_by_id(comuna_id)
    if comuna is None or str(comuna.region_id) != str(region_id):
        error_msg += "Ingrese una región y comuna validas.\n"

    if error_msg != "":
        return False, error_msg
    
    create_volunteer(username, email, phone, comuna_id, password)
    return True, None

def login_volunteer(username, password):
    a_user = get_volunteer_by_username(username)
    if a_user is None:
        return False, "Usuario o contraseña incorrectos."
    
    if a_user.password != password:
        return False, "Usuario o contraseña incorrectos."
    
    return True, None

def post_sighting(username, bird_type, species_id, region_id, comuna_id, location, date, files):
    error_msg = ""
    volunteer = get_volunteer_by_username(username)
    if volunteer is None:
        error_msg += "Debe registrarse o iniciar sesión para realizar un post.\n"

    if get_specie_by_id(species_id) is None:
        error_msg += "Debe ingresar una de las especies de ave permitidas.\n"

    comuna = get_comuna_by_id(comuna_id)
    if comuna is None or str(comuna.region_id) != str(region_id):
        error_msg += "Ingrese una región y comuna validas.\n"

    if error_msg != "":
        return False, error_msg

    return create_sighting(volunteer.id, bird_type, species_id, comuna_id, location, date, files)

def create_sighting(volunteer_id, bird_type, species_id, comuna_id, location, date, files):
    session = SessionLocal()
    try: 
        new_sighting = Avistamiento(voluntario_id = volunteer_id, ave_id = species_id, fecha_hora = date, lugar = location, descripcion = bird_type, comuna_id = comuna_id)
        session.add(new_sighting)
        session.flush()
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        for file in files:
            _filename = hashlib.sha256(
                secure_filename(file.filename) # nombre del archivo
                .encode("utf-8") # encodear a bytes
                ).hexdigest()
            _extension = filetype.guess(file).extension
            nombre_archivo = f"{_filename}.{_extension}"

            # 2. save img as a file
            ruta_archivo = os.path.join(UPLOAD_FOLDER, nombre_archivo)
            file.save(ruta_archivo)
            new_register = Registro(ruta_archivo = ruta_archivo, nombre_archivo = nombre_archivo, avistamiento_id = new_sighting.id)
            session.add(new_register)
        session.commit()
        return True, None
    except Exception as e:
        session.rollback()
        return False, "Error al crear el avistamiento"

    finally:
        session.close()

def get_all_sightings():
    session = SessionLocal()

    sightings = session.query(Avistamiento).all()

    return session, sightings
