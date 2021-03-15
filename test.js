var s = {
  R: R,
  v: v,
  data: data,
  escape: v.escapeHtml
}

var Tests = [
  "data",
  "data | R.length",
  "data | R.nth 0 | R.keys | R.length",
  "data | R.map (R.prop 'address')",
  "data | R.map (R.prop 'address') | R.filter (R.contains ' Rowe,')",
  "data | R.map (R.prop 'address') | R.filter (R.contains ' Rowe,') | R.nth 0",
  "((data | R.map (R.prop 'address')) | R.filter (R.contains ' Rowe,')) | R.nth 0"
]

Tests.forEach(function (expr) {
  console.log(expr)
  console.log(expression(s, expr))
})

var body = document.body.cloneNode(true)

render(s, body, document.body)
setTimeout(function () {
  s.data = expression(s, "data | R.project (R.split ',' '_id,name')")
  console.log(s.data)
  render(s, body, document.body)
}, 3000)
