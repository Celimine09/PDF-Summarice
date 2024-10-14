from flask import Flask, request, jsonify, send_file, render_template, Response
from werkzeug.utils import secure_filename
import os
from backend import process_pdfs_in_folder_bart

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'output'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER

progress = 0

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/progress')
def get_progress():
    def generate():
        global progress
        while progress < 100:
            yield f"data: {progress}\n\n"
            import time
            time.sleep(0.5)
    return Response(generate(), mimetype='text/event-stream')

@app.route('/summarize', methods=['POST'])
def summarize():
    global progress
    progress = 0
    
    if 'files[]' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    files = request.files.getlist('files[]')
    if not files:
        return jsonify({'error': 'No selected file'}), 400

    folder_name = os.path.dirname(files[0].filename)
    folder_path = os.path.join(app.config['UPLOAD_FOLDER'], folder_name)
    os.makedirs(folder_path, exist_ok=True)

    for file in files:
        if file and file.filename.endswith('.pdf'):
            filename = secure_filename(file.filename)
            file_path = os.path.join(folder_path, filename)
            file.save(file_path)

    output_docx_path = os.path.join(app.config['OUTPUT_FOLDER'], f'{folder_name}_summary.docx')
    
    def progress_callback(value):
        global progress
        progress = value

    top_scorers = process_pdfs_in_folder_bart(folder_path, output_docx_path, progress_callback)

    return jsonify({'message': 'Summarization complete', 'top_scorers': top_scorers})

@app.route('/download-summary')
def download_summary():
    # Assuming there's only one summary file in the output folder
    summary_files = [f for f in os.listdir(app.config['OUTPUT_FOLDER']) if f.endswith('_summary.docx')]
    if summary_files:
        return send_file(os.path.join(app.config['OUTPUT_FOLDER'], summary_files[0]), as_attachment=True)
    else:
        return jsonify({'error': 'No summary file found'}), 404

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)
    app.run(debug=True)