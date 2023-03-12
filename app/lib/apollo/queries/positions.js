import {gql} from "@apollo/client";

export const SEARCH_POSITIONS = gql`
    query Positions($query: String, $userId: ID, $limit: Int) {
        positions(query: $query, userId: $userId, limit: $limit) {
            uuid
            title
            
            Media {
                name
                filename
            }
        }
    }
`