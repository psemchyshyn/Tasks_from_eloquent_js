import parse from "./parse_code.js"
import topScope from './scope_definition.js'
import specialForms from "./special_forms.js"


function evaluate(expr, scope){
    if (expr.type == "value") {
        return expr.value
    } else if (expr.type == "word"){
        if (expr.name in scope) {
            return scope[expr.name]
        } else {
            throw new ReferenceError("Undefined variable")
        }
    } else if (expr.type == "apply") {
        let {operator, args} = expr
        if (operator.type == "word" && operator.name in specialForms) {
            return specialForms[operator.name](args, scope)
        } else {
            let op = evaluate(operator, scope)
            if (typeof op == "function") {
                return op(...args.map(arg => evaluate(arg, scope)))
            } else {
                throw new TypeError("Object " + op + " is not callable")
            }
        }
    }
}

// Runs the code of egg pl
function run(code) {
    evaluate(parse(code), topScope)
}
