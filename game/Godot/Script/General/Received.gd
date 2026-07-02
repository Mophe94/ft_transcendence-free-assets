extends Node

signal start_game_scene

signal monster_encounter_received
signal catch_result(success)
signal team_setup_scene
signal item_received

signal combat_scene
signal battle_start

signal new_turn
signal lose
signal win
signal next_map_scene

signal finish


func handle_message_receive(msg):
	#VERIF GOOD MESSAGE
	print("MSG RECEIVED:\n", msg)
	if not msg.has("event"):
		print("func handle_message_receive EVENT missing")
		return
	if msg["event"] != "game":
		print("func handle_message_receive EVENT isn't GAME")
		return
	if not msg.has("data"):
		print("func handle_message_receive DATA missing")
		return
	
	var data = msg["data"]
	if data.has("state"):
		var state = data["state"]
		print("state: " + state)
		match state:
			"start_game":
				_start_game(data)
			"team_setup":
				_team_setup(data)
			"new_current_item":
				_new_current_item(data)
			"new_encounter":
				_new_encounter(data)
			"result_catch":
				_result_catch(data)
			"update_team":
				_update_team(data)
			"update_inventory":
				_update_inventory(data)
			"combat":
				_combat(data)
			"battle_start":
				_battle_start(data)
			"update_current_monster":
				_update_current_monster(data)
			"update_enemy_momster":
				_update_enemy_monster(data)
			"action_item_damage":
				_action_item_damage(data)
			"action_item_heal":
				_action_item_heal(data)
			"action_item_stat":
				_action_item_stat(data)
			"attack":
				_attack(data)
			"damage":
				_take_damage(data)
			"new_turn":
				_new_turn(data)
			"lose":
				emit_signal("lose")
			"win":
				emit_signal("win")
			"next_map":
				_next_map(data)
			"finish":
				emit_signal("finish")
			_:
				print("data match with nothing")
	else:
		print("func handle_message_receive STATE missing")


func _next_map(data):
	if not data.has("current_map"):
		return
	GeneralData.current_map = data["current_map"]
	emit_signal("next_map_scene")


func _new_turn(data):
	if not data.has("timer"):
		return
	GeneralData.timer = data["timer"]
	emit_signal("new_turn")

func _take_damage(data):
	if not data.has("player"):
		return
	var player = data["player"]

	if not player.has("currentMonster"):
		return
	var cMonster = player["currentMonster"]

	if not cMonster.has("life"):
		return
	GeneralData.player["currentMonster"]["life"]["current"] = cMonster["life"]["current"]


func _attack(data):
	if not data.has("success"):
		return
	var result = data["success"]
	
	if not data.has("skill"):
		return
	var skill = data["skill"]

	if result == "fail":
		return
	
	if not data.has("enemy"):
		return
	var enemy = data["enemy"]

	if not enemy.has("currentMonster"):
		return
	var cMonster = enemy["currentMonster"]

	if not cMonster.has("life"):
		return
	GeneralData.enemy["currentMonster"]["life"]["current"] = cMonster["life"]["current"]


func _action_item_stat(data):
	if not data.has("stat"):
		return
	var stat = data["stat"]
	
	if not data.has("change"):
		return
	var change = data["change"]
	
	if not data.has("charactere"):
		return
	if data["charactere"] == "player":
		_update_inventory(data)


func _action_item_heal(data):
	if not data.has("value"):
		return
	var value = data["value"]

	if not data.has("charactere"):
		return
	var charactere = data["charactere"]

	if charactere != "player" || charactere != "enemy":
		return
	
	if charactere == "enemy":
		if not data.has("enemy"):
			return
		var enemy = data["enemy"]

		if not enemy.has("currentMonster"):
			return
		var cMonster = enemy["currentMonster"]

		if not cMonster.has("life"):
			return
		GeneralData.enemy["currentMonster"]["life"]["current"] = cMonster["life"]["current"]

	else:
		if not data.has("player"):
			return
		var player = data["player"]

		if not player.has("currentMonster"):
			return
		var cMonster = player["currentMonster"]

		if not cMonster.has("life"):
			return
		GeneralData.player["currentMonster"]["life"]["current"] = cMonster["life"]["current"]
		_update_inventory(data)


func _action_item_damage(data):
	if not data.has("value"):
		return
	var value = data["value"]

	if not data.has("charactere"):
		return
	var charactere = data["charactere"]

	if charactere != "player" || charactere != "enemy":
		return
	
	if charactere == "enemy":
		if not data.has("enemy"):
			return
		var enemy = data["enemy"]

		if not enemy.has("currentMonster"):
			return
		var cMonster = enemy["currentMonster"]

		if not cMonster.has("life"):
			return
		GeneralData.enemy["currentMonster"]["life"]["current"] = cMonster["life"]["current"]

	else:
		if not data.has("player"):
			return
		var player = data["player"]

		if not player.has("currentMonster"):
			return
		var cMonster = player["currentMonster"]

		if not cMonster.has("life"):
			return
		GeneralData.player["currentMonster"]["life"]["current"] = cMonster["life"]["current"]
		_update_inventory(data)


func _update_enemy_monster(data):
	if not data.has("enemy"):
		return
	var enemy = data["enemy"]

	if not enemy.has("currentMonster"):
		return
	var cMonster = enemy["currentMonster"]
	GeneralData.enemy["currentMonster"]["name"] = cMonster["name"]
	GeneralData.enemy["currentMonster"]["index"] = cMonster["index"]

	if not cMonster.has("life"):
		return
	GeneralData.enemy["currentMonster"]["life"]["current"] = cMonster["life"]["current"]
	GeneralData.enemy["currentMonster"]["life"]["max"] = cMonster["life"]


func _update_current_monster(data):
	if not data.has("player"):
		return
	var player = data["player"]

	if not player.has("currentMonster"):
		return
	var cMonster = player["currentMonster"]
	GeneralData.player["currentMonster"]["name"] = cMonster["name"]
	GeneralData.player["currentMonster"]["index"] = cMonster["index"]

	if not cMonster.has("life"):
		return
	GeneralData.player["currentMonster"]["life"]["current"] = cMonster["life"]["current"]
	GeneralData.player["currentMonster"]["life"]["max"] = cMonster["life"]

	if not cMonster.has("skill"):
		return
	for i in range(4):
		var monsterSkill = cMonster["skill"][i]
		GeneralData.player["currentMonster"]["skill"][i]["name"] = monsterSkill["name"]
		GeneralData.player["currentMonster"]["skill"][i]["current"] = monsterSkill["current"]
		GeneralData.player["currentMonster"]["skill"][i]["max"] = monsterSkill["max"]

	if not cMonster.has("status"):
		return
	var status = cMonster["status"]
	for i in range(status.size()):
		GeneralData.player["currentMonster"]["skill"][i] = status[i]

	if not data.has("text"):
		return
	GeneralData.text = data["text"]


func _battle_start(data):
	if not data.has("timer"):
		return
	GeneralData.timer = data["timer"]
	
	if not data.has("player"):
		return
	var player = data["player"]

	if not player.has("currentMonster"):
		return
	var cMonster = player["currentMonster"]
	GeneralData.player["currentMonster"]["name"] = cMonster["name"]
	GeneralData.player["currentMonster"]["index"] = cMonster["index"]

	if not cMonster.has("life"):
		return
	GeneralData.player["currentMonster"]["life"]["current"] = cMonster["life"]["current"]
	GeneralData.player["currentMonster"]["life"]["max"] = cMonster["life"]

	if not cMonster.has("skill"):
		return
	for i in range(4):
		var monsterSkill = cMonster["skill"][i]
		GeneralData.player["currentMonster"]["skill"][i]["name"] = monsterSkill["name"]
		GeneralData.player["currentMonster"]["skill"][i]["current"] = monsterSkill["current"]
		GeneralData.player["currentMonster"]["skill"][i]["max"] = monsterSkill["max"]

	if not cMonster.has("status"):
		return
	var status = cMonster["status"]
	for i in range(status.size()):
		GeneralData.player["currentMonster"]["skill"][i] = status[i]

	if not data.has("enemy"):
		return
	var enemy = data["enemy"]
	
	if not enemy.has("currentMonster"):
		return
	cMonster = enemy["currentMonster"]
	GeneralData.enemy["currentMonster"]["name"] = cMonster["name"]

	if not cMonster.has("life"):
		return
	GeneralData.enemy["currentMonster"]["life"]["current"] = cMonster["life"]["current"]
	GeneralData.enemy["currentMonster"]["life"]["max"] = cMonster["life"]
	
	if not cMonster.has("status"):
		return
	status = cMonster["status"]
	for i in range(status.size()):
		GeneralData.player["currentMonster"]["skill"][i] = status[i]
	
	if not data.has("text"):
		return
	GeneralData.text = data["text"]
	emit_signal("battle_start")


func _combat(data):
	if not data.has("timer"):
		return
	GeneralData.timer = data["timer"]

	if not data.has("player"):
		return
	var player = data["player"]

	if not player.has("battle_team"):
		return
	for i in range(3):
		var team = player["battle_team"][i]
		GeneralData.player["battle_team"][i]["name"] = team["name"]
		GeneralData.player["battle_team"][i]["slot"] = team["slot"]
		GeneralData.player["battle_team"][i]["life"]["current"] = team[i]["life"]["current"]
		GeneralData.player["battle_team"][i]["life"]["max"] = team[i]["life"]["max"]

	emit_signal("combat_scene")


func _team_setup(data):
	if not data.has("timer"):
		return
	GeneralData.timer = data["timer"]
	
	if not data.has("player"):
		return
	var player = data["player"]
	
	if not player.has("team"):
		return
	for i in range(6):
		GeneralData.player["team"][i] = player["team"][i]
		
	if not data.has("enemy"):
		return
	var enemy = data["enemy"]
	
	if not enemy.has("team"):
		return
	for i in range(6):
		GeneralData.enemy["team"][i] = enemy["team"][i]
		
	if not enemy.has("id"):
		return
	GeneralData.enemy["id"] = data["enemy"]["id"]
	
	if not enemy.has("name"):
		return
	GeneralData.enemy["name"] = data["enemy"]["name"]
			
	if not enemy.has("asset"):
		return
	GeneralData.enemy["asset"] = data["enemy"]["asset"]
	
	emit_signal("team_setup_scene")


func _update_team(data):
	if not data.has("player"):
		return
	var player = data["player"]
	
	if not player.has("team"):
		return
	var team = player["team"]
	
	for i in range(team.size()):
		GeneralData.player["team"][i] = team[i] 


func _update_inventory(data):
	if not data.has("inventory"):
		return
	for i in range(4):
		GeneralData.player["inventory"][i] = data["inventory"][i]


func _result_catch(data):
	if not data.has("success"):
		return

	match data["success"]:
		"ok":
			_update_team(data)
			emit_signal("catch_result", true)
		"fail":
			emit_signal("catch_result", false)


func _new_encounter(data):
	if not data.has("monster_encounter"):
		return
	GeneralData.monster_encounter = data["monster_encounter"]
	emit_signal("monster_encounter_received")


func _new_current_item(data):
	if not data.has("current_item"):
		return
	GeneralData.current_item = data["current_item"]
	emit_signal("item_received")


func _start_game(data):

	if not data.has("timer"):
		return
	GeneralData.timer = data["timer"]

	if not data.has("player"):
		return
	var player = data["player"]

	if not player.has("id"):
		return
	GeneralData.player["id"] = player["id"]

	if not player.has("name"):
		return
	GeneralData.player["name"] = player["name"]

	if not player.has("asset"):
		return
	GeneralData.player["asset"] = player["asset"]
	
	if not player.has("team"):
		return
	for i in range(6):
		GeneralData.player["team"][i] = player["team"][i]

	if not data.has("current_map"):
		return
	GeneralData.current_map = data["current_map"]

	emit_signal("start_game_scene")
