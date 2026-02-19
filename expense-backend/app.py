from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from flask_migrate import Migrate


from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "change-this-secret-key"  

app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

app.config["JWT_TOKEN_LOCATION"] = ["headers"]     

app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql+psycopg2://postgres:%401234rubina@localhost:5432/expense_tracker"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)


class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "amount": self.amount,
            "date": self.date.isoformat(),
        }


@app.before_request
def create_tables():   # This creates tables before the first request. In production, use migrations instead.
    db.create_all()


@app.post("/api/register")
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 400

    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")
    user = User(email=email, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered"}), 201


@app.post("/api/login")
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 401


    access_token = create_access_token(identity=str(user.id))
    return jsonify({"access_token": access_token})


# -------- Protected expense endpoints --------

@app.get("/api/expenses")
@jwt_required()
def list_expenses():
    user_id = int(get_jwt_identity())
    category = request.args.get("category")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    query = Expense.query.filter_by(user_id=user_id)
    if category:
        query = query.filter_by(category=category)
    if start_date:
        query = query.filter(Expense.date >= start_date)
    if end_date:
        query = query.filter(Expense.date <= end_date)

    expenses = query.order_by(Expense.date.desc()).all()
    return jsonify([e.to_dict() for e in expenses])


@app.post("/api/expenses")
@jwt_required()
def create_expense():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    expense = Expense(
        title=data["title"],
        category=data["category"],
        amount=float(data["amount"]),
        date=datetime.fromisoformat(data["date"]).date(),
        user_id=user_id,
    )
    db.session.add(expense)
    db.session.commit()
    return jsonify(expense.to_dict()), 201


@app.delete("/api/expenses/<int:expense_id>")
@jwt_required()
def delete_expense(expense_id):
    user_id = int(get_jwt_identity())
    expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first_or_404()
    db.session.delete(expense)
    db.session.commit()
    return "", 204


@app.get("/api/summary")
@jwt_required()
def summary():
    user_id = int(get_jwt_identity())
    expenses = Expense.query.filter_by(user_id=user_id).all()
    total = sum(e.amount for e in expenses)
    per_category = {}
    for e in expenses:
        per_category[e.category] = per_category.get(e.category, 0) + e.amount
    return jsonify({"total": total, "per_category": per_category})


if __name__ == "__main__":
    app.run(debug=True)
