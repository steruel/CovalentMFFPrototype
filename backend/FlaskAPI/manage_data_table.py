
# coding: utf-8

# In[1]:

##Includes
from flask import request, url_for
from flask_cors import CORS, cross_origin
from flask import Blueprint, render_template, abort
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)


import pickle
import json

import sqlite3

from pandas.io import sql
insert_data_table_project = Blueprint('insert_data_table_project', __name__)
CORS(insert_data_table_project)
CORS(insert_data_table_project,resources={r"/insert_data_table_project/*/": {"origins": "*"}})

get_data_table = Blueprint('get_data_table', __name__)
CORS(get_data_table)
CORS(get_data_table,resources={r"/get_data_table/*/": {"origins": "*"}})

delete_data_table_project = Blueprint('delete_data_table_project', __name__)
CORS(delete_data_table_project)
CORS(delete_data_table_project,resources={r"/delete_data_table_project/*/": {"origins": "*"}})

insert_data_table_model = Blueprint('insert_data_table_model', __name__)
CORS(insert_data_table_model)
CORS(insert_data_table_model,resources={r"/insert_data_table_model/*/": {"origins": "*"}})

delete_data_table_model = Blueprint('delete_data_table_model', __name__)
CORS(delete_data_table_model)
CORS(delete_data_table_model,resources={r"/delete_data_table_model/*/": {"origins": "*"}})
##########

##Pass header=0 if first line in text file contains header
def read_csv_file(filename, seperator, header):
    df = pd.read_csv(filename,sep=seperator,header=header)
    return df

def df_give_columnnames(df,colnames_array):
    df.columns = colnames_array
    return df

def write_json_file(df,filename):
    df.to_json(filename,orient='records')




#http://localhost:5000/get_data_table/flatdata/?dbname=mf&tablename=dataset&limit=20
#http://localhost:5000/get_data_table/flatdata/?dbname=mf&tablename=dataset&limit=
@get_data_table.route("/get_data_table/flatdata/", methods=['GET'])
@cross_origin()
def flatdata():
    list_records = []
    dbname = request.args.get('dbname')
    db_file = 'database/'+dbname+'.db'
    tablename = request.args.get('tablename')
    limit = request.args.get('limit')
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    limit = str(limit)
    print (limit)
    if limit == '' or limit == 'None':
        limit = '100'
    print (limit)
    sql = "select * from "+tablename + " limit "+limit
    print (sql)
    cursor.execute(sql)
    colnames = [description[0] for description in cursor.description]
    rows = cursor.fetchall()

    conn.close()

    for row in rows:
        list_records.append(row)

    df = pd.DataFrame(list_records,columns=colnames)
    json = df.to_json(orient='records')

    return json

@insert_data_table_project.route("/insert_data_table_project/", methods=['GET','POST'])
@cross_origin()
def insert_project():
    list_records = []
    dbname = request.json['dbname']
    tablename = request.json['tablename']
    db_file = 'database/'+dbname+'.db'
    id_project = request.json['id_project']
    name_project = request.json['name_project']
    desc_project = request.json['desc_project']
    path_project = request.json['path_project']
    id_responsible = request.json['id_responsible']
    name_responsible = request.json['name_responsible']
    open_date = request.json['open_date']
    close_date = request.json['close_date']
    is_active = request.json['is_active']

    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    status = "ok"
    try:
        sql = "insert into "+ tablename +" (id_project, name_project, desc_project, path_project, id_responsible, name_responsible, open_date, close_date, is_active) VALUES ('"+id_project+"','"+name_project+"','"+desc_project+"','"+path_project +"','"+str(id_responsible)+"','"+name_responsible+"','"+open_date+"','"+close_date+"','"+str(is_active)+"');"
        print (sql)
        cursor.execute(sql)
        print(cursor.lastrowid)
    except:
        print("error")
        status = "error"

    conn.commit()
    conn.close()
    json = {'status':status}
    return json

@delete_data_table_project.route("/delete_data_table_project/", methods=['GET','POST'])
@cross_origin()
def delete_project():
    list_records = []
    dbname = request.json['dbname']
    tablename = request.json['tablename']
    db_file = 'database/'+dbname+'.db'
    id_project = request.json['id_project']

    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    status = "ok"
    try:
        sql = "delete from "+ tablename +" where id_project='"+id_project+"'"
        print(sql)
        cursor.execute(sql)
        print(cursor.lastrowid)
    except:
        print("error")
        status = "error"

    conn.commit()
    conn.close()
    json = {'status':status}
    return json

@insert_data_table_model.route("/insert_data_table_model/", methods=['GET','POST'])
@cross_origin()
def insert_model():
    list_records = []
    dbname = request.json['dbname']
    tablename = request.json['tablename']
    db_file = 'database/'+dbname+'.db'
    id_project = request.json['id_project']
    id_model = request.json['id_model']
    algorithm_model = request.json['algorithm_model']
    name_model = request.json['name_model']
    desc_model = request.json['desc_model']
    path_model = request.json['path_model']
    id_responsible_model = request.json['id_responsible_model']
    name_responsible_model = request.json['name_responsible_model']
    open_date_model = request.json['open_date_model']
    close_date_model = request.json['close_date_model']
    is_active_model = request.json['is_active_model']

    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    status = "ok"
    try:
        sql = "insert into "+ tablename +" (id_project, id_model, algorithm_model, name_model, desc_model, path_model, id_responsible_model, name_responsible_model" \
                                         ", open_date_model, close_date_model, is_active_model) VALUES ('"+str(id_project)+"','"+str(id_model)+"','"+str(algorithm_model)+"','"\
                                         +str(name_model)+"','"+str(desc_model)+"','"+str(path_model) +"','"+str(id_responsible_model)+"','"+str(name_responsible_model)+"','"\
                                         +str(open_date_model)+"','"+str(close_date_model)+"','"+str(is_active_model)+"');"
        print (sql)
        cursor.execute(sql)
        print(cursor.lastrowid)
    except:
        print("error")
        status = "error"

    conn.commit()
    conn.close()
    json = {'status':status}
    return json

@delete_data_table_model.route("/delete_data_table_model/", methods=['GET','POST'])
@cross_origin()
def delete_model():
    list_records = []
    dbname = request.json['dbname']
    tablename = request.json['tablename']
    db_file = 'database/'+dbname+'.db'
    id_model = request.json['id_model']

    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    status = "ok"
    print(id_model)
    try:
        sql = "delete from "+ tablename +" where id_model='"+str(id_model)+"'"
        print(sql)
        cursor.execute(sql)
        print(cursor.lastrowid)
    except:
        print("error")
        status = "error"

    conn.commit()
    conn.close()
    json = {'status':status}
    return json
