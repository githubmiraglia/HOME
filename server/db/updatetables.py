import pandas as pd
import mysql.connector
from mysql.connector import errorcode

# Load the Excel file
file_path = 'DMP_v2.xlsx'
users_df = pd.read_excel(file_path, sheet_name='users')
topscores_df = pd.read_excel(file_path, sheet_name='topscores')
print(users_df)
print(topscores_df)

# Database connection parameters
db_config = {
    'user': 'ADMIN',
    'password': 'admin',
    'host': 'dmp_mysql',
    'database': 'dmp',
    'port':3306
}

# Try to connect to the MySQL database
try:
    print('PASSEI POR AQUI')
    conn = mysql.connector.connect(**db_config)
    print('PASSEI POR ALI')
    cursor = conn.cursor()

    # Create users table if it doesn't exist
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
    # delete all data in users table
    delete_data_users_table = """DELETE FROM users"""
    cursor.execute(delete_data_users_table)

    # Create topscores table if it doesn't exist
    create_topscores_table = """
    CREATE TABLE IF NOT EXISTS topscores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        gameId INT,
        name VARCHAR(255),
        score INT
    )
    """
    cursor.execute(create_topscores_table)
    #delete all data in topscores table
    delete_data_scores_table = """DELETE FROM topscores"""
    cursor.execute(delete_data_scores_table)

    # Insert data into users table
    for index, row in users_df.iterrows():
        insert_user_query = """
        INSERT INTO users (userName, email, password) VALUES (%s, %s, %s)
        """
        cursor.execute(insert_user_query, (row['userName'], row['email'], row['password']))

    # Insert data into topscores table
    for index, row in topscores_df.iterrows():
        insert_score_query = """
        INSERT INTO topscores (gameId, name, score) VALUES (%s, %s, %s)
        """
        cursor.execute(insert_score_query, (row['gameId'], row['name'], row['score']))

    # Commit the changes
    print("ALL DONE CORRECTLY")
    conn.commit()

except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("Something is wrong with your user name or password")
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print("Database does not exist")
    else:
        print(err)
finally:
    # Ensure cursor and connection are closed, if they were created
    try:
        if cursor:
            cursor.close()
    except NameError:
        pass  # Cursor was never created

    try:
        if conn:
            conn.close()
    except NameError:
        pass  # Connection was never created
