import sqlite3
from flask import Flask, request, jsonify, render_template
import os

#-----------------------------------------------------------------#
#step 1 always create a table, without it no data will be stored
#to make things first its needed to be pointed at witha a "cursur"
#and then used a build in function called ".execute([code inside just like in sql])"
#id INTEGER PRIMARY KEY basically counts it self as the db grows.
# cursur.execute("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, name TEXT)")

#How do I insert data into that thing? Again use .execute([CODE])
#and use the next following syntax "INSERT INTO [table name] VALUES ()"
#More over if you want to insert specefic values into the table values after the table name do
#INSERT INTO [table name] ([varaible name]....) VALUES ('strings' or integers)
# cursur.execute("INSERT INTO user (name) VALUES ('Kiril')")
# cursur.execute("INSERT INTO user (name) VALUES ('alex')")

# cursur.execute("SELECT * FROM user")

# print(cursur.fetchall())

#To prevent data/memory leacks
#-----------------------------------------------------------------#
FULL_PATH = full_path=os.path.dirname(os.path.abspath(__file__))
#DND BS

app = Flask(__name__)

#Templates!
@app.route('/')
def home():
    return render_template('mySite.html')

#Logic:
def giveDB():
    full_path = os.path.dirname(os.path.abspath(__file__))
    conn = sqlite3.connect(os.path.join(full_path,'mydb.db'))
    conn.row_factory = sqlite3.Row
    return conn

def initDB()->None: #change in the feture need MASSIVE changes!
    conn = giveDB()
    cursor = conn.cursor()
    cursor.execute(
        '''CREATE TABLE IF NOT EXISTS dnd_char (
        id INTEGER PRIMARY KEY,
        stats STRING
        )'''
        )
    conn.commit()
    conn.close()

#Power up the function .db
initDB()

if __name__ == "__main__":
    app.run(debug=True, port=5000)