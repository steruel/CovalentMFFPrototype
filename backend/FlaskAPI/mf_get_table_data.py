
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

mf_get_table_data = Blueprint('mf_get_table_data', __name__)
CORS(mf_get_table_data)
CORS(mf_get_table_data,resources={r"/mf_get_table_data/*/": {"origins": "*"}})
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
    
        

        
#http://localhost:5000/mf_get_table_data/gettabledatafromsqlite/?dbname=mf&tablename=dataset&limit=20
#http://localhost:5000/mf_get_table_data/gettabledatafromsqlite/?dbname=mf&tablename=dataset&limit=
@mf_get_table_data.route("/mf_get_table_data/gettabledatafromsqlite/", methods=['GET'])
@cross_origin()
def gettabledatafromsqlite():
	list_records = []
	dbname = request.args.get('dbname')
	db_file = '../database/'+dbname+'.db'
	tablename = request.args.get('tablename')
	limit = request.args.get('limit')
	conn = sqlite3.connect(db_file)
	cursor = conn.cursor()
	limit = str(limit)
	if limit == '':
		limit = '50'
	sql = "select * from "+tablename + " limit "+limit
	print sql
	cursor.execute(sql)
	colnames = [description[0] for description in cursor.description]
	rows = cursor.fetchall()
	
	conn.close()
	
	for row in rows:
		list_records.append(row)
		
	df = pd.DataFrame(list_records,columns=colnames)
	json = df.to_json(orient='records')	
	
	return json

	
#http://localhost:5000/mf_get_table_data/join_modelmetadata_dataset/
@mf_get_table_data.route("/mf_get_table_data/join_modelmetadata_dataset/", methods=['GET'])
@cross_origin()
def gettabledata_join_modelmetadata_dataset():
	dbname = 'mf'
	db_file = '../database/'+dbname+'.db'
	tablename = request.args.get('tablename')
	
	conn = sqlite3.connect(db_file)
	cursor = conn.cursor()
	
	sql = "select t1.model_id,t1.model_description, t1.datasetid,t2.datasetname,t2.tablename from model_metadata t1, dataset t2 where t1.datasetid = t2.datasetid"
	cursor.execute(sql)
	colnames = [description[0] for description in cursor.description]
	rows = cursor.fetchall()
	
	conn.close()
	
	df = pd.DataFrame(rows,columns=colnames)
	json = df.to_json(orient='records')	
	
	return json


##?folder=bank_direct_marketing&file=bank-additional-full.csv
#http://localhost:5000/mf_get_table_data/gettabledatafromcsv?folder=bank_direct_marketing&file=bank-additional-full.csv
@mf_get_table_data.route("/mf_get_table_data/gettabledatafromcsv/", methods=['GET'])
def gettabledatafromcsv():
	folder = request.args.get('folder')
	file = request.args.get('file')
	#filename = '../data/bank_direct_marketing/' + tablename
	filename = '../data/'+folder+'/'+ file
	print filename
	df = read_csv_file(filename, ";", 0)
	json = df.to_json(orient='records')
	return json
	
	


##?file=bank-additional-full.csv
#http://localhost:5000/mf_get_table_data/gettabledatafromcsv1?file=bank-additional-full.csv
@mf_get_table_data.route("/mf_get_table_data/gettabledatafromcsv1/", methods=['GET'])
def gettabledatafromcsv1():
	
	file = request.args.get('file')
	filename = '../data/'+ file
	print filename
	df = read_csv_file(filename, ";", 0)
	json = df.to_json(orient='records')
	return json




	
#process()



#
