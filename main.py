def update_function_negative(previous: number, learningRate: number):
    return previous + learningRate * (-1 * discount_factor - previous)
def choose_move(lineState: number):
    global Max, Move
    if QT_Back[lineState] > QT_Forward[lineState]:
        Max = QT_Back[lineState]
        Move = 1
    else:
        Max = QT_Forward[lineState]
        Move = 0
    if QT_Left[lineState] > Max:
        Max = QT_Left[lineState]
        Move = 2
    if QT_Right[lineState] > Max:
        Max = QT_Right[lineState]
        Move = 3
    if Move == 0:
        cuteBot.move_time(cuteBot.Direction.FORWARD, 25, 0.1)
    elif Move == 1:
        cuteBot.motors(randint(-25, 25), randint(-25, 25))
        basic.pause(100)
        cuteBot.stopcar()
        cuteBot.motors(0, 0)
    elif Move == 2:
        cuteBot.move_time(cuteBot.Direction.LEFT, 25, 0.1)
    else:
        cuteBot.move_time(cuteBot.Direction.RIGHT, 25, 0.1)
def update_function_positive(previous2: number, learningRate2: number):
    return previous2 + learningRate2 * (discount_factor - previous2)
def update_q_table():
    if Move == 0:
        if cuteBot.tracking(cuteBot.TrackingState.L_R_LINE):
            QT_Forward[line_state] = update_function_positive(QT_Forward[line_state], 0.1)
        else:
            QT_Forward[line_state] = update_function_negative(QT_Forward[line_state], 0.1)
    if Move == 1:
        if cuteBot.tracking(cuteBot.TrackingState.L_R_LINE):
            QT_Back[line_state] = update_function_positive(QT_Back[line_state], 0.1)
        elif cuteBot.tracking(cuteBot.TrackingState.L_UNLINE_R_LINE) or cuteBot.tracking(cuteBot.TrackingState.L_UNLINE_R_LINE):
            QT_Back[line_state] = update_function_positive(QT_Back[line_state], 0.1)
        else:
            QT_Back[line_state] = update_function_negative(QT_Back[line_state], 0.1)
    if Move == 2:
        if cuteBot.tracking(cuteBot.TrackingState.L_R_LINE):
            QT_Left[line_state] = update_function_positive(QT_Left[line_state], 0.1)
        elif cuteBot.tracking(cuteBot.TrackingState.L_LINE_R_UNLINE):
            QT_Left[line_state] = update_function_positive(QT_Left[line_state], 0.1)
        elif cuteBot.tracking(cuteBot.TrackingState.L_UNLINE_R_LINE):
            QT_Left[line_state] = update_function_negative(QT_Left[line_state], 0.1)
        else:
            QT_Left[line_state] = update_function_negative(QT_Left[line_state], 0.1)
    if Move == 3:
        if cuteBot.tracking(cuteBot.TrackingState.L_R_LINE):
            QT_Right[line_state] = update_function_positive(QT_Right[line_state], 0.1)
        elif cuteBot.tracking(cuteBot.TrackingState.L_UNLINE_R_LINE):
            QT_Right[line_state] = update_function_positive(QT_Right[line_state], 0.1)
        elif cuteBot.tracking(cuteBot.TrackingState.L_UNLINE_R_LINE):
            QT_Right[line_state] = update_function_negative(QT_Right[line_state], 0.1)
        else:
            QT_Right[line_state] = update_function_negative(QT_Right[line_state], 0.1)

def on_button_pressed_ab():
    global simulate
    if simulate == 1:
        simulate = 0
    else:
        simulate = 1
input.on_button_pressed(Button.AB, on_button_pressed_ab)

def feedback_for_q_table(feedback: str):
    if Move == 0:
        if feedback == "good":
            QT_Forward[line_state] = update_function_positive(QT_Forward[line_state], 0.25)
        else:
            QT_Forward[line_state] = update_function_negative(QT_Forward[line_state], 0.25)
    if Move == 1:
        if feedback == "good":
            QT_Back[line_state] = update_function_positive(QT_Back[line_state], 0.25)
        else:
            QT_Back[line_state] = update_function_negative(QT_Back[line_state], 0.25)
    if Move == 2:
        if feedback == "good":
            QT_Left[line_state] = update_function_positive(QT_Left[line_state], 0.25)
        else:
            QT_Left[line_state] = update_function_negative(QT_Left[line_state], 0.25)
    if Move == 3:
        if feedback == "good":
            QT_Right[line_state] = update_function_positive(QT_Right[line_state], 0.25)
        else:
            QT_Right[line_state] = update_function_negative(QT_Right[line_state], 0.25)
line_state = 0
Move = 0
Max = 0
discount_factor = 0
QT_Back: List[number] = []
QT_Right: List[number] = []
QT_Left: List[number] = []
QT_Forward: List[number] = []
simulate = 0
simulate = 0
QT_Forward = [0, 0, 0, 0]
QT_Left = [0, 0, 0, 0]
QT_Right = [0, 0, 0, 0]
QT_Right = [0, 0, 0, 0]
QT_Back = [0, 0, 0, 0]
discount_factor = 0.7

def on_forever():
    global line_state
    if cuteBot.tracking(cuteBot.TrackingState.L_R_LINE):
        line_state = 0
        basic.show_number(0)
    elif cuteBot.tracking(cuteBot.TrackingState.L_R_UNLINE):
        line_state = 1
        basic.show_number(1)
    elif cuteBot.tracking(cuteBot.TrackingState.L_LINE_R_UNLINE):
        line_state = 2
        basic.show_number(2)
    else:
        line_state = 3
        basic.show_number(3)
    choose_move(line_state)
    if simulate == 1:
        basic.pause(100)
        basic.show_string("?")
        while True:
            if input.button_is_pressed(Button.A):
                feedback_for_q_table("good")
                break
            elif input.button_is_pressed(Button.B):
                feedback_for_q_table("bad")
                break
            else:
                continue
    else:
        update_q_table()
basic.forever(on_forever)
