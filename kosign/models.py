from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.String(32))
    password = db.Column(db.String(128))  



class SignUser(db.Model):
    __tablename__ = 'signuser'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32))
    duration_time = db.Column(db.Integer)


class SignTypeUser(db.Model):
    __tablename__ = 'signtypeuser'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32))
    duration_time = db.Column(db.Integer)
    study_type = db.Column(db.String(10))