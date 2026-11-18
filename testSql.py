import sqlite3 as sql
import os
def showTable():
    full_path = os.path.dirname(os.path.abspath(__file__))
    conn = sql.connect(os.path.join(full_path,'mydb.db'))
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM dnd_char')
    data = cursor.fetchall()
    for id, stre, dex, cons, inte, wis, cha in data:
        print(f'ID:{id}\nStrength:{stre}\nDexterity:{dex}\nConstitution:{cons}\nIntelligance:{inte}\nWisdom:{wis}\nCharisma:{cha}')
    conn.close()

showTable()