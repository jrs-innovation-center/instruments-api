# Musical Instruments

Create a RESTful api that helps to manage a list of musical instruments.  Include scripts to load data and indexes.  Provide developer documentation to minimize on-boarding friction.  

1) Sign in to your GitHub account and fork the following repo:

```
https://github.com/jrs-innovation-center/instruments-api
```

2) Clone your copy of the repo to your local machine and install the project's dependencies.

```
$ git clone <url>
$ cd instruments-api
$ yarn
```


## Steps

Successfully complete the first X steps to receive a grade of 'Meets Expectations'.  Additionally, successfully complete steps Y and Z to receive a grade of 'Exceeds Expectations'. Complete additional steps to receive a grade of 'Outstanding'.

### Step 1

- Add a file named **load-data.js**.  Create a program that adds the following instruments into a CouchDB database named `{your first name}Instruments`.  Ex:  `TripInstruments`:

> When interacting with CouchDB in Cloudant, remember to keep your API key and password (secret) safe.

```
[
{
  "_id": "instrument_cello_cello_platinum",
  "name": "Cello Platinum",
  "type": "instrument",
  "category": "cello",
  "group": "strings",
  "retailPrice": 600,
  "manufacturer": "Strings, Inc."
},
{
  "_id": "instrument_cello_cello_silver",
  "name": "Cello Silver",
  "type": "instrument",
  "category": "cello",
  "group": "strings",
  "retailPrice": 350,
  "manufacturer": "Strings, Inc."
},
{
  "_id": "instrument_oboe_oboe_beethoven",
  "name": "Oboe Beethoven",
  "type": "instrument",
  "category": "Oboe",
  "group": "winds",
  "retailPrice": 599,
  "manufacturer": "Symphonic, Inc."
},
{
  "_id": "instrument_piccolo_piccolo_bach",
  "name": "Piccolo Bach",
  "type": "instrument",
  "category": "piccolo",
  "group": "winds",
  "retailPrice": 300,
  "manufacturer": "Symphonic, Inc."
},
{
  "_id": "instrument_piccolo_piccolo_beethoven",
  "name": "Piccolo Beethoven",
  "type": "instrument",
  "category": "piccolo",
  "group": "winds",
  "retailPrice": 500,
  "manufacturer": "Symphonic, Inc."
},
{
  "_id": "instrument_saxophone_jazzy_100",
  "name": "Jazzy 100",
  "type": "instrument",
  "category": "saxophone",
  "group": "winds",
  "retailPrice": 300,
  "manufacturer": "Musical Winds, Inc."
},
{
  "_id": "instrument_saxophone_jazzy_200",
  "name": "Jazzy 200",
  "type": "instrument",
  "category": "saxophone",
  "group": "winds",
  "retailPrice": 400,
  "manufacturer": "Musical Winds, Inc."
},
{
  "_id": "instrument_tuba_tubanator",
  "name": "Tubanator",
  "type": "instrument",
  "category": "tuba",
  "group": "brass",
  "retailPrice": 400,
  "manufacturer": "Brasstastic, Inc."
},
{
  "_id": "instrument_viola_standard_100",
  "name": "Standard 100",
  "type": "instrument",
  "category": "viola",
  "group": "strings",
  "retailPrice": 299,
  "manufacturer": "String Music, Inc."
},
{
  "_id": "instrument_violin_delux_200",
  "name": "Delux 200",
  "type": "instrument",
  "category": "violin",
  "group": "strings",
  "retailPrice": 599,
  "manufacturer": "Violins, Inc."
},
{
  "_id": "instrument_violin_delux_300",
  "name": "Delux 300",
  "type": "instrument",
  "category": "violin",
  "group": "strings",
  "retailPrice": 599,
  "manufacturer": "Violins, Inc."
}
]
```

- Within your **package.json**, create a `load` script that runs your **load-data.js** program.

### Step 2

- Create the following Mango query indexes.  Create one index per field. Put the indexes within a file named **load-index.js**.  See https://pouchdb.com/guides/mango-queries.html.  

  - `type`
  - `name`
  - `category`
  - `group`
  - `retailPrice`
  - `manufacturer`

- Within your **package.json**, create a `loadIndex` script that runs your **load-index.js** program and creates the indexes.

### Step 3

Review the information below and create the described functionality.

- Create an instrument

  `POST  /instruments`  

  Creates an instrument.  The request body must contain a JSON object that represents the instrument being created.  The request body must include the `name`, `category`, `group`, `retailPrice`, and `manufacturer` fields.

  **Sample Request**

  ```
  POST /instruments
  ```

  **Sample Request Body JSON Data**

  ```
  {
      "name": "Tuba Delux",
      "category": "tuba",
      "group": "brass",
      "retailPrice": 300,
      "manufacturer": "Symphonic, Inc."
  }
  ```

  **Sample Response**

  ```
  {
    "ok": true,
    "id": "instrument_tuba_tuba_delux",
    "rev": "1-c617189487fbe325d01cb7fc74acf45b"
  }
  ```

- Retrieve an instrument

  `GET  /instruments/:id`  

  Retrieves a specific instrument as identified by the `:id` path parameter.

  **Sample Request**

  ```
  GET /instruments/instrument_tuba_tuba_delux
  ```

  **Sample Response**

  ```
  {
    "_id": "instrument_tuba_tuba_delux",
    "_rev": "1-c617189487fbe325d01cb7fc74acf45b",
    "name": "Tuba Delux",
    "category": "tuba",
    "group": "brass",
    "retailPrice": 300,
    "manufacturer": "Symphonic, Inc.",
    "type": "instrument"
  }
  ```

- Update an instrument

  `PUT /instruments/:id`

  Updates a specific instrument as identified by the `:id` path parameter.  The request body must contain a JSON object that represents the instrument being updated.  The request body must include the `_id`, `_rev`, `type`, `name`, `category`, `group`, `retailPrice`, and `manufacturer` fields.  Not providing the most recent `_rev` value will cause an HTTP 409 - conflict error to occur.

  **Sample Request**

  ```
  PUT /instruments/instrument_oboe_oboe_beethoven
  ```

  **Sample Request Body JSON Data**

  ```
  {
      "_id": "instrument_oboe_oboe_beethoven",
      "_rev": "2-b8ed010219944478ff073b61387026c9",
      "name": "Oboe Beethoven",
      "type": "instrument",
      "category": "Oboe",
      "group": "winds",
      "retailPrice": 602,
      "manufacturer": "Symphonic, Inc."
  }
  ```

  **Sample Response**

  ```
  {
    "ok": true,
    "id": "instrument_oboe_oboe_beethoven",
    "rev": "3-7e9b8cac710e70bfe0bef2de7bb3cfdb"
  }
  ```

- Delete an instrument

  `DELETE /instruments/:id`  

  Deletes a specific instrument as identified by the `:id` path parameter.

  **Sample Request**

  ```
  DELETE /instruments/instrument_tuba_tuba_delux
  ```

  **Sample Response**

  ```
  {
      "ok": true,
      "id": "instrument_tuba_tuba_delux",
      "rev": "2-fdd7fcbc62477372240862772d91c88f"
  }
  ```

- List Instruments

  `GET /instruments`

  Returns a collection of instruments sorted by category and name. An optional `limit` query parameter provides a limit on the number of objects returned. Default `limit` value is 5. When used in conjunction with `limit`, an optional `lastItem` query parameter provides the ability to return the next page of instruments.

  **Examples**

  - `GET /instruments?limit=3` returns an JSON array of 3 instruments.

    **Sample Response**

    ```
    [
      {
        _id: "instrument_cello_cello_platinum",
        _rev: "1-58f65a903e5dbb7014fbaed615679fc4",
        name: "Cello Platinum",
        type: "instrument",
        category: "cello",
        group: "strings",
        retailPrice: 600,
        manufacturer: "Strings, Inc."
      },
      {
        _id: "instrument_cello_cello_silver",
        _rev: "1-a197f838a82a4c5d10b59bf952333b97",
        name: "Cello Silver",
        type: "instrument",
        category: "cello",
        group: "strings",
        retailPrice: 350,
        manufacturer: "Strings, Inc."
      },
      {
        _id: "instrument_oboe_oboe_beethoven",
        _rev: "1-c81009c30bac5b947277709da1e2d4a3",
        name: "Oboe Beethoven",
        type: "instrument",
        category: "Oboe",
        group: "winds",
        retailPrice: 599,
        manufacturer: "Symphonic, Inc."
      }
    ]
    ```

  - `GET /instruments?limit=3&lastItem=instrument_oboe_oboe_beethoven` to get the next page of results:

    ```
    [
      {
        _id: "instrument_piccolo_piccolo_bach",
        _rev: "1-bc3d9d0945d7f8f50eb6457b1b5caad2",
        name: "Piccolo Bach",
        type: "instrument",
        category: "piccolo",
        group: "winds",
        retailPrice: 300,
        manufacturer: "Symphonic, Inc."
      },
      {
        _id: "instrument_piccolo_piccolo_beethoven",
        _rev: "1-9f76dada5ab312848107f953b3be733d",
        name: "Piccolo Beethoven",
        type: "instrument",
        category: "piccolo",
        group: "winds",
        retailPrice: 500,
        manufacturer: "Symphonic, Inc."
      },
      {
        _id: "instrument_saxophone_jazzy_100",
        _rev: "1-620cfb22db79f8d153ed0d7a0b0431fd",
        name: "Jazzy 100",
        type: "instrument",
        category: "saxophone",
        group: "winds",
        retailPrice: 300,
        manufacturer: "Musical Winds, Inc."
      }
    ]
    ```

### Step 4 - Getting Started

Create developer on-boarding instructions by creating a **README.md** file.  Include the following sections:

#### Getting Started

- Provide instruction on how to

  - Clone your repo
  - Install dependencies
  - Establish environment variables
  - Load data
  - Load indexes
  - Start the API
