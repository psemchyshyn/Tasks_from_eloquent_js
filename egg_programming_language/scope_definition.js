const topScope = Object.create(null)

topScope.true = true
topScope.false = false

for (let op of ["+", "-", "*", "/", "==", "<", ">"]) {
    topScope[op] = Function("a, b", `return a ${op} b`)
}

topScope.print = function(value) {
    console.log(value)
    return value
}

topScope.array = function(...array) {
    return array
}

topScope.length = function(array) {
  	if (typeof array != "object"){
    	throw new TypeError("Argument should be an array")
    }
    return array.length
}

class IndexError extends Error {}
topScope.element = function(array, index) {
    if (typeof array != "object") {
        throw new TypeError("First argument must be array")
    }
    if (!(0 <= index <= array.length - 1)){
        throw IndexError("Index out of range")
    }

    return array[index]
}

export default topScope;