extends CanvasLayer
signal time_finish
@onready var label = $NinePatchRect/Label
@onready var nine_patch = $NinePatchRect
@onready var send = false
var total_time: float = GeneralData.timer - float(Time.get_unix_time_from_system())
var time_remaining: float = total_time
var last_minute: int = -1
var flashing: bool = false
var flash_timer: float = 0.0
var flash_duration: float = 1.0

func _ready():
		# TEST UNIQUEMENT - à enlever après
	time_remaining = 320.0  # 5 minutes
	_apply_scene_style()
	_update_scale()
	get_viewport().size_changed.connect(_update_scale)

func _apply_scene_style():
	var scene_name = get_tree().current_scene.name
	match scene_name:
		"world_01":
			nine_patch.visible = true
			 
		"Scene":
			nine_patch.visible = true
			nine_patch.position = Vector2(864.0,-8.0)
			
		"TeamSetup":
			nine_patch.visible = true
			nine_patch.position = Vector2(864.0,-8.0)
			  
		"Combat":
			nine_patch.visible = true
			

func _update_scale():
	var screen_size = get_viewport().get_visible_rect().size
	var base_size = Vector2(1920, 1080)
	var ratio = min(screen_size.x / base_size.x, screen_size.y / base_size.y)
	nine_patch.scale = Vector2(ratio, ratio)
	nine_patch.position.x = (screen_size.x - nine_patch.size.x * ratio) / 2
	nine_patch.position.y = 10

func _process(delta):
	if time_remaining > 0:
		time_remaining -= delta
		time_remaining = max(time_remaining, 0)
		_check_minute_change()
		_update_flash(delta)
		_update_scale()
	else:
		if !send:
			time_remaining = 0
			emit_signal("time_finish")
	_update_display()

func _check_minute_change():
	var current_minute = int(time_remaining / 60)
	if last_minute == -1:
		last_minute = current_minute
		return
	if current_minute < last_minute:
		last_minute = current_minute
		flashing = true
		flash_timer = 0.0

func _update_flash(delta):
	if flashing:
		flash_timer += delta
		label.visible = int(flash_timer * 6) % 2 == 0
		if flash_timer >= flash_duration:
			flashing = false
			label.visible = true

func _update_display():
	var minutes = int(time_remaining / 60)
	var seconds = int(time_remaining) % 60
	label.text = "%02d:%02d" % [minutes, seconds]
	if time_remaining <= 60:
		label.add_theme_color_override("font_color", Color.RED)
	else:
		label.add_theme_color_override("font_color", Color.WHITE)
