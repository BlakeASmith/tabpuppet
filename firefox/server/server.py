from flask import Flask
from flask import request
from uuid import uuid1 as uuid
from itertools import repeat
from dataclasses import dataclass, field
from typing import List, MutableMapping

@dataclass
class Member:
    id: str
    index: int = 0

@dataclass
class Session:
    token: str
    leader: str
    xpath: List[str]
    members: MutableMapping[str, Member]


app = Flask("clicksync")

def token_gen():
    while True:
        yield(uuid().hex)

tokens = token_gen()
ids = token_gen()

sessions = {}

@app.route("/xpath", methods = ["POST"])
def xpath():
    json = request.get_json()
    session = json["session"]
    xpath = json["xpath"]
    if sessions[session["token"]].leader == session["id"]:
        sessions[session["token"]].xpath.append(xpath)
        return xpath
    else:
        return "INVAlID SESSION ID", 400

@app.route("/xpath/<token>/<id>", methods = ["GET"])
def get_xpath(token, id):
    if id in sessions[token].members:
        member = sessions[token].members[id]
        xpath = sessions[token].xpath[member.index]
        member.index += 1
        return xpath
    else:
        return "INVALID TOKENS", 400

@app.route("/token")
def token():
    tok = next(tokens)
    id = next(ids)
    sessions[tok] = Session(tok, id, [], {})
    return dict(token=tok, id=id)

@app.route("/join/<token>")
def join(token):
    if token not in sessions:
        return "Invalid Token", 400

    id = next(ids)
    sessions[token].members[id] = Member(id)
    return id

if __name__ == "__main__":
    app.run()

