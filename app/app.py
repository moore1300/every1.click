from flask import Flask, request, jsonify
import pyodbc
from datetime import datetime

app = Flask(__name__)

# Database connection settings
server = 'adspacetestr.cz2uc46iorql.us-east-2.rds.amazonaws.com'
database = 'db'
username = 'admin'
password = 'M501238d$'
driver = '{ODBC Driver 17 for SQL Server}'

# Connect to the database
def get_db_connection():
    conn_str = f'DRIVER={driver};SERVER={server};DATABASE={database};UID={username};PWD={password}'
    conn = pyodbc.connect(conn_str)
    return conn

# Function to log download events
def log_download(user_ip):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO download_tracking (user_ip) VALUES (?)",
            (user_ip,)
        )
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error logging download: {e}")

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    venmo_username = data.get('venmo_username')
    ads_watched = data.get('ads_watched', 0)
    elapsed_time = data.get('elapsed_time', 0)
    amount_earned = data.get('amount_earned', 0.0)

    if not venmo_username:
        return jsonify({'error': 'Venmo username is required'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert the cashout request into the database
        cursor.execute("""
            INSERT INTO cashout_requests (venmo_username, ads_watched, elapsed_time, amount_earned, request_time)
            VALUES (?, ?, ?, ?, ?)
        """, (venmo_username, ads_watched, elapsed_time, amount_earned, datetime.now()))

        conn.commit()

        # Reset counters (if applicable)
        # This depends on how you store counters, e.g., in a different table or application state

        cursor.close()
        conn.close()

        return jsonify({'message': 'Cashout request recorded successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download', methods=['GET'])
def download():
    user_ip = request.remote_addr
    log_download(user_ip)

    # URL of the file to be downloaded
    file_url = 'https://s3.us-east-2.amazonaws.com/every1.click/%5BOCYRUS-win32-x64+-+Copy.zip'
    return jsonify({'file_url': file_url})

@app.route('/recordemail', methods=['POST'])
def recordemail():
    data = request.json
    email = data.get('email')
    amount_earned = data.get('amount_earned', 0.0)
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO emailrecord (email, amount_earned) VALUES (?,?)", (email,amount_earned))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Email recorded successfully'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)