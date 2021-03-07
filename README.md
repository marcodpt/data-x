# x-template
A natural template engine language agnostic

In all examples the json is stored in a data.json file
### render a varible
```json
{"name": "John"}
```
```html
<p data-x="data.json as x">Hello {{x.name}}!</p>
```
```html
<p>Hello John!</p>
```

### render a varible with a filter
```json
{"name": "John"}
```
```html
<p data-x="data.json as x">Hello {{x.name | upper}}!</p>
```
```html
<p>Hello JOHN!</p>
```

### simple arrays
```json
{
  "persons": ["John", "Mary"]
}
```
```html
<ul data-x="data.json">
  <li data-x="person in persons">{{person}}</li>
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
      "name": "John"
      "age": 45
    }
  }
}
```
```html
<div data-x="data.json">
  <p data-x="owner.info as p">
    Hello, my name is {{p.name}}.
    I am {{p.age}} years old.
  </p>
</div>
```
```html
<p>
  Hello, my name is John.
  I am 45 years old.
</p>
```

### complex arrays and objects
```json
{
  "persons": [
    {
      "name": "John",
      "age": 45,
      "balance": "5000"
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
<table data-x="data.json">
  <tr>
    <th>Id</th>
    <th data-x="p in schema.properties">{{p.title}}</th>
  </tr>
  <tr data-x="id:person in persons">
    <td>{{id | inc}}</td>
    <td data-x="field:p in schema.properties">{{person[field]}}</td>
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
