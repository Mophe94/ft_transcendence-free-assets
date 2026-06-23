extends CanvasLayer

@onready var label = $NinePatchRect/Label

var total_time: float = 180.0
var time_remaining: float = total_time
var last_minute: int = -1
var flashing: bool = false
var flash_timer: float = 0.0
var flash_duration: float = 1.0

func ready(): 
	_update_scale()
	get_viewport().size_changed.connect(_update_scale)

func _update_scale():
	var screen_size = get_viewport().get_visible_rect().size
	var base_size = Vector2(1920, 1080)
	var ratio = min(screen_size.x / base_size.x, screen_size.y / base_size.y)
	$NinePatchRect.scale = Vector2(ratio, ratio)
	
func _process(delta):
	if time_remaining > 0:
		time_remaining -= delta
		time_remaining = max(time_remaining, 0)
		_check_minute_change()
		_update_flash(delta)
		_update_display()
		_update_scale()
	else:
		_on_timer_finished()

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

func _on_timer_finished():
	get_tree().change_scene_to_file("res://Scene/TeamSetup/team_setup.tscn")
