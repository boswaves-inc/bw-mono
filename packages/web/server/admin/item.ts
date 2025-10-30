import express from "express"
import type { Postgres } from "../postgres";
import type Chargebee from "chargebee";

export default <TSchema extends Record<string, unknown>>({ postgres, chargebee }: { postgres: Postgres<TSchema>, chargebee: Chargebee }) => {
    const router = express.Router()

    // Create script item
    router.post('/', (req, res) => {

    })

    router.get('/:id', (req, res) => {
        
    })
    
    router.put('/:id', (req, res) => {

    })
    
    return router;
}