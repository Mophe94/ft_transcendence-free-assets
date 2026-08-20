extends Node

signal fail_connection
var connection = false

@export var timeToConnect = 10.0
var ws = WebSocketPeer.new()
var wsSate = WebSocketPeer.STATE_CLOSED
var sceneLaunch = false

var processing_messages = false

@onready var user = ""
@onready var room = ""
@onready var domain = ""

@onready var messageQueue = []


func connect_server():
	#CONNECT AND SEND TOKEN
	var url = "wss://" + domain + "/game?token=" + user + "&room=" + room
	print("url : " + url)
	var err = ws.connect_to_url(url)
	if err != OK:
		emit_signal("fail_connection")
		print("WebSocket connection failed")
		return
	else:
		connection = true
		print("Connected to server")


func receive_token():
	var user_ok = false
	var room_ok = false
	var domain_ok = false
	var currentTime = 0.0
	while (currentTime < timeToConnect):
		var result_user = JavaScriptBridge.eval("userToken")
		var result_room = JavaScriptBridge.eval("roomToken")
		var result_domain = JavaScriptBridge.eval("domainToken")
		if result_user != null:
			user = result_user
			if user != null && user != "":
				if user_ok == false:
					user_ok = true
					print("TOKEN USER RECEIVED: " +  user)
		if result_room != null:
			room = result_room
			if room != null && room != "":
				if room_ok == false:
					room_ok = true
					print("TOKEN ROOM RECEIVED: " +  room)
		if result_domain != null:
			domain = result_domain
			if domain != null && domain != "":
				if domain_ok == false:
					domain_ok = true
					print("TOKEN DOMAIN RECEIVED: " +  domain)
		if user_ok == true && room_ok == true && domain_ok == true:
			return true
		await get_tree().create_timer(0.2).timeout
		currentTime += 0.2
	return false


func _ready() -> void:
	if OS.has_feature("web"):
		var result = await receive_token()
		if !result:
			print("TOKEN TIMEOUT")
			emit_signal("fail_connection")
			return
		connect_server()
		ws.inbound_buffer_size = 1024 * 1024	# 64 Ko -> 1Mo
		ws.max_queued_packets = 16384		# 4096 -> 16384
	else:
		print("Export not in HTML5")
		emit_signal("fail_connection")
		return


func _process(_delta: float) -> void:
	ws.poll()
	wsSate = ws.get_ready_state()
	if wsSate == WebSocketPeer.STATE_OPEN:
		#FUNCTION TO HANDLE PACKET SENDED 
		receive_messages()
		#HANDLE FIRST MESSAGE STOCK IN QUEUE
		process_network_messages()
		
	if wsSate == WebSocketPeer.STATE_CONNECTING:
		pass

func process_network_messages():
	if processing_messages:
		return
	if messageQueue.size() > 0:
		processing_messages = true
		
		var msg = messageQueue.pop_front()
		await Received.handle_message_receive(msg)
		await get_tree().create_timer(0.2).timeout 
		
		processing_messages = false

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
