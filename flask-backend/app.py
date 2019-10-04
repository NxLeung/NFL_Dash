import flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from flask_cors import CORS
import pandas as pd
from flask_heroku import Heroku
import json
import sys

app = flask.Flask("__name__")

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:postgres@localhost/nfl_player_summaries"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
player = Base.classes.player_sum
heroku = Heroku(app)



CORS(app)

@app.route("/")
def my_index():
    return flask.render_template("index.html")

@app.route('/data/<selectedOption>')
def playerData (selectedOption):
    player_name = selectedOption;
    engine = create_engine(f"postgresql://postgres:postgres@localhost/nfl_player_summaries")
    conn = engine.connect()
    playerData = pd.read_sql(f"""select game_year, sum(passing_yards_gained) as passing_yards_gained,sum(receiving_yards_gained) as receiving_yards_gained,sum(rushing_yards_gained) as rushing_yards_gained
FROM
	"player_sum" where player_name = '{player_name}' group by game_year """, engine)
    playerData.fillna(0, inplace=True)
    playerData = playerData.to_json(orient='records')
 
    return playerData

@app.route("/test")
def test():
    return flask.render_template("test.html")

app.run(debug=True)
