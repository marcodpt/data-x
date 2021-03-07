# data-x
A natural template engine language agnostic

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
  "pipe_keyword": "|",
  "assign_keyword": " as ",
  "iterator_keyword": " in ",
  "key_value_separator": ":",
  "string_delimiter": "'"
}
```
