# x-template
A natural template engine language agnostic

### render a varible
```json
{"name": "John"}
```
```html
<p>Hello {{name}}!</p>
```
```html
<p>Hello John!</p>
```

### render a varible with a filter
```json
{"name": "John"}
```
```html
<p>Hello {{name | upper}}!</p>
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
<ul>
  <li data-x="person in persons">{{person}}</li>
</ul>
```
```html
<ul>
  <li>John</li>
  <li>Mary</li>
</ul>
```

### complex arrays
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
  "fields": ["name", "age"]
}
```
```html
<table>
  <tr>
    <th data-x="field in fields">{{field | title}}</th>
  </tr>
  <tr data-x="person in persons">
    <td data-x="field in fields">{{person[field]}}</td>
  </tr>
</table>
```
```html
<table>
  <tr>
    <th>Name</th>
    <th>Age</th>
  </tr>
  <tr>
    <td>John</td>
    <td>45</td>
  </tr>
  <tr>
    <td>Mary</td>
    <td>35</td>
  </tr>
</table>
```
