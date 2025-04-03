/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1970519189")

  // update collection data
  unmarshal({
    "name": "tasks"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1970519189")

  // update collection data
  unmarshal({
    "name": "task"
  }, collection)

  return app.save(collection)
})
