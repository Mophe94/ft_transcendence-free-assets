extends Node

signal launch
signal fail_connection

@export var timeToConnect = 5.0
var ws = WebSocketPeer.new()
var wsSate = WebSocketPeer.STATE_CLOSED
var sceneLaunch = false

@onready var token = ""
@onready var room = ""

@onready var messageQueue = []

func connect_server():
	#CONNECT AND SEND TOKEN
	var url = "ws://127.0.0.1:8082/?token=" + token + "&room=" + room
	print("url : " + url)
	var err = ws.connect_to_url(url)
	if err != OK:
		emit_signal("fail_connection")
		print("WebSocket connection failed")
		return
	else:
		print("Connected to server")

func receive_token():
	var token_ok = false
	var room_ok = false
	var currentTime = 0.0
	while (currentTime < timeToConnect):
		var result_token = JavaScriptBridge.eval("userToken")
		var result_room = JavaScriptBridge.eval("roomToken")
		if result_token != null:
			token = result_token
			if token != null && token != "":
				if token_ok == false:
					token_ok = true
					print("TOKEN USER RECEIVE: " +  token)
		if result_room != null:
			room = result_room
			if room != null && room != "":
				if room_ok == false:
					room_ok = true
					print("TOKEN ROOM RECEIVE: " +  room)
		if token_ok == true && room_ok == true:
			return true
		await get_tree().create_timer(0.2).timeout
		currentTime += 0.2
		print(currentTime)
	return false

# Called when the node enters the scene tree for the first time.
func _ready() -> void:
	if OS.has_feature("web"):
		var result = await receive_token()
		print("result : " + str(result))
		if !result:
			print("TOKEN TIMEOUT")
			emit_signal("fail_connection")
			return
		connect_server()
	else:
		print("Export not in HTML5")
		emit_signal("fail_connection")
		return


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(_delta: float) -> void:
	ws.poll()
	wsSate = ws.get_ready_state()
	if wsSate == WebSocketPeer.STATE_OPEN:
		#FUNCTION TO HANDLE PACKET SENDED 
		receive_messages()
		#HANDLE FIRST MESSAGE STOCK IN QUEUE
		process_network_messages()
		print("ws connect launch scene map")
		if sceneLaunch == false:
			sceneLaunch = true
			emit_signal("launch")
	if wsSate == WebSocketPeer.STATE_CONNECTING:
		pass

func process_network_messages():
	while messageQueue.size() > 0:
		var msg = messageQueue.pop_front()
		Received.handle_message_receive(msg)

func receive_messages():
	if ws.get_ready_state() != WebSocketPeer.STATE_OPEN:
		return
	while ws.get_available_packet_count() > 0:
		var packet = ws.get_packet()
		#CONVERT BYTES RECEIVED STRING TO UTF8
		var text = packet.get_string_from_utf8()
		#PARSING OF TEXT LIKE JSON
		var data = JSON.parse_string(text)
		if data != null:
			messageQueue.append(data)
