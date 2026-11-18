import sqlite3 as sql
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

@app.route('/subPage1')
def secondPage():
    return render_template('test2.html')

#Logic:
def initDB()->None: #change in the feture need MASSIVE changes!
    full_path = os.path.dirname(os.path.abspath(__file__))
    conn = sql.connect(os.path.join(full_path,'mydb.db'))
    cursor = conn.cursor()
    cursor.execute(
        '''CREATE TABLE IF NOT EXISTS dnd_char (
        id INTEGER PRIMARY KEY,
        strength INTEGER,
        dexterity INTEGER,
        constitution INTEGER,
        wisdom INTEGER,
        intelligence INTEGER,
        charisma INTEGER
        )'''
        )
    conn.commit()
    conn.close()

#Power up the function .db
initDB()

#Recive data
@app.route('/save/character', methods=['POST'])
def save_stats(FULL_PATH):
    data = request.get_json() #goes straight here.

    #unpack
    stre = data.get('strength')
    dexterity = data.get('dexterity')
    constitution = data.get('constitution')
    wisdom = data.get('wisdom')
    intelligence = data.get('intelligence')
    charisma = data.get('charisma')

    conn = sql.connect(os.path.join(full_path, 'mydb.db'))
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO dnd_char (strength, dexterity, constitution, wisdom, intelligence, charisma)
    VALUES (?,?,?,?,?,?)
    ''',(stre, dexterity, constitution, wisdom, intelligence, charisma))

    conn.commit()
    conn.close()

    return jsonify({'stats':'success','message':'Character saved successfully!'})

if __name__ == "__main__":
    app.run(debug=True, port=5000)