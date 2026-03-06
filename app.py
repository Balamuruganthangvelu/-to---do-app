from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

# Use Neon database from Render environment
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)

with app.app_context():
    db.create_all()

# POST to /tasks (same route)
@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    print("Received:", data)

    new_task = Task(content=data.get('text'))
    db.session.add(new_task)
    db.session.commit()

    return jsonify({'message': 'Task added successfully'})

# GET from /tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([{'id': task.id, 'content': task.content} for task in tasks])

@app.route("/")
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)