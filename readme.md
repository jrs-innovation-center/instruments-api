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
3)  

## Steps

Successfully complete the first 4 steps to receive a grade of 'Meets Expectations'.  Additionally, successfully complete steps Y and Z to receive a grade of 'Exceeds Expectations'. Complete additional steps to receive a grade of 'Outstanding'.

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

Review the information below  and create the described functionality.




- List Instruments

  VERB      | ENDPOINT                               | DESCRIPTION  
  ----------|----------------------------------------|-------------------------------------------------------------
  GET       | /instruments                           | Returns a collection of instruments sorted by category and name. An optional `limit` query parameter provides a limit on the number of objects returned. Default `limit` value is 5. When used in conjunction with `limit`, an optional `lastItem` query parameter provides the ability to return the next page of instruments.

  **Examples**

  - `GET /instruments?limit=3` returns an JSON array of 3 instruments.
  -

  ```

  ```

  -


- Put any Mango indexes within a file named **load-index.js**.

### Step X -

Create developer on-boarding instructions by including a **README.md** file.  Include the following sections:

#### Getting Started

- Provide instruction on how to

  - Clone your repo
  - Install dependencies
  - Establish environment variables
  - Load data
  - Load indexes
  - Start the API

You should also provide documentation on each endpoint.  Provide the following details with each endpoint:

- HTTP Method (Ex:  GET)
- Path (Ex:  /cats)
- Path parameters  (Ex: /cats/{cat_id})
- Query Request Parameters (ex: ?limit=10)

Submit your test by sending Trip and Tom a direct message containing your GitHub repo url.  

Create the following endpoints:

- `POST \instruments`
- `GET \instruments`
- `PUT \instruments`
- `DELETE \instruments
