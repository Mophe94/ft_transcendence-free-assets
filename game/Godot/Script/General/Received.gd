extends Node

signal combat_scene
signal team_setup_scene
signal catch_ok
signal catch_fail
signal monster_encounter_received
signal start_game_scene
signal enemy_action
signal player_action
signal battle_start
signal lose
signal win
signal next_map_scene
signal finish


func handle_message_receive(msg):
	#VERIF GOOD MESSAGE
	if not msg.has("event"):
		print("func handle_message_receive EVENT missing")
		return
	if msg["event"] != "game":
		print("func handle_message_receive EVENT isn't GAME")
		return
	if not msg.has("data"):
		print("func handle_message_receive DATA missing")
		return
	print("MSG RECEIVED:", msg)
	
	var data = msg["data"]
	if data.has("state"):
		var state = data["state"]
		match state:
			"state" == "start_game":
				_start_game(data)
			"state" == "team_setup":
				_team_setup(data)
			"state" == "new_current_item":
				_new_current_item(data)
			"state" == "new_encounter":
				_new_encounter(data)
			"state" == "result_catch":
				_result_catch(data)
			"state" == "update_team":
				_update_team(data)
			"state" == "update_inventory":
				_update_inventory(data)
			"state" == "combat":
				_combat(data)
			"state" == "battle_start":
				_battle_start(data)
			"state" == "update_battle_team":
				_update_current_monster(data)
			"state" == "update_enemy_momster":
				_update_enemy_monster(data)
			"state" == "action_item_damage":
				_action_item_damage(data)
			"state" == "action_item_heal":
				_action_item_heal(data)
			"state" == "action_item_stat":
				_action_item_stat(data)
			"state" == "attack":
				_attack(data)
			"state" == "damage":
				_take_damage(data)
			"state" == "lose":
				emit_signal("lose")
			"state" == "win":
				emit_signal("win")
			"state" == "next_map":
				_next_map(data)
			"state" == "finish":
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

	if not player.has("battle_team"):
		return
	var battle_team = player["battle_team"]
	var slot = GeneralData.player["currentMonster"]["slot"]
	GeneralData.player["battle_team"][slot]["life"]["current"] = battle_team[slot]["life"]["current"]

	if not data.has("text"):
		print("func _action_item_stat TEXT missing")
	GeneralData.text = data["text"]


func _attack(data):
	if not data.has("enemy"):
		return
	var enemy = data["enemy"]

	if not enemy.has("currentMonster"):
		return
	var cMonster = enemy["currentMonster"]

	if not cMonster.has("life"):
		return
	GeneralData.enemy["currentMonster"]["life"]["current"] = cMonster["life"]["current"]

	if not data.has("text"):
		return
	GeneralData.text = data["text"]
	
	if not data.has("charactere"):
		return
	if data["charactere"] == "player":
		emit_signal("player_action")
	elif data["charactere"] == "enemy":
		emit_signal("enemy_action")


func _action_item_stat(data):
	if not data.has("text"):
		return
	GeneralData.text = data["text"]

	if not data.has("charactere"):
		return
	if data["charactere"] == "player":
		_update_inventory(data)
		emit_signal("player_action")
	elif data["charactere"] == "enemy":
		emit_signal("enemy_action")


func _action_item_heal(data):
	if not data.has("player"):
		return
	var player = data["player"]

	if not player.has("currentMonster"):
		return
	var cMonster = player["currentMonster"]

	if not cMonster.has("life"):
		return
	GeneralData.player["currentMonster"]["life"]["current"] = cMonster["life"]["current"]

	if not player.has("battle_team"):
		return
	var battle_team = player["battle_team"]
	var slot = cMonster["slot"]
	GeneralData.player["battle_team"][slot]["life"]["current"] = battle_team[slot]["life"]["current"]
		
	if not data.has("charactere"):
		return
	if data["charactere"] == "player":
		if not data.has("text"):
			return
		GeneralData.text = data["text"]
		_update_inventory(data)
		emit_signal("player_action")
	elif data["charactere"] == "enemy":
		emit_signal("enmey_action")


func _action_item_damage(data):
	if not data.has("enemy"):
		return
	var enemy = data["enemy"]

	if not enemy.has("currentMonster"):
		return
	var cMonster = enemy["currentMonster"]

	if not cMonster.has("life"):
		return
	GeneralData.enemy["currentMonster"]["life"]["current"] = cMonster["life"]["current"]
		
	if not data.has("charactere"):
		return
	if data["charactere"] == "player":
		if not data.has("text"):
			return
		GeneralData.text = data["text"]
		_update_inventory(data)
		emit_signal("player_action")
	elif data["charactere"] == "enemy":
		emit_signal("player_action")


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
	emit_signal("enemy_action")


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
	emit_signal("player_action")


func _battle_start(data):
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
	emit_signal("battle_start")


func _combat(data):
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
	if not data.has("team"):
		return
	for i in range(6):
		GeneralData.player["team"][i] = data["team"][i]


func _update_inventory(data):
	if not data.has("inventory"):
		return
	for i in range(4):
		GeneralData.player["inventory"][i] = data["inventory"][i]


func _result_catch(data):
	if not data.has("result"):
		return

	if not data["result"] == "ok" || data["result"] == "fail":
		return
	if data["result"] == "ok":
		emit_signal("catch_ok")
	else:
		emit_signal("catch_fail")

	if not data.has("text"):
		return
	GeneralData.text = data["text"]


func _new_encounter(data):
	if not data.has("monster_encounter"):
		return
	GeneralData.monster_encounter = data["monster_encounter"]
	emit_signal("monster_encounter_received")

	if not data.has("text"):
		return
	GeneralData.text = data["text"]


func _new_current_item(data):
	if not data.has("current_item"):
		return
	GeneralData.current_item = data["current_item"]


func _start_game(data):
	if not data.has("timer"):
		return
	GeneralData.timer = data["timer"]
	
	if not data.has("player"):
		return
	var player = data["player"]

	if not player.has("id"):
		return
	GeneralData.player["id"] = data["player"]["id"]
			
	if not player.has("name"): 
		return
	GeneralData.player["name"] = data["player"]["name"]
			
	if not player.has("asset"): 
		return
	GeneralData.player["asset"] = data["player"]["asset"]
	
	if not player.has("team"):
		return
	for i in range(6):
		GeneralData.player["team"][i] = player["team"][i]

	if not data.has("current_map"):
		return
	GeneralData.current_map = data["current_map"]

	emit_signal("start_game_scene")
