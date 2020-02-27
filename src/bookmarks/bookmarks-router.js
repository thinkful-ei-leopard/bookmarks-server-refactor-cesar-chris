const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const { bookmarks } = require('../store')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter
    .route('/')
    .get((req, res) => {
        res.json(bookmarks)
    })
    .post(bodyParser, (req, res) => {
        const { title, url, rating, description } = req.body

        if(!title || !rating || !url) {
            logger.error(`title, rating, url are REQUIRED`)
            return res
                    .status(400)
                    .send('invalid data')
        }

        if(url.length < 5) {.0
            logger.error(`url needs to be at least 5 chars in length`)
            return res
                    .status(400)
                    .send('url needs to be at least 5 chars in length')
        }
        if(Math.floor(rating) > 5) {
            logger.error(`rating must be 1-5`)
            return res
                .status(400)
                .send('rating must be 1-5')
        }

        const id = uuid()
        const bookmark = {
            id,
            title,
            url,
            rating,
            description
        }

        bookmarks.push(bookmark)
        logger.info(`bookmark with id ${id} created`)
        res.status(201).location(`http://localhost:8000/bookmarks/${id}`).json({id})
    })

bookmarkRouter
    .route('/:id')
    .get((req, res) => {
        const { id } = req.params
        const bookmark = bookmarks.find( e => e.id == id)
    
        if(!bookmark) {
            logger.error(`list with id ${id} not found.`)
            return res.status(404).send('bookmark not found')
        }
    
        res.json(bookmark)
    })
    .delete((req, res) => {
        const { id } = req.params

        const bookmarkIndex = bookmarks.findIndex( bookmark => bookmark.id == id)

        if(bookmarkIndex === -1) {
            logger.error(`bookmark with id ${id} not found`)
            return res.status(404).send('bookmark not found')
        }

        bookmarks.splice(bookmarkIndex, 1)

        logger.info(`bookmark with id ${id} deleted`)
        res.status(204).end()
    })

    module.exports = bookmarkRouter