
# coding: utf-8

# In[1]:

##Includes
from flask import request, url_for
from flask_api import FlaskAPI, status, exceptions
from flask_cors import CORS, cross_origin
from flask import Blueprint, render_template, abort

import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import pickle
import json

import sqlite3

mf_insert_table_data = Blueprint('mf_insert_table_data', __name__)
CORS(mf_insert_table_data)
CORS(mf_insert_table_data,resources={r"/mf_insert_table_data/*/": {"origins": "*"}})
#cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

######flask_api



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
    
        

        

#http://localhost:5000/mf_insert_table_data/model_metadata/model_id=m1&model_description=testmodel
#http://localhost:5000/mf_insert_table_data/model_metadata/
@mf_insert_table_data.route("/mf_insert_table_data/model_metadata/", methods=['GET','POST'])
@cross_origin()
def insertinto_model_metadata():
	print ('innnn1')
	list_records = []
	dbname = 'mf'
	db_file = '../database/'+dbname+'.db'
	tablename = 'model_metadata'
	model_id = request.json['model_id']
	model_description = request.json['model_description']
	datasetid = request.json['datasetid']
	
	print (model_id,model_description,datasetid)
	
	conn = sqlite3.connect(db_file)
	cursor = conn.cursor()
	status = "ok"
	try:
		sql = "insert into model_metadata(model_id, model_description,datasetid) VALUES ('"+model_id+"','"+model_description+"',"+str(datasetid)+")"
		print sql
		cursor.execute(sql)
		print cursor.lastrowid

	except:
		print "error"
		status = "error"
	conn.commit()
	conn.close()
	json = {'status':status}
	return json


