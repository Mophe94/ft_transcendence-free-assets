extends Area2D

@export var encounter_rate: float = 0.10
@export var steps_between_rolls: int = 10
@export var encounter_cooldown: float = 1.5

var player: Node2D = null
var inside: bool = false

var step_counter: int = 0
var last_position: Vector2 = Vector2.ZERO

var rolling_lock: bool = false
var can_roll: bool = true

var danger_level: float = 0.0

#############################
func transi_close():
	var transi_scene = GeneralData.transi.instantiate()
	add_child(transi_scene)
	await transi_scene.get_node("CanvasLayer/ColorRect").close()
	transi_scene.queue_free()

func _new_encounter():
	print("signal timer received new encounter")
	GeneralData.tile = "grass"
	var send_func = func():
		Send.send_mesage(Send.SEND_TAB[Send.SEND_NAME.NEW_ENCOUNTER])
	var success = await GeneralProcess.wait_signal(send_func, Received.monster_encounter_received)

	await transi_close()
	if success:
		get_tree().change_scene_to_packed(GeneralData.capture_scene)
	else:
		get_tree().change_scene_to_packed(GeneralData.wait)
#############################

func _ready():
	body_entered.connect(_on_body_entered)
	body_exited.connect(_on_body_exited)
	randomize()

func _physics_process(_delta):
	if not inside or player == null:
		return
	_process_steps()


func _process_steps():
	var distance := player.global_position.distance_to(last_position)

	if distance > 2.0:
		step_counter += 1
		danger_level += 0.02
		danger_level = min(danger_level, 1.0)

		if step_counter >= steps_between_rolls:
			step_counter = 0
			_try_encounter()

	last_position = player.global_position


func _try_encounter():
	if rolling_lock or not can_roll:
		return

	rolling_lock = true
	can_roll = false

	var final_rate = encounter_rate + (danger_level * 0.15)
	if randf() < final_rate:
		_start_battle()
	else:
		await get_tree().create_timer(encounter_cooldown).timeout
		rolling_lock = false
		can_roll = true


func _start_battle():
	if player:
		player.set_process(false)
		player.set_physics_process(false)
	GeneralData.position_player = player.global_position
	await get_tree().create_timer(0.4).timeout
	_new_encounter()


func _on_body_entered(body):
	var root = body

	while root.get_parent() != null and not root.is_in_group("player"):
		root = root.get_parent()

	if not root.is_in_group("player"):
		return

	player = root
	inside = true
	step_counter = 0
	rolling_lock = false
	can_roll = true
	danger_level = 0.0
	last_position = player.global_position

func _on_body_exited(body):
	if player == null:
		return

	if body == player or body.get_parent() == player:
		player = null
		inside = false
		step_counter = 0
		rolling_lock = false
		can_roll = true
		danger_level = 0.0
