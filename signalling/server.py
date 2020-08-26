import asyncio
import websockets
import json
from uuid import uuid1 as uuid
from dataclasses import dataclass, field
from typing import Optional, Mapping

port = 8080

def token_gen():
    while True:
        yield(uuid().hex)

tokens = token_gen()
ids = token_gen()

class Session:
    def __init__(self, token, socket):
        self.token = token
        self.socket = socket
        self.callbacks = []
        self.peers = {}

    async def join(self, socket):
        id = next(ids)
        self.peers[id] = socket
        async for message in socket:
            marked = json.dumps(dict(id = id, signal=message))
            await self.socket.send(marked)


    async def start(self):
        await self.socket.send('{"token":"'+self.token+'"}' )
        id = None
        async for message in self.socket:
            if "{" not in message:
                id = message
                continue
            await self.peers[id].send(message)

sessions = {}

async def connect(websocket, path):
    type = await websocket.recv()
    if type == "hosting":
        token = next(tokens)
        sessions[token] = Session(token, websocket)
        await sessions[token].start()
    elif type == "joining":
        token = await websocket.recv()
        if token not in sessions:
            await websocket.send("Invalid Token")
            await websocket.close()
            return 

        await sessions[token].join(websocket)


start_server = websockets.serve(connect, "0.0.0.0", port)

print(f"starting server on {port}")
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
