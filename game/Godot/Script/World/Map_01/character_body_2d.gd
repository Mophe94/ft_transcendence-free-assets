extends CharacterBody2D

@export var speed = 250
@export var control = false

func _ready():
	$Camera2D.enabled = false
	$sprite.play("idle")

func _physics_process(_delta: float) -> void:
	if control == false:
		$sprite.play("idle")
		return
	
	velocity = Input.get_vector("left", "right", "up", "down") * speed
	animat()
	move_and_slide()

func animat():
	if velocity.x < 0:
		$sprite.flip_h = true
		$sprite.play("run")
	elif velocity.x > 0:
		$sprite.flip_h = false
		$sprite.play("run")
	elif velocity == Vector2.ZERO:
		$sprite.play("idle")
