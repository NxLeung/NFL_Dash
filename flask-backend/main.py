import flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from flask_cors import CORS
import pandas as pd


app = flask.Flask("__main__")
CORS(app)

@app.route("/")
def my_index():
    return flask.render_template("index.html")

@app.route('/data/<selectedOption>')
def playerData (selectedOption):
    player_name = selectedOption;
    engine = create_engine(f"postgresql://postgres:postgres@localhost/NFL")
    conn = engine.connect()
    playerData = pd.read_sql(f"""select game_year, sum(passing_yards_gained) as passing_yards_gained,sum(receiving_yards_gained) as receiving_yards_gained,sum(rushing_yards_gained) as rushing_yards_gained
FROM
	"Player" where player_name = '{player_name}' group by game_year """, engine)
    playerData.fillna(0, inplace=True)
    playerData = playerData.to_json(orient='records')
 
    return playerData

app.run(debug=True)
