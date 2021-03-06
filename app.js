(function () {
  var dd = null

  window.expression = function (scope, str) {
    const TOKEN_STRING = /'(?:[^'\\]|\\.)*'/g
    const TOKEN_NUMBER = /[+-]?([0-9]*[.])?[0-9]+/g
    const TOKEN_INTEGER = /[+-]?[0-9]+/g
    const TOKEN_EXPRESSION = /\([^\(\)]*\)/g

    const is_str = function (r) {
      return r.substr(0, 1) == "'" && r.substr(r.length - 1) == "'"
    }
    const is_arr = function (X) {
      return X instanceof Array
    }
    const non_empty = function (r) {
      return r.length > 0
    }
    const flat = function (R, r) {
      return R.concat(is_arr(r) ? r.filter(non_empty) : [r])
    }
    const merge = function (X, Y) {
      if (!is_arr(Y)) {
        for (i = 0, y = Y, Y = []; i < X.length - 1; i++) {
          Y.push(y)
        }
      }
      var R = []
      for (i = 0; i < X.length || i < Y.length; i++) {
        if (i < X.length) {
          R.push(X[i])
        }
        if (i < Y.length) {
          R.push(Y[i])
        }
      }
      return R
    }
    str = '('+str+')'

    var R = merge(
      str.split(TOKEN_STRING),
      str.match(TOKEN_STRING)
    ).map(function (r) {
      return r.replace(/\s\s+/g, ' ').trim()
    }).filter(non_empty).map(function (r) {
      return is_str(r) ? r : r.split(' ')
    }).reduce(flat, []).map(function (r) {
      return merge(r.split('|'), '|')
    }).reduce(flat, []).map(function (r) {
      return merge(r.split('('), '(')
    }).reduce(flat, []).map(function (r) {
      return merge(r.split(')'), ')')
    }).reduce(flat, [])

    do {
      var p = -1
      var q = -1
      R.forEach(function (r, i) {
        if (q == -1 && !is_arr(r)) {
          p = r == '(' ? i : p
          q = r == ')' ? i : q
        }
      })
      if ((p < 0 && q >= 0) || (p >= 0 && q < 0)) {
        throw "unmatched parenthesis missing '"+(p < 0 ? '(' : ')')+"'"
      } else if (p >= 0) {
        var X = R.splice(p, q - p + 1)
        X.shift()
        X.pop()
        var Y = []
        do {
          var l = X.length
          X.forEach(function (x, i) {
            if (l == X.length && x == '|') {
              l = i
            }
          })
          Y.push(X.splice(0, l))
          if (X.length) {
            X.shift()
          }
          if (l == 0) {
            throw "empty pipe"
          }
        } while (X.length)

        if (!Y.length) {
          throw "empty parenthesis"
        } else {
          if (Y.length == 1) {
            Y = Y[0]
          } else {
            Y = ['|'].concat(Y)
          }
          R.splice(p, 0, Y)
        }
      } 
    } while (p != -1) 

    R = R[0]

    const resolve = function (X) {
      if (is_arr(X)) {
        var pipe = false
        if (X[0] == '|') {
          pipe = true
          X.shift()
        }
        var X = X.map(function (x) {
          return resolve(x)
        })
        if (pipe) {
          return X.reduce(function (r, x, i) {
            return i == 0 ? x : x(r)
          })
        } else {
          var F = X.shift()
          return X.length ? F(...X) : F
        }
      } else if (X == 'null') {
        return null
      } else if (X == 'true') {
        return true
      } else if (X == 'false') {
        return false
      } else if (is_str(X)) {
        return X.substr(1, X.length - 2)
      } else if (TOKEN_NUMBER.test(X)) {
        return parseFloat(X)
      } else if (TOKEN_INTEGER.test(X)) {
        return parseInt(X)
      } else {
        return X.split(".").reduce(function (ret, x) {
          return ret == null ? ret : ret[x]
        }, scope)
      }
    }

    return resolve(R)
  }

  window.render = function (scope, element, target) {
    if (target != null) {
      element = element.cloneNode(true)
    }

    while (true) {
      var x = element.querySelector('[data-x]')
      if (x == null) {
        break;
      }
      var expr = x.getAttribute('data-x')
      var E = expr.split(':')
      var a = E.shift().trim()
      expr = E.join(':')
      x.removeAttribute('data-x')
      if (a.length) {
        var old = scope[a]
      }
      var $ = expression(scope, expr)
      if ($ == null || $ === false || $ === '') {
        x.parentNode.removeChild(x)
      } else if ($ instanceof Array) {
        $.forEach(function (row) {
          var nx = x.cloneNode(true)
          x.parentNode.insertBefore(nx, x.nextSibiling)
          if (a.length) {
            scope[a] = row
          }
          render(scope, nx)
        })
        x.parentNode.removeChild(x)
      } else {
        if (a.length) {
          scope[a] = $
        }
        render(scope, x)
      }
      if (a.length) {
        scope[a] = old
      }
    }

    var interpolate = function (scope, str) {
      return str.replace(/{([^{}]*)}/g, function (raw, expr) {
        expr = expr.trim()
        raw = false
        if (expr.substr(0, 1) == '@') {
          expr = expr.substr(1).trim()
          raw = true
        }
        var r = expression(scope, expr)
        return typeof scope.escape == 'function' && !raw ?
          scope.escape(r) : String(r)
      })
    }

    var nval = interpolate(scope, element.innerHTML)
    if (nval != element.innerHTML) {
      element.innerHTML = nval
    }
    for (var i = 0; i < element.attributes.length; i++) {
      var attr = element.attributes[i]
      if (attr.specified) {
        var nval = interpolate(scope, attr.value).trim()
        if (nval != attr.value) {
          if (nval.length) {
            element.setAttribute(attr.name, nval)
          } else {
            element.removeAttribute(attr.name)
          }
        }
      }
    }

    if (target) {
      if (dd == null && window['diffDOM'] != null) {
        dd = new diffDOM.DiffDOM()
      }
      if (dd != null) {
        diff = dd.diff(target, element)
        dd.apply(target, diff)
      } else {
        target.innerHTML = element.innerHTML
      }
    }
  }
})()
