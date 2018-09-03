from flask import Flask, render_template, flash, redirect, url_for, request, session, logging
import pymysql.cursors
import mysql.connector
from wtforms import Form, StringField, TextAreaField, PasswordField, validators
from passlib.hash import sha256_crypt
from functools import wraps
import dash
import dash_renderer
import dash_core_components as dcc
import dash_html_components as html


app = Flask(__name__)

# Config MySQL
# app.config['MYSQL_HOST'] = 'localhost'
# app.config['MYSQL_USER'] = 'root'
# app.config['MYSQL_PASSWORD'] = 'Pratik@150692'
# app.config['MYSQL_DB'] = 'myFlaskDash'
# app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
# #init MySQL
# mysql = mysql.connector.connect(app)
connection = pymysql.connect(host='localhost',
                            user='root',
                            password='Pratik@150692',
                            db='myflaskdash',
                            cursorclass=pymysql.cursors.DictCursor)


@app.route('/')
def index():
	return render_template('index.html')



@app.route('/visuals')
def visuals():
	return render_template('map.html')



# User Authorization
def is_logged_in(f):
	@wraps(f)
	def wrap(*args, **kwargs):
		if 'logged_in' in session:
			return f(*args, **kwargs)
		else:
			flash('Unauthorized!! Please Log in.', 'danger')
			return redirect(url_for('login'))
	return wrap



# Earthquake Dataset
@app.route('/datasets')
@is_logged_in
def datasets():
	return render_template('earthquake.html')



# Articles
@app.route('/articles')
def articles():
	cur = connection.cursor()
	result = cur.execute("SELECT * FROM articles")
	articles = cur.fetchall()

	if result > 0:
		return render_template('articles.html', articles = articles)
	else:
		msg = 'No Article Found'
		return render_template('articles.html', msg = msg)
	cur.close()



# Single Article
@app.route('/article/<string:id>/')
def article(id):
	cur = connection.cursor()
	result = cur.execute("SELECT * FROM articles WHERE id = %s", [id])
	article = cur.fetchone()
	return render_template('article.html', article = article)



#Register Form Class
class RegisterForm(Form):
	name = StringField('Name', [validators.Length(min=1, max=50)])
	username = StringField('Username', [validators.Length(min=3, max=15)])
	email = StringField('Email', [validators.Length(min=4, max=45)])
	password = PasswordField('Password', [
		validators.DataRequired(),
		validators.EqualTo('confirm', message = 'Passwords do not match')
	])
	confirm = PasswordField('Confirm Password')



#User Register
@app.route('/register', methods = ['GET', 'POST'])
def register():
	form = RegisterForm(request.form)
	if request.method == 'POST' and form.validate():
		name = form.name.data
		email = form.email.data
		username = form.username.data
		password = sha256_crypt.encrypt(form.password.data)

		#Create cursor
		cur = connection.cursor()
		cur.execute("INSERT INTO users(name, email, username, password) VALUES(%s, %s, %s, %s)", (name, email, username, password))

		connection.commit()

		cur.close()

		flash('You are now registered and can now log in', 'success')

		return redirect(url_for('login'))
	return render_template('register.html', form = form)



# User Login
@app.route('/login', methods = ['GET', 'POST'])
def login():
	if request.method == 'POST':
		# Get Form Fields
		username = request.form['username']
		password_candidate = request.form['password']

		#Create Cursor
		cur = connection.cursor()

		#Get User by username
		result = cur.execute("SELECT * FROM users WHERE username = %s", [username])
		if result > 0:
			data = cur.fetchone();
			password = data['password']

			if sha256_crypt.verify(password_candidate, password):
				app.logger.info('PASSWORD MATCHED')
				session['logged_in'] = True
				session['username'] = username
				flash('You are now logged in', 'success')
				return redirect(url_for('dashboard'))
			else:
				error = 'Invalid Login. Please Re-enter credentials.'
				return render_template('login.html', error = error)
			cur.close()
		else:
			error = 'Username Not Found'
			return render_template('login.html', error = error)		

	return render_template('login.html')



# Logout
@app.route('/logout')
def logout():
	session.clear()
	flash('You are now logged out', 'success')
	return redirect(url_for('login'))



# Dashboard
@app.route('/dashboard')
@is_logged_in
def dashboard():
	cur = connection.cursor()
	result = cur.execute("SELECT * FROM articles")
	articles = cur.fetchall()

	if result > 0:
		return render_template('dashboard.html', articles = articles)
	else:
		msg = 'No Articles Found'
		return render_template('dashboard.html', msg = msg)

	cur.close()



# Article Form Class
class ArticleForm(Form):
	title = StringField('Title', [validators.Length(min=1, max=100)])
	body = TextAreaField('Body', [validators.Length(min=20)])



# Add Article
@app.route('/add_article', methods=['GET', 'POST'])
@is_logged_in
def add_article():
	form = ArticleForm(request.form)
	if request.method == 'POST' and form.validate():
		title = form.title.data
		body = form.body.data

		cur = connection.cursor()
		cur.execute("INSERT INTO articles(title, body, author) VALUES(%s, %s, %s)", (title, body, session['username']))
		connection.commit()
		cur.close()

		flash('Article Created', 'success')
		return redirect(url_for('dashboard'))

	return render_template('add_article.html',form = form)



# Edit Article
@app.route('/edit_article/<string:id>', methods=['GET', 'POST'])
@is_logged_in
def edit_article(id):
	# Create cursor
	cur = connection.cursor()
	cur.execute("SELECT * FROM articles WHERE id =%s", [id])
	article = cur.fetchone()

	form = ArticleForm(request.form)

	form.title.data = article['title']
	form.body.data = article['body']

	if request.method == 'POST' and form.validate():
		title = request.form['title']
		body = request.form['body']

		cur = connection.cursor()
		cur.execute("UPDATE articles SET title = %s, body = %s WHERE id = %s", (title, body, id))
		connection.commit()
		cur.close()

		flash('Article Updated', 'success')
		return redirect(url_for('dashboard'))

	return render_template('edit_article.html',form = form)



# Delete Article
@app.route('/delete_article/<string:id>', methods = ['POST'])
@is_logged_in
def delete_article(id):
	# Create cursor
	cur = connection.cursor()
	cur.execute("DELETE FROM articles WHERE id =%s", [id])
	connection.commit()
	cur.close()
	flash('Article Deleted', 'success')
	return redirect(url_for('dashboard'))



# Datasets
# @app.route('/datasets')
# def datasets():
# 	cur = connection.cursor()
# 	result = cur.execute("SELECT * FROM datasets")
# 	datasets = cur.fetchall()

# 	if result > 0:
# 		return render_template('datasets.html', datasets = datasets)
# 	else:
# 		msg = 'No Dataset Found'
# 		return render_template('datasets.html', msg = msg)
# 	cur.close()



# Single Dataset
@app.route('/dataset/<string:id>/')
def dataset(id):
	cur = connection.cursor()
	result = cur.execute("SELECT * FROM datasets WHERE id = %s", [id])
	dataset = cur.fetchone()
	return render_template('dataset.html', dataset = dataset)



# Dataset Form Class
class DatasetForm(Form):
	title = StringField('Title', [validators.Length(min=1, max=100)])
	body = TextAreaField('Body', [validators.Length(min=20)])



# Add Dataset
@app.route('/add_dataset', methods=['GET', 'POST'])
@is_logged_in
def add_dataset():
	form = DatasetForm(request.form)
	if request.method == 'POST' and form.validate():
		title = form.title.data
		body = form.body.data

		cur = connection.cursor()
		cur.execute("INSERT INTO datasets(title, body, author) VALUES(%s, %s, %s)", (title, body, session['username']))
		connection.commit()
		cur.close()

		flash('Dataset Added', 'success')
		return redirect(url_for('dashboard'))

	return render_template('add_dataset.html', form = form)



# Edit Dataset
@app.route('/edit_dataset/<string:id>', methods=['GET', 'POST'])
@is_logged_in
def edit_dataset(id):
	# Create cursor
	cur = connection.cursor()
	cur.execute("SELECT * FROM datasets WHERE id =%s", [id])
	dataset = cur.fetchone()

	form = DatasetForm(request.form)

	form.title.data = dataset['title']
	form.body.data = dataset['body']

	if request.method == 'POST' and form.validate():
		title = request.form['title']
		body = request.form['body']

		cur = connection.cursor()
		cur.execute("UPDATE datasets SET title = %s, body = %s WHERE id = %s", (title, body, id))
		connection.commit()
		cur.close()

		flash('Dataset Details Updated', 'success')
		return redirect(url_for('dashboard'))

	return render_template('edit_dataset.html',form = form)



# Delete Article
@app.route('/delete_dataset/<string:id>', methods = ['POST'])
@is_logged_in
def delete_dataset(id):
	# Create cursor
	cur = connection.cursor()
	cur.execute("DELETE FROM datasets WHERE id =%s", [id])
	connection.commit()
	cur.close()
	flash('Dataset Deleted', 'success')
	return redirect(url_for('dashboard'))



if __name__ == '__main__':
	app.secret_key = 'secret123'
	app.run(debug = True)