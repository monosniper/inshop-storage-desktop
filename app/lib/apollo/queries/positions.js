import {gql} from "@apollo/client";

export const SEARCH_POSITIONS = gql`
    query Positions($query: String, $limit: Int) {
        positions(query: $query, limit: $limit) {
            uuid
            title
            
            Media {
                name
                filename
            }
        }
    }
`