from flask import Flask,request,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask import  Flask,render_template

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)

with app.app_context():
    db.create_all()

@app.route('/add', methods=['POST'])
def add_task():
    data = request.get_json()
    new_task = Task(content=data['content'])
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Task added successfully'})

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([{'id': task.id, 'content': task.content} for task in tasks])

@app.route("/")
def home():
    return render_template('index.html')
if __name__ == '__main__':
    app.run(host="0.0.0.",port=5000,debug=True)