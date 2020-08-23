import json
from flask import Flask
from flask import request
from flask_cors import CORS
from uuid import uuid1 as uuid
from itertools import repeat
from dataclasses import dataclass, field
from typing import Optional, Mapping

app = Flask("clicksync", instance_relative_config=True)
CORS(app)

def token_gen():
    while True:
        yield(uuid().hex)

tokens = token_gen()
ids = token_gen()

class Session:
    def __init__(self, token, offer):
        self.token = token
        self.answers = []
        self.candidates = []
        self.offer = offer
    def answer(self, answer):
        self.answers.append(answer)
    def candidate(self, candidate):
        self.candidates.append(candidate)

sessions = {}

@app.route("/offer", methods=["POST"])
def token():
    offer = request.get_json()
    tok = next(tokens)
    sessions[tok] = Session(tok, offer)
    return tok

@app.route("/candidate/<token>", methods=["POST"])
def candidate(token):
    candidate = request.get_json()
    if token in sessions:
        session[token].candidate(candidate)
    else: 
        return "Invalid Token", 400


@app.route("/join/<token>")
def join(token):
    if token in sessions:
        session = sessions[token]
    else:
        session = next(iter(sessions.values()))
    return Response(json.dumps(dict(offer: session.offer, candidate: session.candidate)), mimetype="application/json")

@app.route("/")
def hi():
    return "hi"


if __name__ == "__main__":
    app.run()

