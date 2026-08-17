extends Node

var TIMEOUT = 10
var TIMEVAL = 1

func wait_signal(send_func: Callable, signal_to_wait: Signal) -> bool:
	var time = 0
	var received = [false]

	var wait_task = func():
		await signal_to_wait
		received[0] = true
	wait_task.call()

	send_func.call()
	while time < TIMEOUT and not received[0]:
		await get_tree().create_timer(TIMEVAL).timeout
		time += TIMEVAL
		if not received[0] and time % 2 == 0:
			print("TIME WAITING FOR RECEIVED : ", str(time), "/", str(TIMEOUT))
#			send_func.call()
	if not received[0]:
		Network.connection = false
		print("SIGNAL NEVER RECEIVED")
	return received[0]

func wait_signal_return(send_func: Callable, signal_to_wait: Signal) -> int:
	var time = 0
	var received = [-1]

	var wait_task = func():
		received[0] = await signal_to_wait
	wait_task.call()

	send_func.call()
	while time < TIMEOUT and received[0] == -1:
		await get_tree().create_timer(TIMEVAL).timeout
		time += TIMEVAL
		if received[0] == -1 and time % 5 == 0:
			print("TIME WAITING FOR RECEIVED : ", str(time), "/", str(TIMEOUT))
#			send_func.call()
	if received[0] == -1:
		Network.connection = false
		print("SIGNAL NEVER RECEIVED")
	return received[0]


#############################################################################################################################################


#var trigger_send = false
#	
#func trigger_activation():	
#	activate_random_collectibles()
#	activate_random_trees()
#	activate_random_fishing_spots()
#	trigger_send = true
#	
#func activate_random_collectibles() -> void:
#	var collectibles = get_tree().get_nodes_in_group("collectible")
#	collectibles.shuffle()
#	var half = int(collectibles.size() / 2)
#	for i in range(half):
#		collectibles[i].set_interactable(true)
#
#@export var trees_to_activate: int = 40
#
#func activate_random_trees() -> void:
#	var trees = get_tree().get_nodes_in_group("tree")
#	trees.shuffle()
#
#	var count = min(trees_to_activate, trees.size())
#	if trees_to_activate > trees.size():
#		push_warning("trees_to_activate (%d) dépasse le nombre d'arbres présents (%d)" % [trees_to_activate, trees.size()])
#
#	for tree in trees:
#		tree.set_interactable(false)
#
#	for i in range(count):
#		trees[i].set_interactable(true)
#
#
#@export var fishing_spots_to_activate: int = 30
#
#func activate_random_fishing_spots() -> void:
#	var spots = get_tree().get_nodes_in_group("fishing_spot")
#	spots.shuffle()
#
#	var count = min(fishing_spots_to_activate, spots.size())
#	if fishing_spots_to_activate > spots.size():
#		push_warning("fishing_spots_to_activate (%d) dépasse le nombre de spots présents (%d)" % [fishing_spots_to_activate, spots.size()])
#
#	for spot in spots:
#		spot.set_interactable(false)
#
#	for i in range(count):
#		spots[i].set_interactable(true)
#
