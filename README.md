# Nebula_Dash
Dashboard application built with Python, Flask, Folium, SQL and HTML5/CSS3. Dashboard features earthquake data visualization done on the world map. Users need to create an account to view the visuals, download dataset and write articles.

##### INSTRUCTIONS:

Before running the project locally make sure you have following things installed:
1. Python 3.6 (Anaconda Framework preferred)
2. MySQL & Apache or WAMP or XAMPP
3. Python packages:
  flask, pymysql, wtforms, pass_lib, folium, ipywidgets
  

To run the app go through the following steps:
1. Make sure you install all the packages with following command.
```
>> python -r requirements.txt
```

2. Create a database in MySql and use it:
```
>> CREATE DATABASE <db_name>;

>> USE <db_name>;
```

3. Create two tables as follows:
```
>> CREATE TABLE users(id INT(10), name VARCHAR(30) , email VARCHAR(50), username VARCHAR(30), password VARCHAR(100), register_date TIMESTAMP CURRENT_TIMESTAMP);

>> CREATE TABLE articles(id INT(10) AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) , author VARCHAR(100), body TEXT, create_date TIMESTAMP CURRENT_TIMESTAMP);
```

4. Once databases are created then you can run the app from commandline using
  ```
>> python app.py
```

![Image of Yaktocat](https://octodex.github.com/images/yaktocat.png)
