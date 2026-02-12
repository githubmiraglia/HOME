import pandas as pd
import mysql.connector
from mysql.connector import errorcode

# ---------------------------------------------------------
# LOAD EXCEL FILES
# ---------------------------------------------------------

# Existing DMP file
dmp_file_path = 'db/DMP_v2.xlsx'
users_df = pd.read_excel(dmp_file_path, sheet_name='users')
topscores_df = pd.read_excel(dmp_file_path, sheet_name='topscores')

# New FG file
fg_file_path = 'db/FG.xlsx'
fgusers_df = pd.read_excel(fg_file_path, sheet_name='fgusers')

print("Loaded USERS:")
print(users_df)

print("Loaded TOPSCORES:")
print(topscores_df)

print("Loaded FGUSERS:")
print(fgusers_df)

# ---------------------------------------------------------
# DATABASE CONFIG
# ---------------------------------------------------------

db_config = {
    'user': 'ADMIN',
    'password': 'admin',
    'host': 'dmp_mysql',
    'database': 'dmp',
    'port': 3306
}

# ---------------------------------------------------------
# CONNECT TO MYSQL
# ---------------------------------------------------------

try:
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    # =====================================================
    # USERS TABLE
    # =====================================================

    create_users_table = """
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userName VARCHAR(255),
        email VARCHAR(255),
        password VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """
    cursor.execute(create_users_table)

    cursor.execute("DELETE FROM users")

    for _, row in users_df.iterrows():
        insert_user_query = """
        INSERT INTO users (userName, email, password)
        VALUES (%s, %s, %s)
        """
        cursor.execute(insert_user_query, (
            row['userName'],
            row['email'],
            row['password']
        ))

    # =====================================================
    # TOPSCORES TABLE
    # =====================================================

    create_topscores_table = """
    CREATE TABLE IF NOT EXISTS topscores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        gameId INT,
        name VARCHAR(255),
        score INT
    )
    """
    cursor.execute(create_topscores_table)

    cursor.execute("DELETE FROM topscores")

    for _, row in topscores_df.iterrows():
        insert_score_query = """
        INSERT INTO topscores (gameId, name, score)
        VALUES (%s, %s, %s)
        """
        cursor.execute(insert_score_query, (
            row['gameId'],
            row['name'],
            row['score']
        ))

    # =====================================================
    # FGUSERS TABLE (NEW)
    # =====================================================

    create_fgusers_table = """
    CREATE TABLE IF NOT EXISTS fgusers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        access VARCHAR(100),
        faces VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
    """
    cursor.execute(create_fgusers_table)

    cursor.execute("DELETE FROM fgusers")

    for _, row in fgusers_df.iterrows():
        insert_fg_query = """
        INSERT INTO fgusers (user, password, access, faces)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_fg_query, (
            row['user'],
            row['password'],   # plain text for now
            row['access'],
            row['faces']       # string like "Pablo,Luis"
        ))

    # =====================================================
    # COMMIT
    # =====================================================

    conn.commit()
    print("ALL TABLES UPDATED SUCCESSFULLY")

except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("Invalid MySQL credentials")
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print("Database does not exist")
    else:
        print(err)

finally:
    try:
        if cursor:
            cursor.close()
    except:
        pass

    try:
        if conn:
            conn.close()
    except:
        pass
