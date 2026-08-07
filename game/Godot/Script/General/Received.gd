extends Node

var order_action = 0
var max_action = 0
var pending_turn = null


signal start_game_scene
signal action_finished

signal monster_encounter_received
signal catch_result(success)
signal team_setup_scene
signal item_received
signal update_inventory
signal update_team

signal combat_scene

signal action
signal new_turn
signal lose
signal win
signal next_map_scene
signal change_monster
signal enemy_change_monster
signal new_current_monster
signal new_enemy_monster

signal finish


func handle_message_receive(msg):
	#VERIF GOOD MESSAGE
	print("-------- MSG RECEIVED -------- :")
	if not msg.has("event"):
		return
	if msg["event"] != "game":
		return
	if not msg.has("data"):
		return
	
	#SEARCH STATE OF MESSAGE
	var data = msg["data"]
	if data.has("state"):
		var state = data["state"]
		match state:
			"start_game": 
				_start_game(data)
				print(msg)
			"team_setup":
				_team_setup(data)
				print(msg)
			"new_current_item":
				_new_current_item(data)
				print(msg)
			"new_encounter":
				_new_encounter(data)
				print(msg)
			"result_catch":
				_result_catch(data)
				print(msg)
			"update_team":
				_update_team(data)
				print(msg)
			"update_inventory":
				_update_inventory(data)
				print(msg)
			"combat":
				_combat(data)
				print(msg)
			"action_battle":
				await _action_battle(data)
				print("state : " + state + " changemonster : " + str(data["change_monster"]) + " text" + data["player"]["text"])
			"new_turn":
				print("state : " + state + " time : " + str(data["timer"]))
				await _new_turn(data)
			"lose":
				print("state : " + state)
				await _lose(data)
			"win":
				print("state : " + state)
				await _win(data)
			"change_monster":
				print("state : " + state + " changemonster : " + " text" + data["player"]["text"])
				await _change_monster(data)
			"enemy_change_monster":
				print("state : " + state + " changemonster : " + " text" + data["player"]["text"])
				await _enemy_change_monster(data)
			"next_map":
				print("state : " + state + " time : " + str(data["timer"]))
				await _next_map(data)
			"finish":
				print("state : " + state)
				emit_signal("finish")
			_:
				print("data match with nothing")
	else:
		print("func handle_message_receive STATE missing")


func _finish():
	finish.emit()

func _next_map(data):
	if data.has("current_map"):
		GeneralData.current_map = data["current_map"]
		
	var player = null
	if data.has("player"):
		player = data["player"]

	if player.has("currentMonster"):
		var cMonsterPlayer = player["currentMonster"]
		GeneralData.player["currentMonster"]["name"] = cMonsterPlayer["name"]
		GeneralData.player["currentMonster"]["slot"] = int(cMonsterPlayer["slot"])

		if cMonsterPlayer.has("life"):
			GeneralData.player["currentMonster"]["life"]["current"] = int(cMonsterPlayer["life"]["current"])
			GeneralData.player["currentMonster"]["life"]["max"] = int(cMonsterPlayer["life"]["max"])

		if cMonsterPlayer.has("skill"):
			for i in range(cMonsterPlayer["skill"].size()):
				var monsterSkill = cMonsterPlayer["skill"][i]
				GeneralData.player["currentMonster"]["skill"][i]["name"] = monsterSkill["name"]
				GeneralData.player["currentMonster"]["skill"][i]["current"] = int(monsterSkill["current"])
				GeneralData.player["currentMonster"]["skill"][i]["max"] = int(monsterSkill["max"])

		if cMonsterPlayer.has("status"):
			var status = cMonsterPlayer["status"]
			GeneralData.player["currentMonster"]["status"] = status.duplicate()
	
	if player.has("battle_team"):
		var battle_team = player["battle_team"]
		for i in range(battle_team.size()):
			var monster = battle_team[i]
			GeneralData.player["battle_team"][i]["name"] = monster["name"]
			GeneralData.player["battle_team"][i]["slot"] = int(monster["slot"])
			GeneralData.player["battle_team"][i]["life"]["current"] = int(monster["life"]["current"])
			GeneralData.player["battle_team"][i]["life"]["max"] = int(monster["life"]["max"])
	
	if player.has("inventory"):
		for i in range(player["inventory"].size()):
			GeneralData.player["inventory"][i]["name"] = player["inventory"][i]["name"]
			GeneralData.player["inventory"][i]["scene"] = player["inventory"][i]["scene"]
			GeneralData.player["inventory"][i]["current"] = int(player["inventory"][i]["current"])

	var enemy = data["enemy"]
	if enemy.has("currentMonster"):
		var cMonster = enemy["currentMonster"]
		GeneralData.enemy["currentMonster"]["name"] = cMonster["name"]

		if cMonster.has("life"):
			GeneralData.enemy["currentMonster"]["life"]["current"] = int(cMonster["life"]["current"])
			GeneralData.enemy["currentMonster"]["life"]["max"] = int(cMonster["life"]["max"])
	
		if cMonster.has("status"):
			var status = cMonster["status"]
			GeneralData.enemy["currentMonster"]["status"] = status.duplicate()
	
	if player.has("text"):
		GeneralData.text = player["text"]
	emit_signal("next_map_scene")


func _new_turn(data):
	if max_action > 0 && order_action < max_action:
		pending_turn = data
	else:
		if data.has("timer"):
			GeneralData.timer = data["timer"]
		if data.has("player"):
			var player = data["player"]
			if player.has("text"):
				GeneralData.text = player["text"]
		max_action = 0
		order_action = 0
		pending_turn = null
		emit_signal("new_turn")


func _win(data):
	win.emit()


func _lose(data):
	lose.emit()


func _change_monster(data):
	if data.has("timer"):
		GeneralData.timer = data["timer"]

	var player = null
	if data.has("player"):
		player = data["player"]

	if player.has("text"):
		GeneralData.text = player["text"]
	change_monster.emit()
	await action_finished


func _enemy_change_monster(data):
	if data.has("timer"):
		GeneralData.timer = data["timer"]

	var player = null
	if data.has("player"):
		player = data["player"]

	if player.has("text"):
		GeneralData.text = player["text"]
	enemy_change_monster.emit()
	await action_finished


func _action_battle(data):
	var signal_to_send = ""
	var change = -5
	
	if data.has("max"):
		max_action = int(data["max"])
	
	if data.has("order"):
		order_action = int(data["order"])

	if data.has("change_monster"):
		change = int(data["change_monster"])
		if change == GeneralData.player["id"]:
			signal_to_send = "new_current_monster"
		elif change >= 0:
			signal_to_send = "new_enemy_monster"
		else:
			signal_to_send = "action"
	
	var player = null
	if data.has("player"):
		player = data["player"]

	if player.has("currentMonster"):
		var cMonsterPlayer = player["currentMonster"]
		GeneralData.player["currentMonster"]["name"] = cMonsterPlayer["name"]
		GeneralData.player["currentMonster"]["slot"] = int(cMonsterPlayer["slot"])

		if cMonsterPlayer.has("life"):
			GeneralData.player["currentMonster"]["life"]["current"] = int(cMonsterPlayer["life"]["current"])
			GeneralData.player["currentMonster"]["life"]["max"] = int(cMonsterPlayer["life"]["max"])

		if cMonsterPlayer.has("skill"):
			for i in range(cMonsterPlayer["skill"].size()):
				var monsterSkill = cMonsterPlayer["skill"][i]
				GeneralData.player["currentMonster"]["skill"][i]["name"] = monsterSkill["name"]
				GeneralData.player["currentMonster"]["skill"][i]["current"] = int(monsterSkill["current"])
				GeneralData.player["currentMonster"]["skill"][i]["max"] = int(monsterSkill["max"])

		if cMonsterPlayer.has("status"):
			var status = cMonsterPlayer["status"]
			GeneralData.player["currentMonster"]["status"] = status.duplicate()
	
	if player.has("battle_team"):
		var battle_team = player["battle_team"]
		for i in range(battle_team.size()):
			var monster = battle_team[i]
			GeneralData.player["battle_team"][i]["name"] = monster["name"]
			GeneralData.player["battle_team"][i]["slot"] = int(monster["slot"])
			GeneralData.player["battle_team"][i]["life"]["current"] = int(monster["life"]["current"])
			GeneralData.player["battle_team"][i]["life"]["max"] = int(monster["life"]["max"])
	
	if player.has("inventory"):
		for i in range(player["inventory"].size()):
			GeneralData.player["inventory"][i]["name"] = player["inventory"][i]["name"]
			GeneralData.player["inventory"][i]["scene"] = player["inventory"][i]["scene"]
			GeneralData.player["inventory"][i]["current"] = int(player["inventory"][i]["current"])

	var enemy = data["enemy"]
	if enemy.has("currentMonster"):
		var cMonster = enemy["currentMonster"]
		GeneralData.enemy["currentMonster"]["name"] = cMonster["name"]

		if cMonster.has("life"):
			GeneralData.enemy["currentMonster"]["life"]["current"] = int(cMonster["life"]["current"])
			GeneralData.enemy["currentMonster"]["life"]["max"] = int(cMonster["life"]["max"])
	
		if cMonster.has("status"):
			var status = cMonster["status"]
			GeneralData.enemy["currentMonster"]["status"] = status.duplicate()
	
	if player.has("text"):
		GeneralData.text = player["text"]

#	print("signal emit for change monster end of parse :\n\n")
#	print(signal_to_send)
	emit_signal(signal_to_send)
	await action_finished
	if pending_turn && order_action >= max_action:
		_new_turn(pending_turn)

func _combat(data):
	if data.has("timer"):
		GeneralData.timer = data["timer"]

	if data.has("player"):
		var player = data["player"]

		if player.has("battle_team"):
			for i in range(player["battle_team"].size()):
				var team = player["battle_team"][i]
				GeneralData.player["battle_team"][i]["name"] = team["name"]
				GeneralData.player["battle_team"][i]["slot"] = int(team["slot"])
				GeneralData.player["battle_team"][i]["life"]["current"] = int(team["life"]["current"])
				GeneralData.player["battle_team"][i]["life"]["max"] = int(team["life"]["max"])
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
			GeneralData.player["inventory"][i]["current"] = int(player["inventory"][i]["current"])
		emit_signal("update_inventory")


func _result_catch(data):
	if data.has("success"):
		match data["success"]:
			"ok":
				_update_team(data)
				emit_signal("catch_result", 0)
			"fail":
				emit_signal("catch_result", 1)
			"flee":
				emit_signal("catch_result", 2)
			_:
				emit_signal("catch_result", 1)


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
