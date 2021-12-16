## Paso 1 :
copiar en una sola linea el siguiente codigo en la consola del navegador

```javascript
const script1 = document.createElement('script');
script1.src = 'https://unpkg.com/dexie/dist/dexie.js';
document.body.appendChild(script1);
```

## Paso 2 :
copiar en una sola linea el siguiente codigo en la consola del navegador

```javascript
const theDBName =  'analitics_Events'
```


## Paso 3 :
copiar en una sola linea el siguiente codigo en la consola del navegador

```javascript
let theDB = new Dexie(theDBName);
let {verno, tables} = await theDB.open();
theDB.close();
theDB = new Dexie(theDBName);
theDB.version(verno).stores(tables.reduce((p,c) => {p[c.name] = c.schema.primKey.keyPath || ''; return p;}, {}));
const items =  await theDB.events.toArray();
const itemsParsed =  JSON.stringify(items);
var blob = new Blob([itemsParsed] ,{type: "application/json"});
var url  = URL.createObjectURL(blob);

```

## Paso 4

