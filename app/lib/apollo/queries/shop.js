import {gql} from "@apollo/client";

export const GET_SHOP = gql`
    query Shop($host: String!) {
        shop(host: $host) {
            options
            Categories {
                id
                title
            }
            Modules {
                slug
                
                Shop_Module {
                    isActive
                }
            }
            Colors {
                slug
                
                Shop_Color {
                    value
                }
            }
            Positions {
                id
                type
                price
                discount
                discount_type
                priority
                description
                title
                subtitle
                inStock
                properties
                
                Category {
                    id
                    title
                }
            }
            Filters {
                id
                slug
            }
        }
    }
`

export const GET_POSITIONS = gql`
    query Positions {
        positions {
            id
            type
            price
            discount
            discount_type
            priority
            description
            title
            subtitle
            inStock
            properties

            Category {
                id
                title
            }
        }
    }
`

export const GET_CATEGORIES = gql`
    query Categories {
        categories {
            id
            title
        }
    }
`