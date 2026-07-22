extends Node

var TIMEOUT = 10.0
var TIMEVAL = 2.0

func wait_signal(send_func: Callable, signal_to_wait: Signal) -> bool:
	var time = 0.0
	var received = false

	var wait_task = func():
		await signal_to_wait
		received = true
	wait_task.call()

	send_func.call()
	while time < TIMEOUT and not received:
		await get_tree().create_timer(TIMEVAL).timeout
		time += TIMEVAL
		print("TIME WAITING FOR RECEIVED : ", str(time), "/", str(TIMEOUT))
		if not received:
			send_func.call()
	if not received:
		Network.connection = false
		print("SIGNAL NEVER RECEIVED")
	return received
