import evaluate from "./evaluate_code.js"


const specialForms = {}
specialForms.if = function(args, scope) {
    if (args.length != 3) {
        throw new SyntaxError("Wrong number of arguments to if")
    } else {
        if (evaluate(args[0], scope) === true) {
            return evaluate(args[1], scope)
        } else {
            return evaluate(args[2], scope)
        }
    }
}

specialForms.while = function (args, scope) {
    if (args.length !== 2) {
        throw new SyntaxError("Wrong number of arguments to if")
    } else {
        while (evaluate(args[0], scope) === true) {
            evaluate(args[1], scope)
        }
    }
    return false
}


specialForms.do = function(args, scope) {
    let value = false;
    for (let arg of args){
        value = evaluate(arg, scope);
    }
    return value
}


specialForms.define = function(args, scope) {
    if (args.length !== 2 || args[0].type !== "word"){
        throw new SyntaxError("Incorrect use of define")
    } else {
        let value = evaluate(args[1], scope)
        scope[args[0].name] = value
        return value
    }
}

specialForms.fun = function(args, scope) {
    if (!args.length) {
        throw new SyntaxError("Function defined without body")
    }
    let body = args[args.length - 1]
    let parameters = args.slice(0, args.length - 1).map(arg => {
        if (arg.type != "word") {
            throw new SyntaxError("Parameters should be words")
        }
        return arg.name
    })
    return function() {
        if (parameters.length != arguments.length){
            throw new TypeError("Wrong number of arguments passed to a function")
        }
        let localScope = Object.create(scope)
        for(let i = 0; i < parameters.length; i++){
            localScope[parameters[i]] = arguments[i]
        }
        return evaluate(body, localScope)
    }
}


export default specialForms;