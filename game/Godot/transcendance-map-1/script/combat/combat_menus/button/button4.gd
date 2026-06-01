extends Button

signal action_pressed(action, object)

@export var action := ""
@export var object = ""

func _ready():
	pressed.connect(_on_pressed)

func _on_pressed():
	action_pressed.emit(action, object)
