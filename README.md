# data-x
A `html` natural template engine language agnostic

## Examples
In all examples the json is stored in a `data.json` file

### render a varible
```json
{
  "name": "John"
}
```
```html
<p data-x="'data.json' as x">Hello {{x.name}}!</p>
```
```html
<p>Hello John!</p>
```

### render a varible with a filter
```json
{
  "name": "John"
}
```
```html
<p data-x="'data.json' as x">Hello {{x.name | upper}}!</p>
```
```html
<p>Hello JOHN!</p>
```

### conditionals and render
```json
{
  "name": "John",
  "age": 45,
  "active": true,
  "balance": 5000,
  "avatar": "<img src=\"john.jpg\"/>"
}
```
```html
<div data-x="'data.json' as x">
  <p>Name: {{x.name}}</p>
  <p data-x="x.active">Is active</p>
  <p data-x="x.active | not">Is not active</p>
  <p data-x="x.age | gt 35">Is older than Mary</p>
  <p data-x="x.age | lte 35">Is not older than Mary</p>
  <div data-x="x.avatar" />
  <p data-x="x.avatar | not">No avatar available!</p>
  <div data-x="x.thumbnail" />
  <p data-x="x.thumbnail | not">No thumbnail available!</p>
</div>
```
```html
<div>
  <p>Name: John</p>
  <p>Is active</p>
  <p>Is older than Mary</p>
  <div><img src="john.jpg"/></div>
  <p>No thumbnail available!</p>
</div>
```

### simple arrays
```json
{
  "persons": ["John", "Mary"]
}
```
```html
<ul data-x="'data.json' as x">
  <li data-x="person in x.persons">{{person}}</li>
</ul>
```
```html
<ul>
  <li>John</li>
  <li>Mary</li>
</ul>
```

### simple objects
```json
{
  "owner": {
    "info": {
      "name": "John",
      "age": 45
    }
  }
}
```
```html
<div data-x="'data.json' as x">
  <p data-x="x.owner.info as p">
    Hello, my name is {{p.name}}.
    I am {{p.age}} years old.
  </p>
</div>
```
```html
<div>
  <p>
    Hello, my name is John.
    I am 45 years old.
  </p>
</div>
```

### complex arrays and objects
```json
{
  "persons": [
    {
      "name": "John",
      "age": 45,
      "balance": 5000
    }, {
      "name": "Mary",
      "age": 35
    }
  ],
  "schema": {
    "properties": {
      "name": {
        "title": "Name"
      },
      "age": {
        "title": "Age"
      }
    }
  }
}
```
```html
<table data-x="'data.json' as x">
  <tr>
    <th>Id</th>
    <th data-x="p in x.schema.properties">{{p.title}}</th>
  </tr>
  <tr data-x="id:person in x.persons">
    <td>{{id | inc}}</td>
    <td data-x="field:p in x.schema.properties">{{person[field]}}</td>
  </tr>
</table>
```
```html
<table>
  <tr>
    <th>Id</th>
    <th>Name</th>
    <th>Age</th>
  </tr>
  <tr>
    <td>1</td>
    <td>John</td>
    <td>45</td>
  </tr>
  <tr>
    <td>2</td>
    <td>Mary</td>
    <td>35</td>
  </tr>
</table>
```

## Config
the template function should accept a `config.json` file defined as bellow
```json
{
  "attribute": "data-x",
  "delimiter_start": "{{",
  "delimiter_end": "}}",
  "eval_start": "[",
  "eval_end": "]",
  "pipe_keyword": "|",
  "assign_keyword": " as ",
  "iterator_keyword": " in ",
  "key_value_separator": ":",
  "string_delimiter": "'"
}
```

## Api
Any implementation should build this minimum api, be free to extend it!
All necessary adaptions for a given programming language should be done with
minimum changes in this api!

### new(loader(src: String), config(data: Object))
The constructor should accept two parameters:
 - `loader` is a function that recieve the `src` path of a resource and
responde with the resource.
In our example `loader` should be invoked to resolve `data.json`
 - `config` is the object with the engine configuration. The defaults should
be just like the definition in section Config

### filter(name: String, filter(data: String, args: [String]))
 - `name` is the name of filter, it would be nice to allow users redefine a
filter using it old definition. 
 - `filter` is a function that take the data passed to filter and an array of
extra arguments and should respond the new data.

### resolve(scope: Any, expression: String)
 - `scope` is the current scope
 - `expression` is a given expression
This function should evaluate expression in a given scope and return data

## Filters
Any implementation should implement all this filters for a given `data` input

### has (Any -> Boolean)
 - `data` is an `array` or `string` should resolve `true` if not empty `false` otherwise
 - `data` is `null` should resove `false`
 - `data` is `object` empty or not should always resolve `true`
 - `data` is `boolean` should resolve itself
 - `data` is number should resolve `false` if `zero`, `true` otherwise

### not (Any -> Boolean)
 - apply `has` on `data` and negate it

### is [type] (Any [String] -> Boolean)
 - check if `data` is of the given `type` in `args`

### eq [value] (Any [Any] -> Boolean)
 - check if `data` is equals `value`

### ne [value] (Any [Any] -> Boolean)
 - check if `data` is not equals `value`

### gt [value] (Any [Any] -> Boolean)
 - check if `data` is greater than `value`

### gte [value] (Any [Any] -> Boolean)
 - check if `data` is greater than or equals `value`

### lt [value] (Any [Any] -> Boolean)
 - check if `data` is less than `value`

### lte [value] (Any [Any] -> Boolean)
 - check if `data` is less than or equals `value`
