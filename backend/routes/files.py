from flask import Blueprint, request, jsonify
import os
import re
from datetime import datetime, timedelta

from config import ROOT_FOLDER
BASE_DIR = ROOT_FOLDER


bp = Blueprint('files', __name__)
@bp.route('/api/files', methods=['GET'])
def get_files():
    def get_file_tree(directory):
        tree = []
        for item in os.listdir(directory):
            item_path = os.path.join(directory, item)
            if os.path.isdir(item_path):
                tree.append({'name': item, 'type': 'folder', 'children': get_file_tree(item_path)})
            else:
                tree.append({'name': item, 'type': 'file', 'path': item_path.replace(BASE_DIR, '')})
        return tree

    file_tree = get_file_tree(BASE_DIR)
    return jsonify(file_tree)

@bp.route('/api/file', methods=['GET'])
def get_file():
    path = request.args.get('path')
    file_path = os.path.join(BASE_DIR, path.lstrip('/'))
    try:
        with open(file_path, 'r') as file:
            content = file.read()
        return jsonify({'content': content})
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404

@bp.route('/api/file', methods=['POST'])
def save_file():
    data = request.get_json()
    path = data['path']
    content = data['content']
    file_path = os.path.join(BASE_DIR, path.lstrip('/'))
    try:
        with open(file_path, 'w') as file:
            file.write(content)
        return jsonify({'message': 'File saved!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@bp.route('/api/search', methods=['GET'])
def search_files():
    query = request.args.get('query', '').lower()
    results = []

    for root, dirs, files in os.walk(BASE_DIR):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, BASE_DIR)
                with open(file_path, 'r') as f:
                    content = f.read().lower()
                    if query in content:
                        matches = re.findall(f'.{{0,50}}{re.escape(query)}.{{0,50}}', content, re.IGNORECASE)
                        results.append({
                            'path': relative_path,
                            'name': file,
                            'matches': matches
                        })

    return jsonify(results)



@bp.route('/api/create_folder', methods=['POST'])
def create_folder():
    data = request.get_json()
    folder_path = os.path.join(BASE_DIR, data['path'], data['name'])
    try:
        os.makedirs(folder_path)
        return jsonify({'message': 'Folder created successfully'}), 201
    except FileExistsError:
        return jsonify({'error': 'Folder already exists'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/api/create_file', methods=['POST'])
def create_file():
    data = request.get_json()
    print(data)
    file_path = os.path.join(BASE_DIR, data['path'])
    print(data['path'])
    print(BASE_DIR)
    print(os.path.join(BASE_DIR, data['path']))
    print(file_path)
    try:
        with open(file_path, 'w') as f:
            f.write(data['content'])
        return jsonify({'message': 'File created successfully'}), 201
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
