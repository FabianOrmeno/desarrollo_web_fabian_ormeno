from flask import Flask, request, render_template, redirect, url_for, jsonify, session
from database import db
from werkzeug.utils import secure_filename
import hashlib
import filetype
import os
from utils import validation as v

UPLOAD_FOLDER = '/static/uploads'


app = Flask(__name__)


app.secret_key = "s3cr3t_k3y"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000

# --- Auth Routes ---
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("pass")
        phone = request.form.get("phone")
        email = request.form.get("email")
        region_id = request.form.get("region_id")
        comuna_id = request.form.get("comuna_id")
        error = ""
        if not v.validate_name(username):
            error+="El nombre debe tener entre 3 y 100 caracteres y contener solo letras y espacios.\n"

        if not v.validate_email(email):
            error+="El email no tiene un formato válido.\n"

        if not v.validate_phone_number(phone):
            error+="El teléfono debe tener 9 dígitos y comenzar con 9.\n"

        if not v.validate_password(password):
            error+="La contraseña debe tener al menos 8 caracteres.\n"

        if error == "":
            # try to register user
            status, msg = db.register_volunteer(username, email, phone, comuna_id, region_id, password)
            if status:
                # set user field in session
                session["user"] = username
                return render_template("registered.html")
            error += msg

        db_session = db.SessionLocal()
        regiones = db_session.query(db.Region).all()
        db_session.close()

        return render_template("register.html", error=error, regiones=regiones)
    
    elif request.method == "GET":

        db_session = db.SessionLocal()
        regiones = db_session.query(db.Region).all()
        db_session.close()

        return render_template("register.html", regiones=regiones)

@app.route("/sighting", methods=["GET"])
def sighting():
    if request.method == "POST":
        error = ""
        if "user" not in session:
            error = "Debe registrarse o iniciar sesión para poder registrar un avistamiento"
        else:
            username = session["user"]
            bird_type = request.form.get("type")
            species_id = request.form.get("species_id")
            region_id = request.form.get("region_id")
            comuna_id = request.form.get("comuna_id")
            location = request.form.get("location")
            date = request.form.get("datetime")
            files = request.files.getlist("files")
            error = ""
            if not v.validate_text(bird_type):
                error += "El tipo de ave debe tener entre 3 y 100 caracteres y contener solo letras y espacios.\n"

            if not v.validate_location(location):
                error += "El lugar debe tener entre 3 y 100 caracteres.\n"

            if not v.validate_datetime(date):
                error += "La fecha no puede ser en el futuro o antes del 2000.\n"

            if not v.validate_files(files):
                error += "Los archivos deben ser images o videos validoss.\n"

            if error == "":
                # try to register user
                status, msg = db.post_sighting(username, bird_type, species_id, region_id, comuna_id, location, date, files)
                if status:
                    return redirect(url_for("index"))

                error += msg

        db_session = db.SessionLocal()
        especies = db_session.query(db.Ave).all()
        regiones = db_session.query(db.Region).all()
        db_session.close()

        return render_template("sighting.html", error=error, regiones=regiones, especies=especies)
    elif request.method == "GET":
        
        db_session = db.SessionLocal()
        regiones = db_session.query(db.Region).all()
        especies = db_session.query(db.Ave).all()
        db_session.close()
        
        return render_template("sighting.html", regiones=regiones, especies=especies)

@app.route("/data", methods=["GET"])
def data():
    page = request.args.get("page", 1, type=int)

    filter_species = request.args.get("filter-species", "").strip()
    order = request.args.get("select-order", "")

    db_session = db.SessionLocal()

    sightings = db_session.query(db.Avistamiento).all()

    if filter_species:
        sightings = [
            sighting
            for sighting in sightings
            if filter_species.lower() in sighting.ave.nombre.lower()
        ]

    if order == "datetime":
        sightings.sort(key=lambda sighting: sighting.fecha_hora)

    elif order == "comuna":
        sightings.sort(key=lambda sighting: sighting.comuna.nombre.lower())

    posts_per_page = 2

    total_sightings = len(sightings)
    total_pages = (total_sightings + posts_per_page - 1) // posts_per_page

    start = (page - 1) * posts_per_page
    end = start + posts_per_page

    sightings_data = list(map(lambda post: {
        "id": post.id,
        "nombre": post.ave.nombre,
        "tipo": post.descripcion,
        "voluntario": post.voluntario.nombre,
        "region": post.comuna.region.nombre,
        "comuna": post.comuna.nombre,
        "fecha": post.fecha_hora
    }, sightings))

    sightings_to_show = sightings_data[start:end]
    db_session.close()

    return render_template(
        "data.html",
        sightings=sightings_to_show,
        page=page,
        total_pages=total_pages,
        filter_species=filter_species,
        order=order
    )


@app.route("/sighting/<int:sighting_id>", methods=["GET"])
def sighting_detail(sighting_id):
    db_session = db.SessionLocal()
    sighting = db_session.query(db.Avistamiento).filter_by(id=sighting_id).first()
    if sighting is None:
        db_session.close()
        return redirect(url_for("index"))
    data = {
        "id": sighting.id,
        "nombre": sighting.ave.nombre,
        "tipo": sighting.descripcion,
        "voluntario": sighting.voluntario.nombre,
        "region": sighting.comuna.region.nombre,
        "comuna": sighting.comuna.nombre,
        "lugar": sighting.lugar,
        "fecha": sighting.fecha_hora,
        "registros": list(map(lambda x: x.nombre_archivo, sighting.registros))
    }
    db_session.close()
    return render_template("sighting-detail.html", sighting=data)



@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("contrasenna")
        error = ""
        if False:
            # try to login
            status, msg = db.login_user(username, password)
            if status:
                # set user field in session
                session["user"] = username
                return redirect(url_for("index"))
            error += msg
        else:
            error += "Uno de los campos no es valido."

        print(error)

        return render_template("login.html",error=error)
    
    elif request.method == "GET":
        if session.get("user", None):
            return redirect(url_for("index"))
        else:
            return render_template("login.html")

@app.route("/logout", methods=["GET"])
def logout():
    session.pop("user", None)
    return redirect(url_for("login"))



# --- Routes ---
@app.route("/", methods=["GET"])
def index():
    sighted = session.pop("sighted", None)
    db_session = db.SessionLocal()
    avistamientos_recientes = db_session.query(db.Avistamiento).order_by(db.Avistamiento.fecha_hora.desc()).limit(2).all()
    info = []
    for sighting in avistamientos_recientes:
        info.append({
            "voluntario": sighting.voluntario.nombre,
            "ave": sighting.ave.nombre,
            "region": sighting.comuna.region.nombre,
            "comuna": sighting.comuna.nombre,
            "fecha": sighting.fecha_hora
        })
    db_session.close()
    return render_template("home.html", info = info, sighted = sighted)

@app.route("/menu", methods=["POST"])
def menu():

    accion = request.form.get("accion")

    if accion == "voluntario":
        return redirect(url_for("register"))

    elif accion == "avistamiento":
        return redirect(url_for("sighting"))

    elif accion == "ver_avistamientos":
        return redirect(url_for("data"))

    return redirect(url_for("index"))


@app.route("/comunas/<int:region_id>", methods=["GET"])
def obtener_comunas(region_id):
    db_session = db.SessionLocal()
    comunas = db_session.query(db.Comuna).filter_by(region_id=region_id).all()
    db_session.close()
    return jsonify([
        {
            "id": comuna.id,
            "nombre": comuna.nombre
        }
        for comuna in comunas
    ])


@app.route("/post-sighting", methods=["POST"])
def post_sighting():
    error = ""
    if "user" not in session:
        error = "Debe registrarse o iniciar sesión para poder registrar un avistamiento"
    else:
        username = session["user"]
        bird_type = request.form.get("type")
        species_id = request.form.get("species_id")
        region_id = request.form.get("region_id")
        comuna_id = request.form.get("comuna_id")
        location = request.form.get("location")
        date = request.form.get("datetime")
        files = request.files.getlist("files")
        error = ""
        if not v.validate_text(bird_type):
            error += "El tipo de ave debe tener entre 3 y 100 caracteres y contener solo letras y espacios.\n"

        if not v.validate_location(location):
            error += "El lugar debe tener entre 3 y 100 caracteres.\n"

        if not v.validate_datetime(date):
            error += "La fecha no puede ser en el futuro o antes del 2000.\n"

        if not v.validate_files(files):
            error += "Los archivos deben ser images o videos validoss.\n"

        if error == "":
            # try to register user
            status, msg = db.post_sighting(username, bird_type, species_id, region_id, comuna_id, location, date, files)
            if status:
                session["sighted"] = db.get_specie_by_id(species_id).nombre
                return redirect(url_for("index"))

            error += msg

    db_session = db.SessionLocal()
    especies = db_session.query(db.Ave).all()
    regiones = db_session.query(db.Region).all()
    db_session.close()

    return render_template("sighting.html", error=error, regiones=regiones, especies=especies)


if __name__ == "__main__":
    app.run(debug=True)
