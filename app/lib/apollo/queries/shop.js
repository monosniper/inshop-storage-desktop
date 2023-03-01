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

export const GET_SHOPS = gql`
    query Shops($userId: ID!) {
        shops(userId: $userId) {
            options
            Domain {
                name
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
            uuid
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
            
            Media {
                name
                filename
            }

            Category {
                id
                title
                uuid
            
                Media {
                    name
                    filename
                }
            }
        }
    }
`

export const GET_CATEGORIES = gql`
    query Categories {
        categories {
            id
            title
            uuid
            
            Media {
                name
                filename
            }
        }
    }
`

export const GET_CLIENTS = gql`
    query Clients {
        clients {
            id
            age
            fio
            email
            address
            phone
            uuid
            
            Media {
                name
                filename
            }
        }
    }
`

export const GET_MODULES = gql`
    query Modules {
        modules {
            id
            uuid
            title
            description
            price
            slug
            options
          
            buyed
            
            Media {
                name
                filename
            }
            
            Dependencies {
                id
                
                Dependencies {
                    id
                }
            }
        }
    }
`