extends CanvasLayer

@onready var timerLabel = $Control/CenterContainer/VBoxContainer/VBoxContainer2/Timer
var end_time = 0

@onready var http := $HTTPRequest

#LIST OF MESSAGE To HANDLE
@onready var message_queue = []

#OPEN SOCKET
var ws = WebSocketPeer.new()
var ws_state = WebSocketPeer.STATE_CLOSED

#ALL PATH PLAYER
@onready var slots = [
	$Control/CenterContainer/VBoxContainer/players/slot1,
	$Control/CenterContainer/VBoxContainer/players/slot2,
	$Control/CenterContainer/VBoxContainer/players/slot3,
	$Control/CenterContainer/VBoxContainer/players/slot4,
	$Control/CenterContainer/VBoxContainer/players/slot5,
	$Control/CenterContainer/VBoxContainer/players/slot6,
	$Control/CenterContainer/VBoxContainer/players/slot7,
	$Control/CenterContainer/VBoxContainer/players/slot8
]

#FUNCTION LAUNCH AT THE START OF SCENE
func _ready() -> void:
	#CONNECT WSPEER TO SERVER
	var err = ws.connect_to_url("ws://127.0.0.1:8080")
	if err != OK:
		print("WebSocket connection failed")
	else:
		print("Connected to server")

#HANDLE QUEUE OF MESSAGE
func process_network_messages():
	while message_queue.size() > 0:
		var msg = message_queue.pop_front()
		handle_message(msg)

#FUNCTION FOR HANDLE THE MESSAGE SENDED
func _receive_messages():
	if ws.get_ready_state() != WebSocketPeer.STATE_OPEN:
		return
	while ws.get_available_packet_count() > 0:
		var packet = ws.get_packet()
		#CONVERT BYTES RECEIVED STRING TO UTF8
		var text = packet.get_string_from_utf8()
		#PARSING OF TEXT LIKE JSON
		var data = JSON.parse_string(text)
		if data != null:
			message_queue.append(data)

#FUNCTION THAN EXECUT CODE ALL TIME OF EXECUTION PROGARMME (DELTA = NB FRAME / SEC)
func _process(_delta: float) -> void:
	#PRINT TIMER
	if end_time > 0:
		var remaining = end_time - Time.get_unix_time_from_system()
		timerLabel.text = str(max(0, int(remaining)))
	#OPEN TO RECEVEIVE PACKET
	ws.poll()
	ws_state = ws.get_ready_state()
	if ws_state == WebSocketPeer.STATE_OPEN:
		#FUNCTION TO HANDLE PACKET SENDED 
		_receive_messages()
		#HANDLE FIRST MESSAGE STOCK IN QUEUE
		process_network_messages()
	if ws_state == WebSocketPeer.STATE_CONNECTING:
		pass

#SEE IF PLAYER JOIN OR LEAVE THE LOBBY
func handle_message(msg):
	#VERIF GOOD SCENE
	if not msg.has("scene"):
		return
	if msg["scene"] != "lobby":
		return
	#VERIF TYOE EXIST
	if not msg.has("type"):
		return
	print("MSG RECEIVED:", msg)
	match msg["type"]:
		"join":
			update_player(msg["slot"], msg["name"], msg["image_url"])
		"leave":
			clear_slot(msg["slot"])
		"timer":
			end_time = msg["end_time"]
		"start_map_vote":
			get_tree().change_scene_to_file("res://scene/MapChoose.tscn")

#IF PLAYER LEAVE CLEAR SLOT
func clear_slot(slot):
	if slot < 0 or slot >= slots.size():
		return
	slots[slot].get_node("player").text = "????????"
	slots[slot].get_node("photo").texture = load("res://asset/nobody.jpg")

#IF PLAYER JOIN ADD TO LOBBY
func update_player(slot, player_name, image_url):
	if slot < 0 or slot >= slots.size():
		return
	slots[slot].get_node("player").text = player_name
	load_image_for_slot(slot, image_url)

func load_image_for_slot(slot, url):
	var request = HTTPRequest.new()
	add_child(request)
	request.request_completed.connect(
		func(result, code, headers, body):
			_on_image_received(slot, result, code, headers, body)
			request.queue_free()
	)
	request.request(url)

func _on_image_received(slot, result, code, _headers, body):
	if result != OK or code != 200:
		return
	var img = Image.new()
	var err = img.load_jpg_from_buffer(body)
	if err != OK:
		print("IMAGE FORMAT NON SUPPORTÉ")
		return
	var tex = ImageTexture.create_from_image(img)
	if slot >= 0 and slot < slots.size():
		var node = slots[slot].get_node("photo")
		if node:
			node.texture = tex

#EXEMPLE MESSAGE
	
#FOR TIMER
#{
	#"scene": "lobby",
	#"type": "time",
	#"duration": 10
#}

#FOR NEW PLAYER
#{
	#"scene": "lobby",
	#"type": "join",
	#"slot": 0,
	#"name": beber,
	#"image_url": "http://...."
#}

#FOR TIMER
#{
	#"scene": "lobby",
	#"type": "leave",
	#"slot": 1
#}

#FOR TIMER
#{
	#"scene": "lobby",
	#"type": "start_map_vote"
#}
