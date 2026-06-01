extends CanvasLayer

#LABEL TIMER
@onready var timerLabel = $Control/CenterContainer/VBoxContainer2/label_fix/timer

#WEBSOCKET
var ws = WebSocketPeer.new()

#TIME LIMIT
var end_time = 0

#BLOCK DOUBLE VOTE
var voted = false

#CURRENT SCORE
var scoreMap = [0, 0, 0]

#ALL MAP SLOT
@onready var maps = [
	$Control/CenterContainer/VBoxContainer2/VBoxContainer/map1,
	$Control/CenterContainer/VBoxContainer2/VBoxContainer/map2,
	$Control/CenterContainer/VBoxContainer2/VBoxContainer/map3
]

#START SCENE
func _ready() -> void:
	#CONNECT TO SERVER
	var err = ws.connect_to_url("ws://localhost:8080")
	if err != OK:
		print("WebSocket connection failed")
		return
	#CONNECT BUTTON
	for i in range(maps.size()):
		var btn = maps[i].get_node("Button")
		btn.pressed.connect(vote.bind(i))

#MAIN LOOP
func _process(_delta):
	#UPDATE TIMER
	if end_time > 0:
		var remaining = end_time - Time.get_unix_time_from_system()
		timerLabel.text = "TIME LEFT : " + str(max(0, int(remaining)))
	#CHECK WS CONNECT
	if ws.get_ready_state() == WebSocketPeer.STATE_CLOSED:
		ws.connect_to_url("ws://localhost:8080")
	#UPDATE SOCKET
	ws.poll()
	#WAIT CONNECTION OPEN
	if ws.get_ready_state() != WebSocketPeer.STATE_OPEN:
		return
	#HANDLE ALL MESSAGE RECEIVED
	while ws.get_available_packet_count() > 0:
		var msg_text = ws.get_packet().get_string_from_utf8()
		transform_packet(msg_text)


#TRANSFORM JSON STRING TO GODOT DICTIONARY
func transform_packet(msg_text):
	var msg = JSON.parse_string(msg_text)
	if msg == null:
		print("Invalid JSON")
		return
	handle_message(msg)


#HANDLE MESSAGE TYPE
func handle_message(msg):
	#VERIF GOOD SCENE
	if not msg.has("scene"):
		return
	if msg["scene"] != "map_choice":
		return
	#VERIF TYPE EXIST
	if not msg.has("type"):
		return
	match msg["type"]:
	#SERVER SEND 3 MAP
		"maps":
			set_maps(msg["maps"])
	#SERVER START TIMER
		"timer":
			end_time = msg["end_time"]
	#SERVER UPDATE SCORE
		"vote_update":
			update_scores(msg["scores"])
	#SERVER SEND FINAL MAP
		"map_result":
			print("MAP RESULT RECEIVED")
			GameState.mapName = msg["name"]
			GameState.image = msg["image"]
			print("WINNER MAP :", GameState.mapName)
			get_tree().change_scene_to_file("res://scene/MapWin.tscn")


#DISPLAY MAPS
func set_maps(maps_send):
	for i in range(3):
		maps[i].get_node("Label").text = maps_send[i]["name"]
		#LOCAL IMAGE
		var tex = load(maps_send[i]["img"])
		if tex:
			maps[i].get_node("level").texture = tex
		#RESET SCORE
		maps[i].get_node("score").text = "0"


#UPDATE SCORE DISPLAY
func update_scores(new_scores):
	scoreMap = new_scores
	for i in range(3):
		maps[i].get_node("score").text = str(int(scoreMap[i]))


#PLAYER VOTE
func vote(map_id):
	print("bouton" + str(map_id))
	#CHECK WS
	if ws.get_ready_state() != WebSocketPeer.STATE_OPEN:
		print("ws not ready")
		return
		
	#BLOCK DOUBLE CLICK
	if voted:
		return
	voted = true
	#SEND VOTE TO SERVER
	ws.send_text(JSON.stringify({
		"scene": "map_choice",
		"type": "vote",
		"map_id": map_id
	}))
	lock_buttons()

#DISABLE BUTTON AFTER VOTE
func lock_buttons():
	for i in maps:
		i.get_node("Button").disabled = true	
		
		
		
#EXEMPLE MESSAGE TO SEND RECEIPED

#FOR UPDATE SCORE
#{
	#"scene": "map_choice",
	#"type": "vote_update",
	#"scores": [0, 0, 0]
#}

#FOR UPDATE SCORE
#{
	#"scene": "map_choice",
	#"type": "maps",
	#"maps": [
		#{
			#"name": "Desert",
			#"img": "res://asset/desert.png"
		#},
		#{
			#"name": "Forest",
			#"img": "res://asset/forest.png"
		#},
		#{
			#"name": "Water",
			#"img": "res://asset/water.png"
		#}
	#]
#}

#FOR TIMER
#{
	#"scene": "map_choice",
	#"type": "timer_start",
	#"duration": 10
#}

#FOR FINAL MAP WIN
#{
	#"scene": "map_choice",
	#"type": "map_result",
	#"name": "Forest",
	#"image_url": "http://localhost:8080/forest.png"
#}

#FOR VOTE SEND
#{
	#"scene": "map_choice",
	#"type": "vote",
	#"map_id": map_id
#}
