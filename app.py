from flask import Flask, request, jsonify, send_file, render_template, Response
from werkzeug.utils import secure_filename
import os
from backend import process_pdfs_in_folder_bart  # Updated with correct function

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'output'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER

progress = 0  # Global variable for tracking progress

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/progress')
def get_progress():
    """Sends progress updates to the frontend"""
    def generate():
        global progress
        while progress < 100:
            yield f"data: {progress}\n\n"
            import time
            time.sleep(0.5)
    return Response(generate(), mimetype='text/event-stream')

@app.route('/summarize', methods=['POST'])
def summarize():
    """Handles the PDF summarization and tracks progress"""
    global progress
    progress = 0

    # Extract job description from the form
    job_description = request.form.get('job_description')
    if not job_description:
        return jsonify({'error': 'Job description is required'}), 400
    
    # Check if files were uploaded
    if 'files[]' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    files = request.files.getlist('files[]')
    if not files:
        return jsonify({'error': 'No selected file'}), 400

    # Create folder for uploaded files
    folder_name = os.path.dirname(files[0].filename)
    folder_path = os.path.join(app.config['UPLOAD_FOLDER'], folder_name)
    os.makedirs(folder_path, exist_ok=True)

    # Save each uploaded PDF file
    for file in files:
        if file and file.filename.endswith('.pdf'):
            filename = secure_filename(file.filename)
            file_path = os.path.join(folder_path, filename)
            file.save(file_path)

    # Define output file path for the summarized DOCX file
    output_docx_path = os.path.join(app.config['OUTPUT_FOLDER'], f'{folder_name}_summary.docx')
    
    # Progress callback to track progress
    def progress_callback(value):
        global progress
        progress = value

    # Process PDFs and generate summaries
    top_scorers = process_pdfs_in_folder_bart(folder_path, output_docx_path, job_description, progress_callback)

    # Convert any float32 types to regular float for JSON serialization
    top_scorers = [(filename, float(similarity)) for filename, similarity in top_scorers]

    # Return the summarized result as a JSON response
    return jsonify({'message': 'Summarization complete', 'top_scorers': top_scorers})

@app.route('/download-summary')
def download_summary():
    """Allows the user to download the generated DOCX summary"""
    summary_files = [f for f in os.listdir(app.config['OUTPUT_FOLDER']) if f.endswith('_summary.docx')]
    if summary_files:
        return send_file(os.path.join(app.config['OUTPUT_FOLDER'], summary_files[0]), as_attachment=True)
    else:
        return jsonify({'error': 'No summary file found'}), 404

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)
    app.run(debug=True)

#Job description example
#it systems administrator ,our client is a growing boutique law firm specializing in intellectual property litigation ,located across from grand central station making for easy commutes ,the firm has earned a place among the top ip litigation firms in the country and recently opened an office in dc ,enjoy a social culture a beautiful office space and expansive room for career growth ,compensation and benefits compete even with top global firms ,the team is tightknit and considers both experience and ability to work well with the group when interviewing candidates ,please note that this is an inoffice position that will require occasional offsite travel to other offices sf and dc as well as for trial ,the it system administrator provides assistance to the it department in an effort to operate and maintain the technology infrastructure and services that meet the needs of a fastgrowing law firm ,this individual will work at the direction of the senior it director and be involved in the research planning and design phases of largescale projects that involve the implementation of new technology and scaling existing firm technology ,this individual will also work alongside a managed service provider and respond to helpdesk tickets as necessary ,this position requires a dedicated and hardworking it professional who is willing to always go the extra mile and critically think on their feet to get the job done ,travel is required for this position ,afterhours and weekend work is required on occasion for this position ,our expectations are that this individual will respond to emergencies on short notice and in a timely manner and travel as the needs arise ,maintain the integrity and continual operation of the firms network as well as any hosted solutions or hosted networks ,maintain the security of the firms information systems and equipment ,review and update technology documentation as needed ,assist with it related aspects of office logistics including but not limited to employee stationoffice moves firm construction and renovation projects and offsite trial sites set up ,provide helpdesk technical support to end users ,train and assist users with conference room technology ,it onboarding account creation for new employees user trainings and follow up ,setup equipment for new employees ,respond to afterhours support requests including potentially needing to go into the office ,you will be considered if you have ,cisco call manager and other cisco hardware ,active directory and group policy management ,ms exchange ,troubleshoot advanced networking issues ,cisco video conferencing ,helpdesk ticketing systems ,minimum  years practical experience working in an it environment ,experience with printers and computer hardware  workstations laptops and mobile devices ,demonstrated knowledge of computer networking  including tcpip protocols routing internet access and vpn ,basic knowledge of change management and network controls ,ability to prioritize and multitask ,deadline and detailoriented ,strong analytical and problemsolving skills ,strong verbal and written communication skills ,accomplished organizational and project management skills ,the firm provides an excellent benefits package including medical almost  of medical costs covered for employee and dependents dental pto  life disability insurance etc ,we are dedicated to exceeding your expectations ,we know applying to jobs is a vulnerable experience so we are transparent and candid mentors who keep your best interests in focus ,check out our active openings at jobs ,hope to meet you soon