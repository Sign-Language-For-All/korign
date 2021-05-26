from flask import Flask, render_template

from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from flask import request
from models import db
# import config

app = Flask(__name__)

import os

# 현재있는 파일의 디렉토리 절대경로
basdir = os.path.abspath(os.path.dirname(__file__))
# basdir 경로안에 DB파일 만들기
dbfile = os.path.join(basdir, 'db.sqlite')

# SQLAlchemy 설정

# 내가 사용 할 DB URI
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + dbfile
# 비지니스 로직이 끝날때 Commit 실행(DB반영)
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
# 수정사항에 대한 TRACK
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# SECRET_KEY
app.config['SECRET_KEY'] = 'jqiowejrojzxcovnklqnweiorjqwoijroi'

db.init_app(app)
db.app = app
db.create_all()
migrate = Migrate(app, db)

from models import User,SignUser,SignTypeUser
import json 
# @app.route('/')
# def index():
#     user_list = User.query.all()

#     return render_template('index_prev.html',user_list=user_list)
    
jaeum_prev2cur = {
    'g':'n','n':'d','d':'r','r':'m','m':'b','b':'s','s':'ng',
    'ng':'j','j':'ch','ch':'k','k':'t','t':'p','p':'h'
}
moeum_prev2cur = {
   "a":"ya","ya":"eo","eo":"yeo","yeo":"fin_mo"
}

@app.route('/info')
def info():
    return render_template('info.html')

@app.route('/index')
def index():
    username = request.args.get('username')
    print('[DEBUG] username',username)
    option2ref = {
        '자음연습':'g',
        '모음연습':'a'
    }
    return render_template('index.html',option2ref = option2ref,username=username)

@app.route('/korign/<string:ref>/<string:username>')
def korign(ref,username):
    print('ref',ref)
    sec = request.args.get('sec',0)
    print(sec,type(sec))
    print(username,type(username))

    if ref in jaeum_prev2cur.keys():
        image_file = 'dataset/ja-eum/pic/%s.png'%(ref)
        f = open('./static/dataset/ja-eum/%s.json'%(ref))
        data_json = json.load(f)
        f.close()
    elif ref in moeum_prev2cur.keys():
        image_file = 'dataset/mo-eum/pic/%s.png'%(ref)
        f = open('./static/dataset/mo-eum/%s.json'%(ref))
        data_json = json.load(f)
        f.close()

    return render_template('korign.html',data_json = data_json,image_file=image_file,cur=ref,sec=sec,username=username)

    print('ref',ref)
    if ref == 'g' or ref == 'a': # new start 
        if ref in jaeum_prev2cur.keys():
            image_file = 'dataset/ja-eum/pic/%s.png'%(ref)
            f = open('./static/dataset/ja-eum/%s.json'%(ref))
            data_json = json.load(f)
            f.close()
        elif ref in moeum_prev2cur.keys():
            image_file = 'dataset/mo-eum/pic/%s.png'%(ref)
            f = open('./static/dataset/mo-eum/%s.json'%(ref))
            data_json = json.load(f)
            f.close()
    elif ref == 'h' or ref == 'i':
        pass 
    else:
        if ref in jaeum_prev2cur.keys():
            cur = jaeum_prev2cur[ref]
            image_file = 'dataset/ja-eum/pic/%s.png'%(ref)
            f = open('./static/dataset/ja-eum/%s.json'%(ref))
            data_json = json.load(f)
            f.close()
        elif ref in moeum_prev2cur.keys():
            cur = moeum_prev2cur[ref]
            image_file = 'dataset/mo-eum/pic/%s.png'%(ref)
            f = open('./static/dataset/mo-eum/%s.json'%(ref))
            data_json = json.load(f)
            f.close()

    return render_template('korign.html',data_json = data_json,image_file=image_file,cur=cur)

    if ref == 0: # 자음연습
        f = open('./static/dataset/ja-eum/k.json')
        data_json = json.load(f)
        f.close()
        
    elif ref == 1:
        f = open('./static/dataset/ja-eum/k.json')
        data_json = json.load(f)
        f.close()
    
    return render_template('korign.html',data_json = data_json,image_file="dataset/ja-eum/pic/k.png")

@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/sign_detail')
def sign_detail():
    sec = request.args.get('sec',0)
    username = request.args.get('username',0)
    mode = request.args.get("mode","list") ## update, list 
    print('[sign_detail] sec',sec,"username",username,"mode",mode)

    if mode == 'update':
        what_update = request.args.get("what_update","ja") ## ja, mo 
        print('[sign_detail] what_update',what_update)
        new_user = SignTypeUser(username=username,duration_time=int(sec),study_type=what_update)
        db.session.add(new_user)
        db.session.commit()

    print("[sign_detail] username",username,"sec",sec)

    ja_users = SignTypeUser.query.filter(SignTypeUser.study_type=='ja')
    ja_userDurationList = [[user.username,user.duration_time] for user in ja_users]

    mo_users = SignTypeUser.query.filter(SignTypeUser.study_type=='mo')
    mo_userDurationList = [[user.username,user.duration_time] for user in mo_users]

    def key(x): 
        return x[1]
    ja_userDurationList = sorted(ja_userDurationList,key=key)
    mo_userDurationList = sorted(mo_userDurationList,key=key)
    print("[DEBUG] ja_userDuration_list",ja_userDurationList,"mo_userDuration_list",mo_userDurationList)

    return render_template('sign_detail.html',ja_userDurationList=ja_userDurationList,mo_userDurationList=mo_userDurationList,username=username,sec=sec)



@app.route('/login_check')
def login_check():
    username = request.args.get('username')
    print('[DEBUG] username',username)
  
    return render_template('index.html', username=username) 

@app.route('/detail/<int:id>/')
def user_detail(id):
    print('id:',id)
    user = User.query.get_or_404(id)
    return render_template('detail.html', user=user)


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000)

