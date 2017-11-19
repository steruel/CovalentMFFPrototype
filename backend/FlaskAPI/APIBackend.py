
# coding: utf-8

# In[1]:

##Includes
from manage_data_table import insert_data_table_project
from manage_data_table import get_data_table
from manage_data_table import delete_data_table_project
from manage_data_table import insert_data_table_model
from manage_data_table import delete_data_table_model
#from mf_insert_table_data import mf_insert_table_data
#from mf_field_analysis_trf import mf_field_analysis_trf
from flask import request, url_for
from flask_api import FlaskAPI, status, exceptions
from flask_cors import CORS, cross_origin


app = FlaskAPI(__name__)
app.register_blueprint(insert_data_table_project)
app.register_blueprint(get_data_table)
app.register_blueprint(delete_data_table_project)
app.register_blueprint(insert_data_table_model)
app.register_blueprint(delete_data_table_model)

#app.register_blueprint(mf_insert_table_data)
#app.register_blueprint(mf_field_analysis_trf)

#cors = CORS(app)
#cors = CORS(app,resources={r"*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

app.run(debug=True)
#process()



#
