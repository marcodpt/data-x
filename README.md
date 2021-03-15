# data-x
A `html` natural template engine written in `javascript`

## api
### expression (scope, str)
 - scope: Object => data scope
 - str: String => expression to eval
 - return: Object => result of evaluation

### render (scope, element, [target])
 - scope: Object => data scope
 - element: DOM Node => element to interpret, and if no `target` is passed
result will be render there
 - target: DOM Node (optional) => element to render result, if it no passed,
result will be render in `element`

