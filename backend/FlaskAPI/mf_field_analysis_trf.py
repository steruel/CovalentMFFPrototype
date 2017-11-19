
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

mf_field_analysis_trf = Blueprint('mf_field_analysis_trf', __name__)
CORS(mf_field_analysis_trf)
CORS(mf_field_analysis_trf,resources={r"/mf_field_analysis_trf/*/": {"origins": "*"}})
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
    
        

        

#http://localhost:5000/mf_field_analysis_trf/field_list/?datasetid=1
@mf_field_analysis_trf.route("/mf_field_analysis_trf/field_list/", methods=['GET'])
@cross_origin()
def mf_field_at_get_field_list():
	
	col_details = []
	dbname = 'mf'
	db_file = '../database/'+dbname+'.db'
	conn = sqlite3.connect(db_file)
	cursor = conn.cursor()
	datasetid = request.args.get('datasetid')
	
	sql = "select tablename from dataset where datasetid="+str(datasetid)+" limit 1"
	cursor.execute(sql)
	dataset = cursor.fetchall()
	tablename = dataset[0][0]
	
	sql = "PRAGMA table_info("+tablename+")"
	cursor.execute(sql)
	col_details = cursor.fetchall()
	conn.close()
	df = pd.DataFrame(col_details)
	df.columns = ['index','fieldname','fieldtype','notnull','default_value','primarykey']
	json = df.to_json(orient='records')
	
	return json
	
	

#http://localhost:5000/mf_field_analysis_trf/field_list_from_modelid/?modelid=1
@mf_field_analysis_trf.route("/mf_field_analysis_trf/field_list_from_modelid/", methods=['GET'])
@cross_origin()
def mf_field_at_get_field_list_from_modelid():
	
	col_details = []
	dbname = 'mf'
	db_file = '../database/'+dbname+'.db'
	conn = sqlite3.connect(db_file)
	cursor = conn.cursor()
	modelid = request.args.get('modelid')
	
	sql = "select datasetid from model_metadata where model_id='"+str(modelid)+"' limit 1"
	print sql
	cursor.execute(sql)
	model = cursor.fetchall()
	datasetid = model[0][0]
	
	sql = "select tablename from dataset where datasetid="+str(datasetid)+" limit 1"
	cursor.execute(sql)
	dataset = cursor.fetchall()
	tablename = dataset[0][0]
	
	sql = "select field_id,fieldname,fieldtype from table_fieldmetadata where tablename = '"+tablename+"'"
	cursor.execute(sql)
	col_details = cursor.fetchall()
	conn.close()
	df = pd.DataFrame(col_details)
	df.columns = ['field_id','fieldname','fieldtype']
	#df = df[['index','fieldname','fieldtype']]
	json = df.to_json(orient='records')
	
	return json



#http://localhost:5000/mf_field_analysis_trf/value_count/?model_id=m1&field_id=1
@mf_field_analysis_trf.route("/mf_field_analysis_trf/value_count/", methods=['GET'])
@cross_origin()
def mf_field_at_value_count():
	
	col_details = []
	dbname = 'mf'
	db_file = '../database/'+dbname+'.db'
	conn = sqlite3.connect(db_file)
	cursor = conn.cursor()
	model_id = request.args.get('model_id')
	field_id = request.args.get('field_id')
	
	sql = "select datasetid from model_metadata where model_id='"+str(model_id)+"' limit 1"
	print sql
	cursor.execute(sql)
	model = cursor.fetchall()
	datasetid = model[0][0]
	
	sql = "select tablename from dataset where datasetid="+str(datasetid)+" limit 1"
	cursor.execute(sql)
	dataset = cursor.fetchall()
	tablename = dataset[0][0]
	
	sql = "select fieldname from table_fieldmetadata where tablename='"+tablename+"' and field_id="+str(field_id)+" limit 1"
	cursor.execute(sql)
	fieldmetadata = cursor.fetchall()
	fieldname = fieldmetadata[0][0]
	
	sql = "select "+fieldname+",count(*) from "+tablename+" group by "+fieldname
	cursor.execute(sql)
	groupby = cursor.fetchall()
	conn.close()
	df = pd.DataFrame(groupby)
	df.columns = ['value','count']
	df['fieldname'] = fieldname
	#df = df[['index','fieldname','fieldtype']]
	json = df.to_json(orient='records')
	
	return json

