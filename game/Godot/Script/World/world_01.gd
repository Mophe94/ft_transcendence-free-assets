extends Node2D

func _stop_player():
	GeneralData.position_player = $Player/CharacterBody2D.global_position
	$Player/CharacterBody2D.control = false
	$CanvasLayer/Inventory_UI.process_mode = Node.PROCESS_MODE_DISABLED
	$CanvasLayer/Inventory_UI.hide()

func _stop_inventory():
	$Player/CharacterBody2D.control = false
	$CanvasLayer/Inventory_UI.process_mode = Node.PROCESS_MODE_DISABLED

func _run_inventory():
	$Player/CharacterBody2D.control = true
	$CanvasLayer/Inventory_UI.process_mode = Node.PROCESS_MODE_ALWAYS

#####################################
func transi_close():
	var transi_scene = GeneralData.transi.instantiate()
	add_child(transi_scene)
	await transi_scene.get_node("CanvasLayer/ColorRect").close()
#	transi_scene.queue_free()

func _team_set_up_received():
	_stop_player()
	await transi_close()
	get_tree().change_scene_to_packed(GeneralData.team_setup_scene)

func _signal_timer():
	_stop_player()     
	$Timer.send = true
	
	var send_func = func():
		null
	var success = await GeneralProcess.wait_signal(send_func, Received.team_setup_scene)

	await transi_close()
	$Timer.send = false
	if success:
		get_tree().change_scene_to_packed(GeneralData.team_setup_scene)
	else:
		get_tree().change_scene_to_packed(GeneralData.wait)
#####################################

func _ready() -> void:
	for node in get_tree().get_nodes_in_group("trigger_zone"):
		if node.has_signal("stop_player"):
			node.stop_player.connect(_stop_player)
		if node.has_signal("run_inventory"):
			node.run_inventory.connect(_run_inventory)
		if node.has_signal("stop_inventory"):
			node.stop_inventory.connect(_stop_inventory)
	$CanvasLayer/Inventory_UI.stop_inventory.connect(_stop_inventory)
	$CanvasLayer/Inventory_UI.run_inventory.connect(_run_inventory)
	
	Received.team_setup_scene.connect(_team_set_up_received)
	$Timer.time_finish.connect(_signal_timer)
	$Player/CharacterBody2D/Camera2D.enabled = true
	$Player/CharacterBody2D.control = true
	activate_random_collectibles()
	activate_random_trees()
	activate_random_fishing_spots()
	if GeneralData.position_player != Vector2(0.0, 0.0):
		$Player.position = GeneralData.position_player

func _close_game():
	if Input.is_action_just_pressed("quit"):
		get_tree().quit( )
		
func activate_random_collectibles() -> void:
	var collectibles = get_tree().get_nodes_in_group("collectible")
	collectibles.shuffle()
	var half = int(collectibles.size() / 2)
	for i in range(half):
		collectibles[i].set_interactable(true)
	
@export var trees_to_activate: int = 20

func activate_random_trees() -> void:
	var trees = get_tree().get_nodes_in_group("tree")
	trees.shuffle()

	var count = min(trees_to_activate, trees.size())
	if trees_to_activate > trees.size():
		push_warning("trees_to_activate (%d) dépasse le nombre d'arbres présents (%d)" % [trees_to_activate, trees.size()])

	for tree in trees:
		tree.set_interactable(false)

	for i in range(count):
		trees[i].set_interactable(true)


@export var fishing_spots_to_activate: int = 1

func activate_random_fishing_spots() -> void:
	var spots = get_tree().get_nodes_in_group("fishing_spot")
	spots.shuffle()

	var count = min(fishing_spots_to_activate, spots.size())
	if fishing_spots_to_activate > spots.size():
		push_warning("fishing_spots_to_activate (%d) dépasse le nombre de spots présents (%d)" % [fishing_spots_to_activate, spots.size()])

	for spot in spots:
		spot.set_interactable(false)

	for i in range(count):
		spots[i].set_interactable(true)
		

#func _unhandled_input(event: InputEvent) -> void:
#	if event is InputEventMouseButton and event.pressed:
#		var space_state = get_world_2d().direct_space_state
#		var query = PhysicsPointQueryParameters2D.new()
#		query.position = get_global_mouse_position()
#		query.collide_with_areas = true
#		query.collide_with_bodies = true
#		var result = space_state.intersect_point(query)
#		if result.is_empty():
#			print("Rien détecté à cet endroit")
#		for r in result:
#			print("Trouvé : ", r.collider.name, " -> chemin : ", r.collider.get_path())
