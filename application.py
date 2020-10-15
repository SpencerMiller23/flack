import os, json

from flask import Flask, render_template, url_for, jsonify, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = ['general', 'random']
channelMessages = [[], []]

class Message:
    def __init__(self, text, sender, time):
        self.text = text
        self.sender = sender
        self.time = time

    def decode(self):
        return {
            "sender": self.sender,
            "text": self.text,
            "time": self.time
        }

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/dashboard", methods=["POST"])
def dashboard():
    return render_template("dashboard.html", channels=channels, channelMessages=channelMessages)

@app.route("/<currentChannel>", methods=["GET"])
def loadConversation(currentChannel):
    i = 0
    message_response = []
    while channels[i] != currentChannel:
        i += 1
    for msg in channelMessages[i]:
        message_response.append(msg.decode())
    return jsonify(message_response)

@socketio.on("submit createChannel")
def createChannel(data):
    channelName = data["channelName"]
    newChannel = []
    channels.append(channelName)
    channelMessages.append(newChannel)
    emit("announce createChannel", {'channelName': channelName}, broadcast=True)

@socketio.on("submit messageSent")
def messageSent(data):
    currentChannel = data["currentChannel"]
    i = 0
    while channels[i] != currentChannel:
        i += 1
    text = data["messageText"]
    sender = data["messageSender"]
    time = data["dateTime"]
    msg = Message(text, sender, time)
    channelMessages[i].append(msg)
    emit("announce messageSent", {'currentChannel': currentChannel, 'messageText': text, 'messageSender': sender, 'dateTime': time}, broadcast=True)
