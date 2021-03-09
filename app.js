(function (debug) {
  const expression = function (lib, scope, str) {
    var P = str.split("|").map(function (p) {
      const re = /\[[^\[\]]+\]/g
      while (re.test(p)) {
        p.replace(re, function (s) {
          return expression(lib, scope, s)
        })
      }
    })
    var v = P.pop()
    return P.reduce(function (resp, p) {
      var args = p.split(/\s+/)
      args = [resp].concat(p.split(/\s+/)).map(function (arg) {
        arg.split(".").reduce(function (scope, key) {
          if (scope != null && scope[key] != null) {
            return scope[key]
          } else {
            return null
          }
        }, scope)
      })
      var func = p.splice(1, 1)[0]
      return R[func](...p)
    }, v)
  }

  const render = function (e, scope) {

  }

  if (debug) {
    console.log("HERE!")
  }
})(true)

