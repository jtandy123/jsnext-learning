const promise = import('./es.mjs')
promise.then(es_namespace => {
    console.log(es_namespace)
})