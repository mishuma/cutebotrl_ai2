function update_function_negative (previous: number, learningRate: number) {
    return previous + learningRate * (-1 * discount_factor - previous)
}
datalogger.onLogFull(function () {
    basic.showString("Log full!")
    basic.pause(5000)
})
function choose_move (lineState: number) {
    if (QT_Back[lineState] > QT_Forward[lineState]) {
        Max = QT_Back[lineState]
        Move = 1
    } else {
        Max = QT_Forward[lineState]
        Move = 0
    }
    if (QT_Left[lineState] > Max) {
        Max = QT_Left[lineState]
        Move = 2
    }
    if (QT_Right[lineState] > Max) {
        Max = QT_Right[lineState]
        Move = 3
    }
    if (Move == 0) {
        cuteBot.moveTime(cuteBot.Direction.forward, 25, 0.1)
    } else if (Move == 1) {
        cuteBot.motors(randint(-25, 25), randint(-25, 25))
        basic.pause(100)
        cuteBot.stopcar()
        cuteBot.motors(0, 0)
    } else if (Move == 2) {
        cuteBot.moveTime(cuteBot.Direction.left, 25, 0.1)
    } else {
        cuteBot.moveTime(cuteBot.Direction.right, 25, 0.1)
    }
}
bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.StickFigure)
})
bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.No)
})
function update_function_positive (previous2: number, learningRate2: number) {
    return previous2 + learningRate2 * (discount_factor - previous2)
}
function update_q_table () {
    if (Move == 0) {
        if (cuteBot.tracking(cuteBot.TrackingState.L_R_line)) {
            QT_Forward[line_state] = update_function_positive(QT_Forward[line_state], 0.1)
        } else {
            QT_Forward[line_state] = update_function_negative(QT_Forward[line_state], 0.1)
        }
    }
    if (Move == 1) {
        if (cuteBot.tracking(cuteBot.TrackingState.L_R_line)) {
            QT_Back[line_state] = update_function_positive(QT_Back[line_state], 0.1)
        } else if (cuteBot.tracking(cuteBot.TrackingState.L_unline_R_line) || cuteBot.tracking(cuteBot.TrackingState.L_unline_R_line)) {
            QT_Back[line_state] = update_function_positive(QT_Back[line_state], 0.1)
        } else {
            QT_Back[line_state] = update_function_negative(QT_Back[line_state], 0.1)
        }
    }
    if (Move == 2) {
        if (cuteBot.tracking(cuteBot.TrackingState.L_R_line)) {
            QT_Left[line_state] = update_function_positive(QT_Left[line_state], 0.1)
        } else if (cuteBot.tracking(cuteBot.TrackingState.L_line_R_unline)) {
            QT_Left[line_state] = update_function_positive(QT_Left[line_state], 0.1)
        } else if (cuteBot.tracking(cuteBot.TrackingState.L_unline_R_line)) {
            QT_Left[line_state] = update_function_negative(QT_Left[line_state], 0.1)
        } else {
            QT_Left[line_state] = update_function_negative(QT_Left[line_state], 0.1)
        }
    }
    if (Move == 3) {
        if (cuteBot.tracking(cuteBot.TrackingState.L_R_line)) {
            QT_Right[line_state] = update_function_positive(QT_Right[line_state], 0.1)
        } else if (cuteBot.tracking(cuteBot.TrackingState.L_unline_R_line)) {
            QT_Right[line_state] = update_function_positive(QT_Right[line_state], 0.1)
        } else if (cuteBot.tracking(cuteBot.TrackingState.L_unline_R_line)) {
            QT_Right[line_state] = update_function_negative(QT_Right[line_state], 0.1)
        } else {
            QT_Right[line_state] = update_function_negative(QT_Right[line_state], 0.1)
        }
    }
    save_QT_Move()
}
input.onButtonPressed(Button.AB, function () {
    basic.showString(control.deviceName())
})
function save_QT_Move () {
    datalogger.includeTimestamp(FlashLogTimeStampFormat.Milliseconds)
    datalogger.log(
    datalogger.createCV("QT_Forward", QT_Forward),
    datalogger.createCV("QT_Back", QT_Back),
    datalogger.createCV("QT_Left", QT_Left),
    datalogger.createCV("QT_Right", QT_Right)
    )
    datalogger.mirrorToSerial(false)
}
function feedback_for_q_table (feedback: string) {
    if (Move == 0) {
        if (feedback == "good") {
            QT_Forward[line_state] = update_function_positive(QT_Forward[line_state], 0.25)
        } else {
            QT_Forward[line_state] = update_function_negative(QT_Forward[line_state], 0.25)
        }
    }
    if (Move == 1) {
        if (feedback == "good") {
            QT_Back[line_state] = update_function_positive(QT_Back[line_state], 0.25)
        } else {
            QT_Back[line_state] = update_function_negative(QT_Back[line_state], 0.25)
        }
    }
    if (Move == 2) {
        if (feedback == "good") {
            QT_Left[line_state] = update_function_positive(QT_Left[line_state], 0.25)
        } else {
            QT_Left[line_state] = update_function_negative(QT_Left[line_state], 0.25)
        }
    }
    if (Move == 3) {
        if (feedback == "good") {
            QT_Right[line_state] = update_function_positive(QT_Right[line_state], 0.25)
        } else {
            QT_Right[line_state] = update_function_negative(QT_Right[line_state], 0.25)
        }
    }
    save_QT_Move()
}
let line_state = 0
let Move = 0
let Max = 0
let discount_factor = 0
let QT_Back: number[] = []
let QT_Right: number[] = []
let QT_Left: number[] = []
let QT_Forward: number[] = []
bluetooth.startUartService()
basic.showString(control.deviceName().substr(0, 3))
let simulate = 0
QT_Forward = [
0,
0,
0,
0
]
QT_Left = [
0,
0,
0,
0
]
QT_Right = [
0,
0,
0,
0
]
QT_Back = [
0,
0,
0,
0
]
discount_factor = 0.7
basic.forever(function () {
    if (cuteBot.tracking(cuteBot.TrackingState.L_R_line)) {
        line_state = 0
        basic.showNumber(0)
    } else if (cuteBot.tracking(cuteBot.TrackingState.L_R_unline)) {
        line_state = 1
        basic.showNumber(1)
    } else if (cuteBot.tracking(cuteBot.TrackingState.L_line_R_unline)) {
        line_state = 2
        basic.showNumber(2)
    } else {
        line_state = 3
        basic.showNumber(3)
    }
    choose_move(line_state)
    if (simulate == 1) {
        basic.pause(100)
        basic.showString("?")
        while (true) {
            if (input.buttonIsPressed(Button.A)) {
                feedback_for_q_table("good")
                break;
            } else if (input.buttonIsPressed(Button.B)) {
                feedback_for_q_table("bad")
                break;
            } else {
                continue;
            }
        }
    } else {
        update_q_table()
    }
})
