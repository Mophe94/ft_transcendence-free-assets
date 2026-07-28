extends Node

signal start_game_scene

signal monster_encounter_received
signal catch_result(success)
signal team_setup_scene
signal item_received
signal update_inventory
signal update_team

signal combat_scene

signal new_turn
signal lose
signal win
signal next_map_scene

signal finish


func handle_message_receive(msg):
	#VERIF GOOD MESSAGE
	print("-------- MSG RECEIVED -------- :\n", msg)
	if not msg.has("event"):
		return
	if msg["event"] != "game":
		return
	if not msg.has("data"):
		return
	
	#SEARCH STATE OF MESSAGE
	var data = msg["data"]
	print("je suis arriver jusque data")
	if data.has("state"):
		var state = data["state"]
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
			"action_battle":
				_action_battle(data)
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

func _action_battle(data):
	var player = null
	if not data.has("player"):
		player = data["player"]

	if player.has("currentMonster"):
		var cMonsterPlayer = player["currentMonster"]
		GeneralData.player["currentMonster"]["name"] = cMonsterPlayer["name"]
		GeneralData.player["currentMonster"]["slot"] = cMonsterPlayer["slot"]

		if cMonsterPlayer.has("life"):
			GeneralData.player["currentMonster"]["life"]["current"] = cMonsterPlayer["life"]["current"]
			GeneralData.player["currentMonster"]["life"]["max"] = cMonsterPlayer["life"]

		if cMonsterPlayer.has("skill"):
			for i in range(cMonsterPlayer["skill"].size()):
				var monsterSkill = cMonsterPlayer["skill"][i]
				GeneralData.player["currentMonster"]["skill"][i]["name"] = monsterSkill["name"]
				GeneralData.player["currentMonster"]["skill"][i]["current"] = monsterSkill["current"]
				GeneralData.player["currentMonster"]["skill"][i]["max"] = monsterSkill["max"]

		if cMonsterPlayer.has("status"):
			var status = cMonsterPlayer["status"]
			for i in range(status.size()):
				GeneralData.player["currentMonster"]["skill"][i] = status[i]
	
	if player.has("battle_team"):
		var team = GeneralData.player["battle_team"]
		for i in range(team.size()):
			var monster = player["battle_team"][i]
			GeneralData.monster["name"] = team["name"]
			GeneralData.monster["slot"] = team["slot"]
			GeneralData.monster["life"]["current"] = monster["life"]["current"]
			GeneralData.monster["life"]["max"] = team[i]["life"]["max"]
	
	if player.has("inventory"):
		for i in range(player["inventory"].size()):
			GeneralData.player["inventory"][i]["name"] = player["inventory"][i]["name"]
			GeneralData.player["inventory"][i]["scene"] = player["inventory"][i]["scene"]
			GeneralData.player["inventory"][i]["current"] = player["inventory"][i]["current"]
	
	var enemy = data["enemy"]
	if enemy.has("currentMonster"):
		var cMonster = enemy["currentMonster"]
		GeneralData.enemy["currentMonster"]["name"] = cMonster["name"]

		if cMonster.has("life"):
			GeneralData.enemy["currentMonster"]["life"]["current"] = cMonster["life"]["current"]
			GeneralData.enemy["currentMonster"]["life"]["max"] = cMonster["life"]
	
		if cMonster.has("status"):
			var status = cMonster["status"]
			for i in range(status.size()):
				GeneralData.player["currentMonster"]["skill"][i] = status[i]
	
	if data.has("text"):
		GeneralData.text = data["text"]


func _combat(data):
	if data.has("timer"):
		GeneralData.timer = data["timer"]

	if data.has("player"):
		var player = data["player"]

		if player.has("battle_team"):
			for i in range(player["battle_team"].size()):
				var team = player["battle_team"][i]
				print("voila le pq numero " + str(i) + " :")
				print(team)
				GeneralData.player["battle_team"][i]["name"] = team["name"]
				GeneralData.player["battle_team"][i]["slot"] = team["slot"]
				GeneralData.player["battle_team"][i]["life"]["current"] = team["life"]["current"]
				GeneralData.player["battle_team"][i]["life"]["max"] = team["life"]["max"]
	print("message ok est passer !!!!!!!!!!!!!!!!!!!!!")
	print(GeneralData.player["battle_team"])
	emit_signal("combat_scene")


func _team_setup(data):
	if data.has("timer"):
		GeneralData.timer = data["timer"]
	
	if data.has("player"):
		var player = data["player"]
	
		if player.has("team"):
			for i in range(player["team"].size()):
				GeneralData.player["team"][i] = player["team"][i]
		
	if data.has("enemy"):
		var enemy = data["enemy"]
	
		if enemy.has("team"):
			for i in range(enemy["team"].size()):
				GeneralData.enemy["team"][i] = enemy["team"][i]
		
		if enemy.has("id"):
			GeneralData.enemy["id"] = data["enemy"]["id"]
	
		if enemy.has("name"):
			GeneralData.enemy["name"] = data["enemy"]["name"]
			
		if enemy.has("asset"):
			GeneralData.enemy["asset"] = data["enemy"]["asset"]
	
	emit_signal("team_setup_scene")


func _update_team(data):
	if data.has("player"):
		var player = data["player"]
	
		if player.has("team"):
			var team = player["team"]
		
			for i in range(team.size()):
				GeneralData.player["team"][i] = team[i] 
			emit_signal("update_team")


func _update_inventory(data):
	if data.has("player"):
		var player = data["player"]
		for i in range(player["inventory"].size()):
			GeneralData.player["inventory"][i]["name"] = player["inventory"][i]["name"]
			GeneralData.player["inventory"][i]["scene"] = player["inventory"][i]["scene"]
			GeneralData.player["inventory"][i]["current"] = player["inventory"][i]["current"]
		emit_signal("update_inventory")


func _result_catch(data):
	if data.has("success"):
		match data["success"]:
			"ok":
				_update_team(data)
				emit_signal("catch_result", 1)
			"fail":
				emit_signal("catch_result", 0)
			_:
				emit_signal("catch_result", 0)


func _new_encounter(data):
	if data.has("current_monster"):
		GeneralData.monster_encounter = data["current_monster"]
		emit_signal("monster_encounter_received")


func _new_current_item(data):
	if data.has("current_item"):
		GeneralData.current_item = data["current_item"]
		emit_signal("item_received")


func _start_game(data):
	if data.has("timer"):
		GeneralData.timer = data["timer"]

	if data.has("player"):
		var player = data["player"]

		if player.has("id"):
			GeneralData.player["id"] = player["id"]
	
		if player.has("name"):
			GeneralData.player["name"] = player["name"]
	
		if player.has("asset"):
			GeneralData.player["asset"] = player["asset"]
		
		if player.has("team"):
			for i in range(player["team"].size()):
				GeneralData.player["team"][i] = player["team"][i]

	if data.has("current_map"):
		GeneralData.current_map = data["current_map"]

	emit_signal("start_game_scene")
