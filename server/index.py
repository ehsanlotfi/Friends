from flask import Flask, jsonify
from transformers import pipeline
import sqlite3

# بارگذاری مدل 
pipe = pipeline("token-classification", model="AbdulSami/bert-base-cased-cefr")

app = Flask(__name__)

# تعریف سطوح CEFR 
cefr_levels = {
    'A1': 1,
    'A2': 2,
    'B1': 3,
    'B2': 4,
    'C1': 5,
    'C2': 6
}

# تابع برای دریافت سطح CEFR بالاترین برای جمله
def get_highest_cefr_level(sentence):
    results = pipe(sentence)
    highest_level = None
    for result in results:
        entity = result['entity']
        if highest_level is None or cefr_levels[entity] > cefr_levels[highest_level]:
            highest_level = entity
    # بازگرداندن عدد مربوط به سطح CEFR
    return cefr_levels[highest_level] if highest_level else None

# اتصال به دیتابیس
def connect_db():
    conn = sqlite3.connect('subtitle.db')  # نام فایل دیتابیس خود را جایگزین کنید
    return conn

# به‌روزرسانی سطوح CEFR جملات در جدول Translates
def update_cefr_levels():
    conn = connect_db()
    cursor = conn.cursor()
    print("Hello, World 1") 
    # دریافت تمام جمله‌ها از جدول
    cursor.execute("SELECT id, Content FROM Translates")
    rows = cursor.fetchall()
    print("Hello, World 2") 
    for row in rows:
        sentence_id = row[0]
        sentence = row[1]
        print("Hello, World 3", row[0]) 
        # دریافت سطح CEFR بالاترین برای جمله
        highest_level = get_highest_cefr_level(sentence)

        if highest_level:
            # به‌روزرسانی ستون level با سطح CEFR مربوطه
            cursor.execute("UPDATE Translates SET level = ? WHERE id = ?", (highest_level, sentence_id))
            print("Hello, World 4", highest_level) 
    conn.commit()
    conn.close()
    print("Hello, World 5") 

@app.route('/update_levels', methods=['POST'])
def update_levels():
    try:
        update_cefr_levels()
        return jsonify({'message': 'CEFR levels updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# سرویس اصلی
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5095)
